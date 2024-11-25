import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { GameLabelService } from '../../services/game_label/game-label.service';
import { GameLabel } from '../../models/game_label/game-label';
import { stockService } from '../../services/stock/stock.service';
import { Stock } from '../../models/stock/stock';
import { EventComponent } from '../event/event.component';
import { User } from '../../models/user/user';
import { Event } from '../../models/event/event';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game/game.service';
import { EventService } from '../../services/event/event.service';
import { Game } from '../../models/game/game';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  standalone: true,
  imports : [CommonModule]
})
export class StockComponent implements OnInit, OnDestroy{
  gamesSold: GameLabel[] = [];
  gamesInStock: GameLabel[] = [];
  sellerId: User = new User({
    _id: '0',               // Placeholder ID
    firstname: 'Placeholder', // Placeholder name
    name: 'User',
    email: 'placeholder@example.com', // Placeholder email
    role: 'seller',            // Default role
  });
  
  eventId: string = '';
  eventName: string = '';  // Variable pour stocker le nom du jeu
  remainingTime: string = '';
  private timer: any; // Pour stocker l'identifiant du setInterval
  totalStock: Stock = new Stock({
    _id: '',
    games_id: [],
    seller_id: new User({
      _id: '0',
      firstname: 'Placeholder',
      name: 'User',
      email: 'placeholder@example.com',
      role: 'seller',
    }),
    games_sold: [],
  });
  
  gamesNames: { [key: string]: string } = {};
  

