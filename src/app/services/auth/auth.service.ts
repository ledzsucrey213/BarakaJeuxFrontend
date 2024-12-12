import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';

  // Enregistrer le token
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Supprimer le token (déconnexion)
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
