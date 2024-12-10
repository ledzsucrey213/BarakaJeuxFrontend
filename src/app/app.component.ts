import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, RouterLink, ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { EventService } from './services/event/event.service';
import { Event } from './models/event/event';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user/user.service';
import { User } from './models/user/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, RouterLink, RouterModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  remainingTime: string = '';
  private timer: any; // Pour stocker l'identifiant du setInterval
  eventName: string = '';
  currentComponentName: string = '';
  isDropdownOpen = false;
  showUserModal: boolean = false;
  searchClient: string = '';
  filteredClients: User[] = [];
  selectedRoute: string = ''; // Pour stocker la route sélectionnée (invoice, report, stock)
  searchType: 'seller' | 'buyer' | null = null;
  selectedSearchType: string = '';

  constructor(private router : Router, private eventService : EventService, private route : ActivatedRoute, private userService : UserService ) {}

  ngOnInit(): void {
    this.fetchEventDetails();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Obtenir la route active et son nom
        const activeRoute = this.router.routerState.root;
        this.currentComponentName = this.getActiveComponentName(activeRoute);
      });
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

  navigateTo(route : string) {
    this.router.navigate([`/${route}`]) // Redirige vers /search-seller
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Récupérer récursivement le nom du composant actif
  private getActiveComponentName(route: ActivatedRoute): string {
    if (route.firstChild) {
      return this.getActiveComponentName(route.firstChild);
    }
    return route.snapshot.data['title'] || 'Unknown Component'; // Utilisez des données définies dans les routes
  }

  openUserModal(route: string): void {
    this.showUserModal = true;
    this.selectedRoute = route; // Stocker la route pour la redirection ultérieure
    this.searchType = null; // Réinitialiser le type de recherche
    this.searchClient = ''; // Réinitialiser la recherche
    this.filteredClients = [];
  }
  
  setSearchType(type: 'seller' | 'buyer'): void {
    this.searchType = type;
    this.searchClients(); // Mettre à jour la recherche en fonction du type sélectionné
    this.selectedSearchType = type;
  }
  
  searchClients(): void {
    const searchTerm = this.searchClient.trim().toLowerCase();
    if (searchTerm.length > 0) {
      this.userService.getAllUsers().subscribe({
        next: (users: User[]) => {
          // Filtrer les utilisateurs en fonction du type de recherche
          this.filteredClients = users.filter(
            (user) =>
              user.role === this.searchType && // Filtrer par rôle
              (user.firstname?.toLowerCase().includes(searchTerm) ||
                user.name?.toLowerCase().includes(searchTerm))
          );
        },
        error: (error) => console.error('Erreur lors de la recherche des utilisateurs:', error),
      });
    } else {
      this.filteredClients = [];
    }
  }
  
  selectUser(user: User): void {
    this.closeModal(); // Fermer le modal
    const targetRoute = `/${this.selectedRoute}/${user._id}`; // Construire la route avec l'ID
    this.navigateTo(targetRoute);
  }
  
  closeModal(): void {
    this.showUserModal = false;
    this.searchClient = '';
    this.filteredClients = [];
  }  


}
