import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { EventService } from './services/event/event.service';
import { Event } from './models/event/event';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, RouterLink, RouterModule ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  remainingTime: string = '';
  private timer: any; // Pour stocker l'identifiant du setInterval
  eventName: string = '';

  constructor(private router : Router, private eventService : EventService) {}

  ngOnInit(): void {
    this.fetchEventDetails();
  }

  ngOnDestroy(): void {
    // Nettoyer le timer lorsque le composant est détruit
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // Méthode pour récupérer les détails de l'évent actuel
  fetchEventDetails(): void {
    this.eventService.getEventActive().subscribe({
      next: (session: Event) => {
        this.eventName = session.name;  // Stocker le nom de la session
        console.log(`Fetching game for event_id ${session._id}`);
        this.calculateRemainingTime(new Date(session.end)); // Calcul initial

        // Démarrer le timer uniquement sur le client et pas côté serveur
        if (typeof window !== 'undefined') {
          this.startTimer(new Date(session.end)); 
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la session :', error);
      },
    });
  }


  // Méthode pour calculer le temps restant
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

  // Méthode pour démarrer le timer
  startTimer(endDate: Date): void {
    if (this.timer) {
      clearInterval(this.timer); // Assurez-vous que le timer précédent est nettoyé
    }

    // Mettre à jour chaque minute (pas nécessaire côté SSR)
    this.timer = setInterval(() => {
      this.calculateRemainingTime(endDate);
    }, 60000); // Toutes les 60 secondes
  }

  goToAdminComponent() {
    this.router.navigate(['/admin']); // Redirige vers /search-seller
  } 
}
