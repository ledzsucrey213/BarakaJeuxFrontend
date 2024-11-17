import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GameLabelService {
  private apiUrl = 'http://localhost:3000/api/game_label'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  getGameLabels(): Observable<any> {
    return this.http.get(`${this.apiUrl}`); // Requête pour récupérer tous les game_labels
  }
}
