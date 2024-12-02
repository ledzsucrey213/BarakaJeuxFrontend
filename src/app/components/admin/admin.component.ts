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
  showAddEventForm: boolean = false; // Variable pour afficher/masquer le formulaire
  minStartDate: string = ''; // Stocker la valeur min pour le champ de début
  minEndDate: string = ''; // Stocker la valeur min pour le champ de fin
  newEvent: Partial<Event> = {
    name: '',
    start: new Date(),
    end: new Date(),
    commission: 0,
    deposit_fee: 0
  };
  // Propriétés pour gérer l'édition d'utilisateur
  selectedUserId: string | null = null; // ID de l'utilisateur sélectionné pour édition
  editUserForm: Partial<User> = {}; // Données du formulaire d'édition




  constructor(
    private route: ActivatedRoute,
    private userService : UserService,
    private cdr: ChangeDetectorRef,  // Injecter ChangeDetectorRef
    private eventService: EventService
  ) {}


  ngOnInit(): void {
    this.fetchEventDetails();
    this.fetchUsers();
    this.fetchEvents();
    this.minStartDate = new Date().toISOString().slice(0, 16);
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
  this.selectedUserId = user._id; // Assurez-vous que `_id` est bien la clé d'identification
  this.editUserForm = { ...user }; // Clone les données de l'utilisateur pour les modifier
}

updateUser(): void {
  if (this.selectedUserId) {
    this.userService.updateUser(this.selectedUserId, this.editUserForm).subscribe({
      next: (updatedUser: User) => {
        // Met à jour la liste locale d'utilisateurs avec les nouvelles données
        const index = this.users.findIndex(user => user._id === this.selectedUserId);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.resetEditForm(); // Réinitialise le formulaire
        console.log('Utilisateur mis à jour avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      }
    });
  }
}

resetEditForm(): void {
  this.selectedUserId = null;
  this.editUserForm = {};
}



// Ajouter un événement
// Ajouter un événement
addEvent(): void {
  if (
    this.newEvent.name &&
    this.newEvent.start &&
    this.newEvent.end &&
    this.newEvent.commission
    && this.newEvent.deposit_fee
  ) {
    // Calculer is_active en fonction de la date de début
    const today = new Date().toDateString(); // Date actuelle (jour, mois, année)
    const startDate = new Date(this.newEvent.start).toDateString(); // Date de début fournie (jour, mois, année)
    const isActive = today === startDate; // Comparer les dates

    // Construire l'objet événement en omettant l'_id et en ajoutant is_active
    const eventToPost: Omit<Event, '_id'> = {
      name: this.newEvent.name,
      start: this.newEvent.start,
      end: this.newEvent.end,
      commission: this.newEvent.commission,
      is_active: isActive, // Ajouter l'attribut calculé
      deposit_fee : this.newEvent.deposit_fee
    };

    // Utiliser la méthode postEvent du service
    this.eventService.postEvent(eventToPost).subscribe({
      next: (event) => {
        console.log('Événement ajouté:', event);
        this.events.push(event); // Ajouter l'événement à la liste existante
        this.toggleAddEventForm(); // Masquer le formulaire
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'événement:', error);
      },
    });
  } else {
    console.error('Veuillez remplir tous les champs du formulaire.');
  }
}


// Afficher/Masquer le formulaire d'ajout d'événement
toggleAddEventForm(): void {
  this.showAddEventForm = !this.showAddEventForm;
  if (!this.showAddEventForm) {
    // Réinitialiser les données du formulaire
    this.newEvent = {
      name: '',
      start: new Date(),
      end: new Date(),
      commission: 0,
    };
  }
}








}
