import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { GameLabelService } from '../../services/game_label/game-label.service';
import { GameLabel } from '../../models/game_label/game-label';
import { stockService } from '../../services/stock/stock.service';
import { Stock } from '../../models/stock/stock';
import { EventComponent } from '../event/event.component';
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
  sellerId: string = '';
  eventId: string = '';
  eventName: string = '';  // Variable pour stocker le nom du jeu
  remainingTime: string = '';
  private timer: any; // Pour stocker l'identifiant du setInterval
  totalStock: Stock[] = [];
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
      this.sellerId = params.get('id') || '';
      console.log(this.sellerId);
      this.fetchEventDetails();
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
        this.gamesNames[gameId] = `${game.name}`;
        this.cdr.detectChanges();  // Assurez-vous que la vue est mise à jour après modification
      },
      error: (error) => {
        console.error(`Erreur lors de la récupération du vendeur avec ID ${gameId}:`, error);
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
      // Appeler le service pour récupérer le stock du vendeur
      this.stockService.getStocksByClientId(sellerId).subscribe({
        next: (stock: Stock) => {
          if (stock) {
            // Réinitialiser le tableau des jeux en stock
            this.gamesInStock = [];
    
            // Parcourir les IDs des jeux en stock
            stock.games_id.forEach((gameId) => {
              // Récupérer chaque GameLabel par son ID
              this.gameLabelService.getGameLabelById(gameId).subscribe({
                next: (gameLabel: GameLabel) => {
                  this.gamesInStock.push(gameLabel); // Ajouter le GameLabel au tableau
                  this.fetchGameName(gameId); // Récupérer et stocker le nom du jeu
                  this.cdr.detectChanges(); // Mettre à jour la vue
                },
                error: (error) => {
                  console.error(`Erreur lors de la récupération du GameLabel avec ID ${gameId}:`, error);
                },
              });
            });
          } else {
            console.log('Aucun stock trouvé pour ce vendeur.');
          }
        },
        error: (error) => {
          console.error('Erreur lors de la récupération du stock :', error);
        },
      });
    }
    // Méthode pour récupérer les GameLabels associés au jeu
    fetchGamesSold(sellerId: string): void {
    // Appeler le service pour récupérer le stock du vendeur
        this.stockService.getStocksByClientId(sellerId).subscribe({
          next: (stock: Stock) => {
            if (stock) {
              // Réinitialiser le tableau des jeux en stock
              this.gamesSold = [];
      
              // Parcourir les IDs des jeux en stock
              stock.games_sold.forEach((gameId) => {
                // Récupérer chaque GameLabel par son ID
                this.gameLabelService.getGameLabelById(gameId).subscribe({
                  next: (gameLabel: GameLabel) => {
                    this.gamesSold.push(gameLabel); // Ajouter le GameLabel au tableau
                    this.fetchGameName(gameId); // Récupérer et stocker le nom du jeu
                    this.cdr.detectChanges(); // Mettre à jour la vue
                  },
                  error: (error) => {
                    console.error(`Erreur lors de la récupération du GameLabel avec ID ${gameId}:`, error);
                  },
                });
              });
            } else {
              console.log('Aucun stock trouvé pour ce vendeur.');
            }
          },
          error: (error) => {
            console.error('Erreur lors de la récupération du stock :', error);
          },
        });
      }
    
    


}
