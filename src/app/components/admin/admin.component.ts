import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user/user';
import { ChangeDetectorRef } from '@angular/core';
import { Event } from '../../models/event/event';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { EventService } from '../../services/event/event.service';
import { GameLabelService } from '../../services/game_label/game-label.service';
import { GameLabel } from '../../models/game_label/game-label';
import { stockService } from '../../services/stock/stock.service';

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
    private eventService: EventService,
    private gameLabelService: GameLabelService,
    private stockService: stockService
  ) {}


  ngOnInit(): void {
    this.fetchEventDetails();
    this.fetchUsers();
    this.fetchEvents();
    this.minStartDate = new Date().toISOString().slice(0, 16);
  }

  ngOnDestroy(): void {
  }
     

  // Méthode pour récupérer les détails de l'évent actuel
  fetchEventDetails(): void {
    this.eventService.getEventActive().subscribe({
      next: (session: Event) => {
        this.eventName = session.name;  // Stocker le nom de la session
        this.eventId = session._id;
        console.log(`Fetching game for event_id ${session._id}`);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la session :', error);
      },
    });
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

takeNotReclaimedGames(): void {
  console.log("Fetching not reclaimed games...");

  this.gameLabelService.getNotReclaimedGames(this.eventId).subscribe({
    next: (games) => {
      console.log("Jeux non récupérés :", games);

      if (games.length === 0) {
        console.log("Aucun jeu non récupéré trouvé.");
        return;
      }

      let updatedCount = 0;

      // Parcourir chaque jeu récupéré
      games.forEach((game: GameLabel) => {
        // Préparer les données de mise à jour
        const updatedData: Partial<GameLabel> = {
          event_id: this.eventId,
          seller_id: "675c75c5cd3b594a7528034f",
        };

        // Effectuer la mise à jour
        this.gameLabelService.updateGameLabel(game._id, updatedData).subscribe({
          next: (updatedGame) => {
            console.log(`Jeu mis à jour (ID: ${game._id}) :`, updatedGame);

            // Incrémenter le compteur après chaque mise à jour réussie
            updatedCount++;

            // Si toutes les mises à jour sont terminées, appeler `addNewGameLabelToStock`
            if (updatedCount === games.length) {
              console.log("Toutes les mises à jour des jeux non récupérés sont terminées.");
              this.stockService.addNewGameLabelToStock("675c75c5cd3b594a7528034f");
            }
          },
          error: (error) => {
            console.error(`Erreur lors de la mise à jour du jeu (ID: ${game._id}) :`, error);
          },
        });
      });
    },
    error: (error) => {
      console.error("Erreur lors de la récupération des jeux non récupérés :", error);
    },
  });
}

}