  constructor(
    private route: ActivatedRoute,
    private gameLabelService: GameLabelService,
    private gameService: GameService,
    private cdr: ChangeDetectorRef,  // Injecter ChangeDetectorRef
    private eventService: EventService,
    private stockService: stockService
  ) {}
  ngOnInit(): void {
     // Récupérer l'ID du jeu depuis l'URL
     this.route.paramMap.subscribe((params) => {
      this.sellerId._id = params.get('id') || '';
      console.log(this.sellerId);
      this.fetchEventDetails();
      this.fetchGamesInStock(this.sellerId._id);
      this.fetchGamesSold(this.sellerId._id);
    });
  }
  ngOnDestroy(): void {
    // Nettoyer le timer lorsque le composant est détruit
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

   // Méthode pour récupérer les détails de l'évent actuel
   fetchEventDetails(): void {
    this.eventService.getEventActive().subscribe({
      next: (session: Event) => {
        this.eventName = session.name;  // Stocker le nom de la session
        this.eventId = session._id;
        console.log(`Fetching game for event_id ${session._id}`);
        this.calculateRemainingTime(new Date(session.end)); // Calcul initial

        // Démarrer le timer uniquement sur le client et pas côté serveur
        if (typeof window !== 'undefined') {
          this.startTimer(new Date(session.end)); 
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la session :', error);
      },
    });
  }

  // Méthode pour récupérer le nom des jeux déposés par les vendeurs
  fetchGameName(gameId: string): void {
    this.gameService.getGameById(gameId).subscribe({
      next: (game: Game) => {
        this.gamesNames[gameId] = game.name; // Stocker le nom du jeu dans l'objet gamesNames
        this.cdr.detectChanges(); // Assurez-vous que la vue est mise à jour après modification
      },
      error: (error) => {
        console.error(`Erreur lors de la récupération du jeu avec ID ${gameId}:`, error);
      },
    });
  }
  

   // Méthode pour calculer le temps restant
   calculateRemainingTime(endDate: Date): void {
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();

    if (difference <= 0) {
      this.remainingTime = 'Session terminée'; // Si la session est terminée
      if (this.timer) {
        clearInterval(this.timer); // Arrêter le timer
      }
      return;
    }
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    this.remainingTime = `${days} jours, ${hours} heures, ${minutes} minutes`;
  }

    // Méthode pour démarrer le timer
    startTimer(endDate: Date): void {
      if (this.timer) {
        clearInterval(this.timer); // Assurez-vous que le timer précédent est nettoyé
      }
  
      // Mettre à jour chaque minute (pas nécessaire côté SSR)
      this.timer = setInterval(() => {
        this.calculateRemainingTime(endDate);
      }, 60000); // Toutes les 60 secondes
    }


    // Méthode pour récupérer les GameLabels associés au jeu
    fetchGamesInStock(sellerId: string): void {
      this.stockService.getStocksByClientId(sellerId).subscribe({
        next: (stock: Stock) => {
          console.log('Stock complet reçu :', JSON.stringify(stock, null, 2));
          console.log("Vérification de stock.games_id :", JSON.stringify(stock.games_id, null, 2));  // Ajoute cette ligne pour voir ce que contient réellement stock.games_id

    
          if (!stock) {
            console.log('Aucun stock trouvé pour ce vendeur.');
            return;
          }
    
          // Vérifie si games_id existe et est un tableau
          if (!Array.isArray(stock.games_id) || stock.games_id.length === 0) {
            console.error("games_id n'est pas un tableau valide ou est vide :", stock.games_id);
            return;
          }
    
          console.log('games_id est un tableau valide, traitement en cours...');
    
          // Réinitialiser le tableau des jeux en stock
          this.gamesInStock = [];
    
          stock.games_id.forEach((gameData) => {
            // Vérifie si gameData est un objet avec les bonnes propriétés
            if (gameData && gameData.game_id) {
              this.gameLabelService.getGameLabelById(gameData._id).subscribe({
                next: (gameLabel: GameLabel) => {
                  // Ajouter le GameLabel au tableau des jeux en stock
                  this.gamesInStock.push(gameLabel);
                  
                  // Utiliser gameLabel.game_id pour récupérer le nom du jeu
                  this.fetchGameName(gameLabel.game_id); // GameLabel a un game_id qui correspond à l'ID du jeu
                  
                  // Mettre à jour la vue
                  this.cdr.detectChanges();
                  console.log('GameLabel fetched:', gameLabel);
                },
                error: (error) => {
                  console.error(`Erreur lors de la récupération du GameLabel avec ID ${gameData.game_id}:`, error);
                },
              });
            } else {
              console.error("Données de jeu manquantes ou invalides :", gameData);
            }
          });
        },
        error: (error) => {
          console.error('Erreur lors de la récupération du stock :', error);
        },
      });
    }
    
    loadStockById(id: string): void {
      this.stockService.getStockById(id).subscribe(
        (data) => {
          this.totalStock = data;
          console.log('Stock récupéré :', this.totalStock); // Vérifie la structure
        },
        (error) => {
          console.error('Erreur lors de la récupération du stock:', error);
        }
      );
    }
    
    
    
    
    
    // Méthode pour récupérer les GameLabels associés au jeu
    fetchGamesSold(sellerId: string): void {
      this.stockService.getStocksByClientId(sellerId).subscribe({
        next: (stock: Stock) => {
          console.log('Stock complet reçu :', JSON.stringify(stock, null, 2));
          console.log("Vérification de stock.games_sold :", JSON.stringify(stock.games_sold, null, 2));  // Ajoute cette ligne pour voir ce que contient réellement stock.games_id

    
          if (!stock) {
            console.log('Aucun stock trouvé pour ce vendeur.');
            return;
          }
    
          // Vérifie si games_id existe et est un tableau
          if (!Array.isArray(stock.games_sold) || stock.games_sold.length === 0) {
            console.error("games_sold n'est pas un tableau valide ou est vide :", stock.games_sold);
            return;
          }
    
          console.log('games_sold est un tableau valide, traitement en cours...');
    
          // Réinitialiser le tableau des jeux en stock
          this.gamesSold = [];
    
          stock.games_sold.forEach((gameData) => {
            // Vérifie si gameData est un objet avec les bonnes propriétés
            if (gameData && gameData.game_id) {
              this.gameLabelService.getGameLabelById(gameData._id).subscribe({
                next: (gameLabel: GameLabel) => {
                  // Ajouter le GameLabel au tableau des jeux en stock
                  this.gamesSold.push(gameLabel);
                  
                  // Utiliser gameLabel.game_id pour récupérer le nom du jeu
                  this.fetchGameName(gameLabel.game_id); // GameLabel a un game_id qui correspond à l'ID du jeu
                  
                  // Mettre à jour la vue
                  this.cdr.detectChanges();
                  console.log('GameLabel fetched:', gameLabel);
                },
                error: (error) => {
                  console.error(`Erreur lors de la récupération du GameLabel avec ID ${gameData.game_id}:`, error);
                },
              });
            } else {
              console.error("Données de jeu manquantes ou invalides :", gameData);
            }
          });
        },
        error: (error) => {
          console.error('Erreur lors de la récupération du stock :', error);
        },
      });
    }
    
    


}
