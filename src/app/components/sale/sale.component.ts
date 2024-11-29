import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameLabelService } from '../../services/game_label/game-label.service';
import { GameService } from '../../services/game/game.service';
import { EventService } from '../../services/event/event.service';
import { ChangeDetectorRef } from '@angular/core';
import { Event } from '../../models/event/event';
import { GameLabel } from '../../models/game_label/game-label';
import { Game } from '../../models/game/game';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';
import { stockService } from '../../services/stock/stock.service';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})


export class SaleComponent {
  eventId: string = '';
  eventName: string = '';
  remainingTime: string = '';
  private timer: any; // Pour stocker l'identifiant du setInterval
  cartGames : GameLabel[] = []
  gamesNames: { [key: string]: string } = {};
  filteredGames: GameLabel[] = []; // Jeux filtrés pour l'affichage
  searchName: string = ''; 
  searchSubject: Subject<string> = new Subject<string>();
  allGameLabels: GameLabel[] = [];
  dropdownVisible: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private gameLabelService: GameLabelService,
    private gameService: GameService,
    private cdr: ChangeDetectorRef,  // Injecter ChangeDetectorRef
    private eventService: EventService,
    private stockService : stockService
  ) {}


  ngOnInit(): void {
    this.fetchEventDetails();
    this.fetchAllGameLabels();
  }

  ngOnDestroy(): void {
    // Nettoyer le timer lorsque le composant est détruit
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    // Vérifier si le clic est à l'intérieur du dropdown ou de la barre de recherche
    if (!targetElement.closest('.search-bar')) {
      this.dropdownVisible = false;
    }
  }

  // Méthode déclenchée lorsque l'utilisateur tape dans la barre de recherche
  onSearchChange(): void {
    const searchTerm = this.searchName.toLowerCase().trim();
  
    // Filtrer les jeux en fonction du texte saisi dans la barre de recherche
    this.filteredGames = this.allGameLabels.filter((game) => {
      const gameName = this.gamesNames[game.game_id]?.toLowerCase() || '';
      return gameName.includes(searchTerm); // Vérifie si le nom contient le terme recherché
    });

    // Ouvrir le dropdown si un terme est saisi et des résultats existent
    this.dropdownVisible = searchTerm.length > 0 && this.filteredGames.length > 0
  }
  

  // Récupérer tous les jeux depuis GameService
  fetchAllGameLabels(): void {
    this.gameLabelService.getGameLabels().subscribe({
      next: (games: GameLabel[]) => {
        this.allGameLabels = games;
        this.filteredGames = games; // Initialement, tous les jeux sont visibles

        this.allGameLabels.forEach(gameLabel => {
          if (!this.gamesNames[gameLabel.game_id]) {
            this.fetchGameName(gameLabel.game_id); // Appel pour récupérer le nom du jeu
          }
        });

      },
      error: (error) => {
        console.error('Erreur lors de la récupération des jeux :', error);
      },
    });
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

  calculateTotal(): number {
    // On utilise reduce pour additionner les prix des jeux
    return this.cartGames.reduce((total, game) => total + (game.price || 0), 0);
  }
  

  addToCart(game: GameLabel): void {
    this.cartGames.push(game);
  }
  
  pay(): void {
    if (!Array.isArray(this.cartGames) || this.cartGames.length === 0) {
      console.warn('Le panier est vide ou invalide.');
      return;
    }
  
    // Organiser les jeux par sellerId
    const gamesBySeller: { [sellerId: string]: GameLabel[] } = this.cartGames.reduce((acc, game) => {
      if (!game.seller_id) {
        console.warn('Un jeu sans sellerId a été trouvé et sera ignoré :', game);
        return acc;
      }
  
      if (!acc[game.seller_id]) {
        acc[game.seller_id] = [];
      }
  
      acc[game.seller_id].push(game);
      return acc;
    }, {} as { [sellerId: string]: GameLabel[] });
  
    console.log('Organisation des jeux par sellerId :', gamesBySeller);
  
    // Appeler sellGame pour chaque groupe de jeux d'un même sellerId
    Object.entries(gamesBySeller).forEach(([sellerId, soldGames]) => {
      this.stockService.sellGame(sellerId, soldGames);
    });
  }




}
