import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameLabelService } from '../../services/game_label/game-label.service';
import { GameLabel } from '../../models/game_label/game-label';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { GameService } from '../../services/game/game.service';
import { Game } from '../../models/game/game';
import { EventService } from '../../services/event/event.service';
import { Event } from '../../models/event/event';
import { forkJoin, debounceTime, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Stock } from '../../models/stock/stock';
import { stockService } from '../../services/stock/stock.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})

export class DepositComponent implements OnInit, OnDestroy {
  gameLabels: GameLabel[] = [];
  sellerId: string = '';
  eventId: string = '';
  eventName: string = '';  // Variable pour stocker le nom du jeu
  searchName: string = ''; 
  price: number | null = null; 
  quantity: number | null = null; 
  condition: string = 'new';
  gamesNames: { [key: string]: string } = {};
  remainingTime: string = '';
  private timer: any; // Pour stocker l'identifiant du setInterval
  allGames: Game[] = [];
  filteredGames: Game[] = []; // Jeux filtrés pour l'affichage
  searchSubject: Subject<string> = new Subject<string>();
  addedGamesLabels: Omit<GameLabel, '_id'>[] = []; // Tableau pour les GameLabels ajoutés
  currentPage: number = 1; // Page actuelle
  gamesPerPage: number = 5; // Nombre de jeux par page


  constructor(
    private route: ActivatedRoute,
    private gameLabelService: GameLabelService,
    private gameService: GameService,
    private cdr: ChangeDetectorRef,  // Injecter ChangeDetectorRef
    private eventService: EventService,
    private stockService : stockService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du jeu depuis l'URL
    this.route.paramMap.subscribe((params) => {
      this.sellerId = params.get('id') || '';
      console.log(this.sellerId);
      this.fetchEventDetails();
      this.initializeSearchListener();
      this.fetchAllGames();
      this.fetchGameLabels(this.sellerId);  // Récupérer les GameLabels pour ce vendeur
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

  // Méthode pour récupérer les GameLabels associés au jeu
  fetchGameLabels(sellerId: string): void {
    this.gameLabelService.getGameLabelsBySellerId(sellerId).subscribe({
      next: (data) => {
        this.gameLabels = data;

        // Pour chaque GameLabel, récupérer le nom du jeu
        this.gameLabels.forEach((gameLabel) => {
          if (gameLabel.game_id) {
            console.log(`Fetching game for gameLabel ID: ${gameLabel._id}, game_id: ${gameLabel.game_id}`);
            this.fetchGameName(gameLabel.game_id);  // Récupérer le nom du jeu
          } else {
            console.log(`Fail`);
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des GameLabels :', error);
      },
      complete: () => {
        console.log('Récupération des GameLabels terminée.');
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


  // Récupérer tous les jeux depuis GameService
  fetchAllGames(): void {
    this.gameService.getGames().subscribe({
      next: (games: Game[]) => {
        this.allGames = games;
        this.filteredGames = games; // Initialement, tous les jeux sont visibles
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des jeux :', error);
      },
    });
  }

  // Gestion de la recherche avec debounce
  initializeSearchListener(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm) => {
      this.filteredGames = this.allGames.filter((game) =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.cdr.detectChanges(); // Mettre à jour la vue
    });
  }

  // Méthode déclenchée lorsque l'utilisateur tape dans la barre de recherche
  onSearchChange(): void {
    this.searchSubject.next(this.searchName);
  }

  // Sélectionner un jeu dans la liste
  selectGame(game: Game): void {
    this.searchName = game.name; // Remplir la barre de recherche avec le jeu sélectionné
    this.filteredGames = []; // Vider la liste après la sélection
    console.log('Jeu sélectionné :', game); // Debugging
  }

  getPaginatedGameLabels(): GameLabel[] {
    const startIndex = (this.currentPage - 1) * this.gamesPerPage;
    const endIndex = startIndex + this.gamesPerPage;
    return this.gameLabels.slice(startIndex, endIndex);
  }

  goToNextPage(): void {
    if (this.currentPage * this.gamesPerPage < this.gameLabels.length) {
      this.currentPage++;
    }
  }
  
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  



  addGames(): void {
    if (!this.searchName || !this.price || !this.condition) {
      console.error('Tous les champs doivent être remplis pour ajouter un jeu.');
      return;
    }

  
    // Trouver l'ID du jeu sélectionné
    const selectedGame = this.allGames.find(game => game.name === this.searchName);
  
    if (!selectedGame) {
      console.error('Jeu sélectionné introuvable.');
      return;
    }
  
    // Création du nouvel objet GameLabel
    const newGameLabel: Omit<GameLabel, '_id'> = {
      seller_id: this.sellerId,
      game_id: selectedGame._id,
      price: this.price,
      event_id: this.eventId, // Remplacer par l'ID réel de l'event
      condition: this.condition as 'new' | 'very good' | 'good' | 'poor',
      is_Sold: false,
      creation: new Date(),
      is_On_Sale: true,
    };
  
    // Ajouter au tableau des jeux ajoutés
    this.addedGamesLabels.push(newGameLabel);
  
    // Réinitialiser les champs du formulaire
    this.searchName = '';
    this.price = null;
    this.condition = 'New';
  
    console.log('Jeu ajouté :', newGameLabel);
  }


  endDeposit(): void {
    console.log('Début du dépôt');
  
    if (this.addedGamesLabels.length === 0) {
      console.warn('Aucun jeu à déposer.');
      return;
    }
  
    // Vérification que addedGamesLabels est bien un tableau avant l'appel
    if (!Array.isArray(this.addedGamesLabels)) {
      console.error('addedGamesLabels n\'est pas un tableau valide.');
      return;
    }
  
    // Publier tous les GameLabels via gameLabelService
    this.gameLabelService.postGameLabels(this.addedGamesLabels).subscribe({
      next: (createdGameLabels: GameLabel[]) => {
        console.log('Tous les jeux déposés avec succès :', createdGameLabels);
  
        // Appeler addNewGameLabelToStock après la publication complète
        this.stockService.addNewGameLabelToStock(this.sellerId);
  
        // Réinitialiser la liste après le succès
        this.addedGamesLabels = [];
      },
      error: (error) => {
        console.error('Erreur lors du dépôt des jeux :', error);
      },
    });
  }
  
  
  

  
  
  

  
  
  
  

}
