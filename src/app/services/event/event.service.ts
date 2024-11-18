import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event } from '../../models/event/event';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // Injection globale
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api/event'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer tous les jeux et les mapper au modèle Game
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(
      map((data) => data.map((json) => Event.createFrom(json))) // Mapper les objets JSON
    );
  }

  getEventActive(): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/isActive}`).pipe(
      map((json) => Event.createFrom(json)) // Mapper l'objet JSON au modèle Game
    ); }
}

