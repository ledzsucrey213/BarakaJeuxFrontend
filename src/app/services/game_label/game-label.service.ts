import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GameLabel } from '../../models/game_label/game-label';

@Injectable({
  providedIn: 'root',
})
export class GameLabelService {
  private apiUrl = 'http://localhost:3000/api/game_label'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  getGameLabels(): Observable<any> {
    return this.http.get(`${this.apiUrl}`); // Requête pour récupérer tous les game_labels
  }

  getGameLabelsByGameId(gameId: string): Observable<GameLabel[]> {
    return this.http.get<GameLabel[]>(`${this.apiUrl}/game/${gameId}`);
  }

  getGameLabelsBySellerId(sellerId: string): Observable<GameLabel[]> {
    return this.http.get<GameLabel[]>(`${this.apiUrl}/seller/${sellerId}`);
  }

  postGameLabels(gameLabels: GameLabel[]): Observable<GameLabel[]> {
    return this.http.post<GameLabel[]>(`${this.apiUrl}/deposit`, gameLabels);
  }
  

}
