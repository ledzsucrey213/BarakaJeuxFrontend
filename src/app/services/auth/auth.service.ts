import { Injectable, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Enregistrer le token
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  // Récupérer le token
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!this.getToken();
    }
    return false;
  }

  // Supprimer le token (déconnexion)
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  
}
