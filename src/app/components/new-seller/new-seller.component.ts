import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user/user';
import { Report } from '../../models/report/report';
import { ReportService } from '../../services/report/report.service';
import { Stock } from '../../models/stock/stock';
import { EventService } from '../../services/event/event.service';
import { Event } from '../../models/event/event';
import { stockService } from '../../services/stock/stock.service';

@Component({
  selector: 'app-new-seller',
  templateUrl: './new-seller.component.html',
  styleUrls: ['./new-seller.component.scss'],
  standalone: true,
  imports: [FormsModule] // Ensure FormsModule is imported
})
export class NewSellerComponent {
  eventId: string = '';
  eventName: string = '';
  remainingTime: string = '';
  private timer: any; // Pour stocker l'identifiant du setInterval

  constructor(
    private route: ActivatedRoute,
    private userService : UserService, 
    private reportService : ReportService,
    private eventService : EventService,
    private stockService : stockService) {}


  // Define a seller object to bind form fields
  seller = {
    firstName: '',
    lastName: '',
    email: '',
    address: ''
  };


  ngOnInit(): void {
    // Récupérer l'ID du jeu depuis l'URL
    this.route.paramMap.subscribe((params) => {
      this.fetchEventDetails();
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

  // This function could be connected to a backend to save the seller data
  createSeller() {
    console.log('Creating new seller:', this.seller);
  
    // Créer un nouvel utilisateur
    const newSeller: Omit<User, '_id'> = {
      firstname: this.seller.firstName,
      name: this.seller.lastName,
      email: this.seller.email,
      address: this.seller.address,
      role: 'seller',
    };
  
    this.userService.postUser(newSeller).subscribe({
      next: (seller) => {
        console.log('User created:', seller);
  
        // Récupérer tous les utilisateurs pour identifier le dernier créé
        this.userService.getAllUsers().subscribe({
          next: (users) => {
            const createdUser = users.find((u) => u.email === this.seller.email);
  
            if (createdUser) {
              const sellerId = createdUser._id;
  
              // Créer le stock pour ce vendeur
              const newStock: Omit<Stock, '_id'> = {
                games_id: [],
                seller_id: sellerId,
                games_sold: [],
              };
  
              this.stockService.postStock(newStock).subscribe({
                next: (stock) => {
                  console.log('Stock created:', stock);
  
                  // Créer le rapport associé
                  const newReport: Omit<Report, '_id'> = {
                    seller_id: sellerId,
                    total_earned: 0,
                    total_due: 0,
                    report_date: new Date(),
                    event_id: this.eventId,
                    stock_id: stock._id,
                  };
  
                  this.reportService.postReport(newReport).subscribe({
                    next: (report) => console.log('Report created:', report),
                    error: (error) => console.error('Error creating report:', error),
                  });
                },
                error: (error) => console.error('Error creating stock:', error),
              });
            } else {
              console.error('Unable to find the newly created user.');
            }
          },
          error: (error) => console.error('Error fetching users:', error),
        });
      },
      error: (error) => console.error('Error creating user:', error),
    });
  }
}  
