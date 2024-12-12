import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  // Récupérer tous les vendeurs
  getSellers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/seller`).pipe(
      map((data) => data.map((json) => User.createFrom(json)))
    );
  }

  // Récupérer tous les clients
  getClients(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/buyer`).pipe(
      map((data) => data.map((json) => User.createFrom(json)))
    );
  }

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((data) => data.map((json) => User.createFrom(json)))
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      map((json) => User.createFrom(json)) // Mapper l'objet JSON au modèle Game
    ); }

  updateUser(userId: string, updatedUser: Partial<User>): Observable<User> {
    const url = `${this.apiUrl}/${userId}`; // URL de la ressource à mettre à jour
    return this.http.put<User>(url, updatedUser);
  }

  postUser(user: Omit<User, '_id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/`, user);
  }

  login(name: string, password: string): Observable<{ message: string; token: string }> {
    const loginData = { name, password };
    return this.http.post<{ message: string; token: string }>(
        `${this.apiUrl}/login`,
        loginData,
        {
          withCredentials: true, // Indispensable pour envoyer les cookies
          headers: { 'Content-Type': 'application/json' },
        }
    );
}
  
}
