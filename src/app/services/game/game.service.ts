import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game } from '../../models/game/game';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // Injection globale
})
export class GameService {
  private apiUrl = 'http://localhost:3000/api/game'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer tous les jeux et les mapper au modèle Game
  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl).pipe(
      map((data) => data.map((json) => Game.createFrom(json))) // Mapper les objets JSON
    );
  }

  getGameById(id: string): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${id}`).pipe(
      map((json) => Game.createFrom(json)) // Mapper l'objet JSON au modèle Game
    ); }

  updateGame(gameId: string, updatedGame: Partial<Game>): Observable<Game> {
    const url = `${this.apiUrl}/${gameId}`; // URL de la ressource à mettre à jour
    return this.http.put<Game>(url, updatedGame);
  }
}
