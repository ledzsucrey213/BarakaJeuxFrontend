import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameLabelService } from '../../services/game_label/game-label.service';
import { GameService } from '../../services/game/game.service';
import { EventService } from '../../services/event/event.service';
import { ChangeDetectorRef } from '@angular/core';
import { Event } from '../../models/event/event';
import { GameLabel } from '../../models/game_label/game-label';
import { Game } from '../../models/game/game';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';
import { stockService } from '../../services/stock/stock.service';
import { SaleService } from '../../services/sale/sale.service';
import { Sale } from '../../models/sale/sale';
import { User } from '../../models/user/user';
import { UserService } from '../../services/user/user.service';
import { Invoice } from '../../models/invoice/invoice';
import { InvoiceService } from '../../services/invoice/invoice.service';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})


export class SaleComponent {
  eventId: string = '';
  eventName: string = '';
  eventCommission : number = 0;
  remainingTime: string = '';
  private timer: any; // Pour stocker l'identifiant du setInterval
  cartGames : GameLabel[] = []
  gamesNames: { [key: string]: string } = {};
  filteredGames: GameLabel[] = []; // Jeux filtrés pour l'affichage
  searchName: string = ''; 
  searchSubject: Subject<string> = new Subject<string>();
  allGameLabels: GameLabel[] = [];
  dropdownVisible: boolean = false;
  choosedPayment : 'card' | 'cash' = 'cash';
  showPaymentModal: boolean = false;
  showInvoiceModal: boolean = false;
  searchClient: string = '';
  filteredClients: User[] = [];
  selectedClient: User | null = null;
  newClientData: Omit<User, '_id'> = { firstname: '', name: '', address: '', email: '', role : 'buyer' };
  isNewClient: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private gameLabelService: GameLabelService,
    private gameService: GameService,
    private cdr: ChangeDetectorRef,  // Injecter ChangeDetectorRef
    private eventService: EventService,
    private stockService : stockService,
    private saleService : SaleService,
    private userService : UserService,
    private invoiceService : InvoiceService
  ) {}


  ngOnInit(): void {
    this.fetchEventDetails();
    this.fetchAllGameLabels();
  }

  ngOnDestroy(): void {
    // Nettoyer le timer lorsque le composant est détruit
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    // Vérifier si le clic est à l'intérieur du dropdown ou de la barre de recherche
    if (!targetElement.closest('.search-bar')) {
      this.dropdownVisible = false;
    }
  }

  // Méthode déclenchée lorsque l'utilisateur tape dans la barre de recherche
  onSearchChange(): void {
    const searchTerm = this.searchName.toLowerCase().trim();
  
    // Filtrer les jeux en fonction du texte saisi dans la barre de recherche
    this.filteredGames = this.allGameLabels.filter((game) => {
      const gameName = this.gamesNames[game.game_id]?.toLowerCase() || '';
      return gameName.includes(searchTerm); // Vérifie si le nom contient le terme recherché
    });

    // Ouvrir le dropdown si un terme est saisi et des résultats existent
    this.dropdownVisible = searchTerm.length > 0 && this.filteredGames.length > 0
  }
  

  // Récupérer tous les jeux depuis GameService
  fetchAllGameLabels(): void {
    this.gameLabelService.getGameLabels().subscribe({
      next: (games: GameLabel[]) => {
        this.allGameLabels = games;
        this.filteredGames = games; // Initialement, tous les jeux sont visibles

        this.allGameLabels.forEach(gameLabel => {
          if (!this.gamesNames[gameLabel.game_id]) {
            this.fetchGameName(gameLabel.game_id); // Appel pour récupérer le nom du jeu
          }
        });

      },
      error: (error) => {
        console.error('Erreur lors de la récupération des jeux :', error);
      },
    });
  }

  // Méthode pour récupérer les détails de l'évent actuel
  fetchEventDetails(): void {
    this.eventService.getEventActive().subscribe({
      next: (session: Event) => {
        this.eventName = session.name;  // Stocker le nom de la session
        this.eventId = session._id;
        this.eventCommission = session.commission;
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

  // Méthode pour récupérer le nom des jeux déposés par les vendeurs
  fetchGameName(gameId: string): void {
    this.gameService.getGameById(gameId).subscribe({
      next: (game: Game) => {
        this.gamesNames[gameId] = `${game.name}`;
        this.cdr.detectChanges();  // Assurez-vous que la vue est mise à jour après modification
      },
      error: (error) => {
        console.error(`Erreur lors de la récupération du vendeur avec ID ${gameId}:`, error);
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

  calculateTotal(): number {
    // On utilise reduce pour additionner les prix des jeux
    return this.cartGames.reduce((total, game) => total + (game.price || 0), 0);
  }
  

  addToCart(game: GameLabel): void {
    this.cartGames.push(game);
  }

  // Méthode pour ouvrir la fenêtre modale
  openPaymentModal(): void {
    this.showPaymentModal = true;
  }

  // Méthode pour gérer le choix du paiement
  choosePayment(method: 'card' | 'cash'): void {
    this.choosedPayment = method;
    this.showPaymentModal = false; // Ferme la fenêtre modale
    this.pay(); // Effectue le paiement
  }

  // Méthode pour ouvrir la fenêtre de gestion des clients
  openInvoiceModal(): void {
    this.showInvoiceModal = true;
    this.searchClient = '';
    this.filteredClients = [];
    this.selectedClient = null;
    this.isNewClient = false;
  }


  // Méthode pour rechercher des clients
  searchClients(): void {
    const searchTerm = this.searchClient.trim().toLowerCase();
    if (searchTerm.length > 0) {
      this.userService.getAllUsers().subscribe({
        next: (users: User[]) => {
          // Filtrer les utilisateurs ayant le rôle 'buyer' et correspondant à la recherche
          this.filteredClients = users.filter(
            (user) =>
              user.role === 'buyer' &&
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

  // Méthode pour sélectionner un client existant
  selectClient(client: User): void {
    this.selectedClient = client;
    this.isNewClient = false;
    console.log(`${this.selectedClient.name}`)
  }

  // Méthode pour créer un nouveau client
  createNewClient(): void {
    this.selectedClient = null;
    this.isNewClient = true;
  }

  // Méthode pour valider la sélection ou la création du client
  confirmClient(): void {
    this.showInvoiceModal = false;
    console.log(`${this.selectedClient}`)
  }
  
  pay(): void {
    const newSale: Omit<Sale, '_id'> = {
      total_price: this.calculateTotal(),
      games_id: this.cartGames,
      sale_date: new Date(),
      total_commission: this.cartGames.length * this.eventCommission,
      paid_with: this.choosedPayment,
    };

    // Créer la vente
    this.saleService.postSale(newSale).subscribe({
      next: (sale) => {
        console.log('Vente ajoutée:', sale);

        if (this.selectedClient) {
          // Cas 1 : Client existant
          this.createInvoice(sale._id, this.selectedClient._id);
        } else if (this.isNewClient) {
          // Cas 2 : Nouveau client
          this.userService.postUser(this.newClientData).subscribe({
            next: (createdUser) => {
              console.log('Utilisateur créé:', createdUser);

              // Récupérer l'utilisateur créé pour obtenir son ID
              this.userService.getAllUsers().subscribe({
                next: (users) => {
                  const newUser = users.find((user) => user.email === this.newClientData.email);
                  if (newUser) {
                    this.createInvoice(sale._id, newUser._id);
                  }
                },
                error: (error) => console.error('Erreur lors de la récupération des utilisateurs:', error),
              });
            },
            error: (error) => console.error('Erreur lors de la création du nouvel utilisateur:', error),
          });
        }
      },
      error: (error) => console.error('Erreur lors de l\'ajout de la vente:', error),
    });

    // Vider le panier
    this.cartGames = [];
  }

  // Méthode pour créer une facture
  createInvoice(saleId: string, buyerId: string): void {
    const newInvoice: Omit<Invoice, '_id'> = {
      sale_id: saleId,
      buyer_id: buyerId,
    };

    this.invoiceService.postInvoice(newInvoice).subscribe({
      next: (invoice) => console.log('Facture créée:', invoice),
      error: (error) => console.error('Erreur lors de la création de la facture:', error),
    });
  }



}
