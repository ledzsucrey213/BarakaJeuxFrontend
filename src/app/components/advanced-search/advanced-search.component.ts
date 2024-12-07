import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { GameLabelService } from '../../services/game_label/game-label.service';
import { GameLabel } from '../../models/game_label/game-label';
import { EventService } from '../../services/event/event.service';
import { Event } from '../../models/event/event';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game/game.service';
import { Game } from '../../models/game/game';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdvancedSearchComponent implements OnInit, OnDestroy {
  gamelabels: GameLabel[] = [];
  gamelabelsfiltered: GameLabel[] = [];

  eventId: string = '';
  eventName: string = '';  // Variable pour stocker le nom du jeu

  minPrice: number = 0;
  maxPrice: number = 1000;
  selectedCondition: string = '';
  descriptionFilter: string = '';

  gamesNames: { [key: string]: string } = {};
  gameEditors: { [key: string]: string } = {};
  gameDescriptions: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private gameLabelService: GameLabelService,
    private gameService: GameService,
    private cdr: ChangeDetectorRef,  // Injecter ChangeDetectorRef
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.fetchGameLabels(); // Charger les game labels
      this.fetchEventDetails(); // Charger les détails de l'événement actif
    });
  }

  ngOnDestroy(): void {
  }
  goToGameComponent(gameId: string): void {
    // Use the Router service to navigate to the game details page
    this.router.navigate([`/game/${gameId}`]);
  }

  filterByPrice(): void {
    this.gamelabelsfiltered = this.gamelabels.filter(label => {
      const price = label.price;
      return price >= this.minPrice && price <= this.maxPrice;
    });
  }
  

  fetchEventDetails(): void {
    this.eventService.getEventActive().subscribe({
      next: (session: Event) => {
        this.eventName = session.name;
        this.eventId = session._id;
        console.log(`Fetching game for event_id ${session._id}`);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la session :', error);
      },
    });
  }

  fetchGameDetails(gameId: string): void {
    // Vérifier si le nom du jeu, l'éditeur et la description sont déjà chargés
    if (this.gamesNames[gameId] && this.gameEditors[gameId] && this.gameDescriptions[gameId]) {
      return;
    }

    this.gameService.getGameById(gameId).subscribe({
      next: (game: Game) => {
        this.gamesNames[gameId] = game.name;
        this.gameEditors[gameId] = game.editor;
        this.gameDescriptions[gameId] = game.description;
        this.cdr.detectChanges(); // Mettre à jour la vue
      },
      error: (error) => {
        console.error(`Erreur lors de la récupération du jeu avec ID ${gameId}:`, error);
      },
    });
  }

  
  fetchGameLabels(): void {
    this.gameLabelService.getGameLabels().subscribe({
      next: (labels: GameLabel[]) => {
        this.gamelabels = labels;
        this.gamelabelsfiltered = [...labels];

        // Récupérer les détails des jeux pour chaque game_label
        labels.forEach((label) => this.fetchGameDetails(label.game_id));

        console.log('Game Labels fetched successfully:', labels);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des game labels:', err);
      },
    });
  }

  filterByName(event: globalThis.Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    this.gamelabelsfiltered = this.gamelabels.filter((label) => {
      const gameName = this.gamesNames[label.game_id]?.toLowerCase() || '';
      return gameName.includes(filterValue);
    });
  }

  filterByEditor(event: globalThis.Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    this.gamelabelsfiltered = this.gamelabels.filter((label) => {
      const gameEditor = this.gameEditors[label.game_id]?.toLowerCase() || '';
      return gameEditor.includes(filterValue);
    });
  }

  filterByCondition(event: globalThis.Event): void {
    const selectedCondition = (event.target as HTMLSelectElement).value;
    this.selectedCondition = selectedCondition;

    this.gamelabelsfiltered = this.gamelabels.filter(label =>
      selectedCondition ? label.condition === selectedCondition : true
    );
  }

  sortBy(event: globalThis.Event): void {
    const sortValue = (event.target as HTMLSelectElement).value;
    switch (sortValue) {
      case 'price-asc':
        this.gamelabelsfiltered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.gamelabelsfiltered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        this.gamelabelsfiltered.sort((a, b) => new Date(b.creation).getTime() - new Date(a.creation).getTime());
        break;
      case 'oldest':
        this.gamelabelsfiltered.sort((a, b) => new Date(a.creation).getTime() - new Date(b.creation).getTime());
        break;
    }
  }

  filterByDescription(event: globalThis.Event): void {
    const query = (event.target as HTMLTextAreaElement).value.toLowerCase();
    this.descriptionFilter = query;

    this.gamelabelsfiltered = this.gamelabels.filter((label) => {
      const gameDescription = this.gameDescriptions[label.game_id]?.toLowerCase() || '';
      return gameDescription.includes(query);
    });
  }

  resetFilters(): void {
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.selectedCondition = '';
    this.descriptionFilter = '';
    this.gamelabelsfiltered = [...this.gamelabels];
  }
}
