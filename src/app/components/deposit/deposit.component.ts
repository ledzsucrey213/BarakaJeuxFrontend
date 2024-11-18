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
  eventName: string = '';  // Variable pour stocker le nom du jeu
  searchName: string = ''; 
  price: number | null = null; 
  quantity: number | null = null; 
  condition: string = 'New';
  gamesNames: { [key: string]: string } = {};
  remainingTime: string = '';
  private timer: any; // Pour stocker l'identifiant du setInterval

  constructor(
    private route: ActivatedRoute,
    private gameLabelService: GameLabelService,
    private gameService : GameService,
    private cdr: ChangeDetectorRef,  // Injecter ChangeDetectorRef
    private eventService : EventService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du jeu depuis l'URL
    this.route.paramMap.subscribe((params) => {
      this.sellerId = params.get('id') || '';
      console.log(this.sellerId);
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
  fetchEventDetails(gameId: string): void {
    this.eventService.getEventActive().subscribe({
      next: (session: Event) => {
        this.eventName = session.name;  // Stocker le nom de la session
        this.calculateRemainingTime(new Date(session.end)); // Calcul initial
        this.startTimer(new Date(session.end)); // Lancer le timer
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
            this.fetchGameName(gameLabel.game_id);  // Récupérer le nom du vendeur
          }
          else {console.log(`Fail`)}
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

    addGames() : void {}

    endDeposit() : void {}



    // méthode pour timer
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
  
    startTimer(endDate: Date): void {
      // Mettre à jour chaque minute
      this.timer = setInterval(() => {
        this.calculateRemainingTime(endDate);
      }, 60000); // Toutes les 60 secondes
    }

}
