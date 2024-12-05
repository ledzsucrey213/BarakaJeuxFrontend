import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event/event.service';
import { Event } from '../../models/event/event';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user/user';
import { UserService } from '../../services/user/user.service';
import { ReportService } from '../../services/report/report.service';
import { stockService } from '../../services/stock/stock.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FinancialReportComponent implements OnInit {
  eventSelected: string = '';
  userSelected: string = '';

  totalFees: string = '0.00 €';
  totalCommission: string = '0.00 €';
  sellerId: User = new User({
    _id: '0',               // Placeholder ID
    firstname: 'Placeholder', // Placeholder name
    name: 'User',
    email: 'placeholder@example.com', // Placeholder email
    role: 'seller', // Default role
  });

  eventId: string = '';
  eventName: string = ''; // Variable pour stocker le nom du jeu
  remainingTime: string = '';
  private timer: any; // Pour stocker l'identifiant du setInterval
  events: any[] = []; // Add a property to store events

  total_earned: number = 0;
  total_due: number = 0;
  report_date: Date = new Date();

  games_in_stock: Number = 0;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private userService: UserService,
    private reportService: ReportService,
    private stockService: stockService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sellerId._id = params.get('id') || '';
      if (this.sellerId._id) {
        this.fetchUserDetails(this.sellerId._id); // Fetch user details
      }
      this.fetchEventDetails(); // Charger les détails de l'événement actif
      this.fetchStockDetails(this.sellerId._id); // Fetch stock details
    });
    this.loadEvents();
  }

  fetchStockDetails(sellerId: string): void {
    this.stockService.getStocksBySellerId(sellerId).subscribe(stock => {
      // Vérifier si l'événement sélectionné est encore actif
      const selectedEvent = this.events.find(event => event._id === this.eventSelected);
      if (selectedEvent && new Date(selectedEvent.end) > new Date()) {
        this.games_in_stock = stock.games_id.length;
      } else {
        this.games_in_stock = 0; // Si l'événement est terminé, pas de jeux en stock
      }
    });
  }
  
  

  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      if (this.events.length > 0) {
        this.events.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
        this.eventSelected = this.events[this.events.length - 1]._id;
        this.fetchFinancialReport(this.eventSelected, this.sellerId._id);
      }
    });
  }

  onEventChange(): void {
    this.fetchFinancialReport(this.eventSelected, this.sellerId._id); // Mettre à jour le rapport financier
    this.fetchStockDetails(this.sellerId._id); // Mettre à jour les stocks
  }
  

  fetchFinancialReport(eventId: string, sellerId : string): void {
    this.reportService.getReportByEventIdAndSellerId(eventId, sellerId).subscribe(report => {
      if (report) {
        const now = new Date();
  
        // Fetch the event details to get the end date
        this.eventService.getEventById(eventId).subscribe(event => {
          if (event && event.end) {
            const eventEndDate = new Date(event.end);
            this.eventName = event.name;
            
            // Store the end date
            this.remainingTime = eventEndDate.toISOString();
            this.calculateRemainingTime(eventEndDate);
  
            // Decide the report date based on event end date
            if (now <= eventEndDate) {
              report.report_date = now.toISOString(); // Use the current date
            } else {
              report.report_date = eventEndDate.toISOString(); // Use the event end date
            }
          } else {
            console.warn('Invalid or missing end date for the event.');
            report.report_date = now.toISOString(); // Fallback to the current date
          }
        });
  
        this.total_earned = report.total_earned;
        this.total_due = report.total_due;
        console.log('Financial report:', report);
      }
    });
  }
      

  fetchEventDetails(): void {
    this.eventService.getEventActive().subscribe({
      next: (session: Event) => {
        this.eventName = session.name;
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

  calculateRemainingTime(endDate: Date): void {
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();

    if (difference <= 0) {
      this.remainingTime = 'Session terminée';
      if (this.timer) {
        clearInterval(this.timer);
      }
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    this.remainingTime = `${days} jours, ${hours} heures, ${minutes} minutes`;
  }

  startTimer(endDate: Date): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.calculateRemainingTime(endDate);
    }, 60000); // Toutes les 60 secondes
  }

  fetchUserDetails(userId: string): void {
    this.userService.getUserById(userId).subscribe(user => {
      this.sellerId.firstname = user.firstname;
      this.sellerId.name = user.name;
      this.sellerId.email = user.email;
      this.sellerId.role = user.role;
    });
  }

  takeMoney(): void {
    if (this.eventSelected && this.sellerId._id) {
      // Fetch the current report for the selected event and seller
      this.reportService.getReportByEventIdAndSellerId(this.eventSelected, this.sellerId._id).subscribe(report => {
        if (report) {
          // Set total_due to 0
          const updatedReport = { ...report, total_due: 0 };
  
          // Update the report using the ReportService
          this.reportService.updateReport(report._id, updatedReport).subscribe(
            (updated) => {
              console.log('Report updated successfully:', updated);
              this.total_due = updated.total_due; // Update the local value
              alert('Payment successfully recorded. Total due is now 0.');
            },
            (error) => {
              console.error('Error updating the report:', error);
              alert('An error occurred while processing the payment. Please try again.');
            }
          );
        } else {
          console.warn('No report found for the selected event and seller.');
          alert('No report found for the selected event and seller.');
        }
      }, error => {
        console.error('Error fetching report:', error);
        alert('An error occurred while fetching the report. Please try again.');
      });
    } else {
      console.warn('Event or seller ID is missing.');
      alert('Please select an event and ensure the seller information is loaded.');
    }
  }
  
  getBackGames(sellerId : string): void {
    // Implement the logic for "get back my games" action
    this.router.navigate([`/stock/${sellerId}`]);
  }
  generatePDF() {
    // Créez une instance de jsPDF
    const doc = new jsPDF();

    // Ajoutez du texte à votre document PDF
    // Add the attributes of the financial report to the PDF
    doc.text('Financial Report', 10, 10);
    doc.text(`Total Earned: ${this.total_earned || 0} €`, 10, 20);
    doc.text(`Total Due: ${this.total_due || 0} €`, 10, 30);
    doc.text(`Report Date: ${this.report_date ? new Date(this.report_date).toLocaleDateString() : 'Not generated yet'}`, 10, 40);
    doc.text(`Games in Stock: ${this.games_in_stock || 0}`, 10, 50);

    // Téléchargez le PDF avec le nom "Yanis_and_Jalil.pdf"
    doc.save('Yanis_and_Jalil.pdf');
  }
  
}