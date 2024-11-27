import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { GameLabel } from '../../models/game_label/game-label';
import { Game } from '../../models/game/game';

@Injectable({
  providedIn: 'root',
})
export class GameLabelService {
  private apiUrl = 'http://localhost:3000/api/game_label'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  getGameLabels(): Observable<any> {
    return this.http.get(`${this.apiUrl}`); // Requête pour récupérer tous les game_labels
  }

  getGameLabelById(id: string): Observable<GameLabel> {
    return this.http.get<GameLabel>(`${this.apiUrl}/${id}`).pipe(
      map((json) => GameLabel.createFrom(json)) // Mapper l'objet JSON au modèle Game
    ); }

  getGameLabelsByGameId(gameId: string): Observable<GameLabel[]> {
    return this.http.get<GameLabel[]>(`${this.apiUrl}/game/${gameId}`);
  }

  getGameLabelsBySellerId(sellerId: string): Observable<GameLabel[]> {
    return this.http.get<GameLabel[]>(`${this.apiUrl}/seller/${sellerId}`);
  }

  postGameLabels(gameLabels: Omit<GameLabel, '_id'>[]): Observable<GameLabel[]> {
    return this.http.post<GameLabel[]>(`${this.apiUrl}/deposit`, gameLabels);
  }
   // Méthode pour récupérer les informations de chaque jeu associé
   getGamesFromLabels(gameLabels: GameLabel[]): Observable<Game[]> {
    const gameRequests = gameLabels.map((label) =>
      this.http.get<Game>(`${this.apiUrl}/${label.game_id}`) // Requête pour chaque game_id
    );

    return forkJoin(gameRequests).pipe(
      map((games) => games.map((json) => Game.createFrom(json))) // Mapper chaque JSON en Game
    );
  }
  

}
