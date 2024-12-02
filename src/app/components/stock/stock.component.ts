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
export class StockComponent implements OnInit, OnDestroy {
  gamesSold: GameLabel[] = [];
  gamesInStock: GameLabel[] = [];
  sellerId: User = new User({
    _id: '0',               // Placeholder ID
    firstname: 'Placeholder', // Placeholder name
    name: 'User',
    email: 'placeholder@example.com', // Placeholder email
    role: 'seller',            // Default role
  });
  selectedGames: GameLabel[] = [];
  
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
    // Récupérer l'ID du vendeur depuis l'URL
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

  fetchEventDetails(): void {
    this.eventService.getEventActive().subscribe({
      next: (session: Event) => {
        this.eventName = session.name;  // Stocker le nom de la session
        this.eventId = session._id;
        console.log(`Fetching game for event_id ${session._id}`);
        this.calculateRemainingTime(new Date(session.end)); // Calcul initial

        if (typeof window !== 'undefined') {
          this.startTimer(new Date(session.end)); 
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la session :', error);
      },
    });
  }

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

  calculateRemainingTime(endDate: Date): void {
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();

    if (difference <= 0) {
      this.remainingTime = 'Session terminée';
      if (this.timer) {
        clearInterval(this.timer);
      }
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    this.remainingTime = `${days} jours, ${hours} heures, ${minutes} minutes`;
  }

  startTimer(endDate: Date): void {
    if (this.timer) {
      clearInterval(this.timer); 
    }

    this.timer = setInterval(() => {
      this.calculateRemainingTime(endDate);
    }, 60000); 
  }

  fetchGamesInStock(sellerId: string): void {
    this.stockService.getStocksBySellerId(sellerId).subscribe({
      next: (stock: Stock) => {
        console.log('Stock complet reçu :', JSON.stringify(stock, null, 2));

        if (!stock) {
          console.log('Aucun stock trouvé pour ce vendeur.');
          return;
        }

        if (!Array.isArray(stock.games_id) || stock.games_id.length === 0) {
          console.error("games_id n'est pas un tableau valide ou est vide :", stock.games_id);
          return;
        }

        console.log('games_id est un tableau valide, traitement en cours...');
        this.gamesInStock = [];
        console.log('1st games_id:', stock.games_id[0]);

        stock.games_id.forEach((gameId) => {
          this.gameLabelService.getGameLabelById(gameId._id).subscribe({
            next: (gameLabel: GameLabel) => {
              this.gamesInStock.push(gameLabel);
              this.fetchGameName(gameLabel.game_id);
              this.cdr.detectChanges();
              console.log('GameLabel fetched:', gameLabel);
            },
            error: (error) => {
              console.error(`Erreur lors de la récupération du GameLabel avec ID ${gameId}:`, error);
            },
          });
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du stock :', error);
      },
    });
  }

  fetchGamesSold(sellerId: string): void {
    this.stockService.getStocksBySellerId(sellerId).subscribe({
      next: (stock: Stock) => {
        console.log('Stock complet reçu :', JSON.stringify(stock, null, 2));

        if (!stock) {
          console.log('Aucun stock trouvé pour ce vendeur.');
          return;
        }

        if (!Array.isArray(stock.games_sold) || stock.games_sold.length === 0) {
          console.error("games_sold n'est pas un tableau valide ou est vide :", stock.games_sold);
          return;
        }

        console.log('games_sold est un tableau valide, traitement en cours...');
        this.gamesSold = [];

        stock.games_sold.forEach((gameId) => {
          this.gameLabelService.getGameLabelById(gameId._id).subscribe({
            next: (gameLabel: GameLabel) => {
              this.gamesSold.push(gameLabel);
              this.fetchGameName(gameLabel.game_id);
              this.cdr.detectChanges();
              console.log('GameLabel fetched:', gameLabel);
            },
            error: (error) => {
              console.error(`Erreur lors de la récupération du GameLabel avec ID ${gameId}:`, error);
            },
          });
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du stock :', error);
      },
    });
  }

  toggleGameSelection(game: GameLabel, event: globalThis.Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedGames.push(game);
    } else {
      this.selectedGames = this.selectedGames.filter((g) => g._id !== game._id);
    }
  }
  
  isSelected(game: GameLabel): boolean {
    return this.selectedGames.some((g) => g._id === game._id);
  }
  

  toggleSelectAll(event: globalThis.Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedGames = [...this.gamesInStock];
    } else {
      this.selectedGames = [];
    }
  }

  processSelectedGames(): void {
    if (this.selectedGames.length === 0) {
      alert('No games selected');
      return;
    }
  
    this.stockService.removeSelectedGames(this.sellerId._id, this.selectedGames).subscribe({
      next: (updatedStock: Stock) => {
        this.gamesInStock = this.gamesInStock.filter(
          (game) => !this.selectedGames.some((selectedGame) => selectedGame._id === game._id)
        );
        this.selectedGames = [];
        alert('Selected games have been removed successfully.');
      },
      error: (error) => {
        console.error('Error while removing selected games:', error);
        alert('An error occurred while processing the selected games.');
      },
    });
  }
  
  
}
