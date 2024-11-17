import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game/game.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  imports: [CommonModule],
  standalone : true
})
export class EventComponent implements OnInit {
  games: any[] = []; // Liste des jeux récupérés depuis le backend

  constructor(private router: Router, private gameService: GameService) {} // Injection du service

  ngOnInit(): void {
    this.fetchGames(); // Récupération des données à l'initialisation
  }

  fetchGames(): void {
    this.gameService.getGames().subscribe({
      next: (data) => {
        this.games = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des jeux :', error);
      },
      complete: () => {
        console.log('Récupération des jeux terminée.');
      },
    });    
  }

  goToGameComponent(gameId: string) {
    this.router.navigate([`/game/${gameId}`]);
  }

}
