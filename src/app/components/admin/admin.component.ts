import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user/user';
import { ChangeDetectorRef } from '@angular/core';
import { Event } from '../../models/event/event';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { EventService } from '../../services/event/event.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})


export class AdminComponent {
  eventId: string = '';
  eventName: string = '';
  remainingTime: string = '';
  private timer: any; // Pour stocker l'identifiant du setInterval
  users: User[] = [];
  events: Event[] = [];


  constructor(
    private route: ActivatedRoute,
    private userService : UserService,
    private cdr: ChangeDetectorRef,  // Injecter ChangeDetectorRef
    private eventService: EventService
  ) {}


  ngOnInit(): void {
    this.fetchEventDetails();
    this.fetchUsers();
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
        this.eventId = session._id;
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

// Récupère les utilisateurs via le UserService
fetchUsers(): void {
  this.userService.getAllUsers().subscribe({
    next: (data: User[]) => {
      this.users = data;
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  });
}

// Récupère les événements via le EventService
fetchEvents(): void {
  this.eventService.getEvents().subscribe({
    next: (data: Event[]) => {
      this.events = data;
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des événements:', error);
    }
  });
}

// Méthode pour gérer la modification des utilisateurs (placeholder)
editUser(user: User): void {
  console.log('Modifier utilisateur:', user);
  // Ajoutez ici la logique pour modifier un utilisateur
}

// Méthode pour ajouter un événement (placeholder)
addEvent(): void {
  console.log('Ajouter un nouvel événement');
  // Ajoutez ici la logique pour ajouter un événement
}








}
