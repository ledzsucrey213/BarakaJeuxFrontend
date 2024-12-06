import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { Invoice } from '../../models/invoice/invoice';
import { SaleService } from '../../services/sale/sale.service';
import { Sale } from '../../models/sale/sale';
import { ChangeDetectorRef } from '@angular/core';
import jsPDF from 'jspdf'; // Importez jsPDF
import { GameLabel } from '../../models/game_label/game-label';
import { Game } from '../../models/game/game';
import { GameService } from '../../services/game/game.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
  standalone : true
})

export class InvoiceComponent implements OnInit {
  buyerId : string = '';
  selectedUser: string = ''; // Sélection de l'utilisateur
  invoices : Invoice[] = [];
  salesDates: { [key: string]: Date } = {};
  salesPrices: { [key: string]: number } = {};
  salesGames: { [key : string]: GameLabel[] } = {};
  salesGamesNames : { [key : string] : string } = {};

  constructor(private router : Router, 
    private invoiceService : InvoiceService,
    private saleService : SaleService, 
    private cdr : ChangeDetectorRef,
    private gameService : GameService,
    private route : ActivatedRoute) {}
  
  ngOnInit(): void {
    // Récupérer l'ID du jeu depuis l'URL
    this.route.paramMap.subscribe((params) => {
      this.buyerId = params.get('id') || '';
      this.fetchInvoices();  
    });
    
  }

  // Récupère les utilisateurs via le UserService
  fetchInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
        next: (data: Invoice[]) => {
            this.invoices = data;

            // Parcourez chaque facture pour récupérer les informations de vente associées
            this.invoices.forEach((invoice) => {
                if (invoice.sale_id) {
                    this.fetchSaleInfos(invoice.sale_id);
                } else {
                    console.warn(`Aucune sale_id trouvée pour la facture avec l'ID : ${invoice._id}`);
                }
            });
        },
        error: (error) => {
            console.error('Erreur lors de la récupération des factures:', error);
        }
    });
}

  // Méthode pour récupérer le nom complet du vendeur (nom + prénom)
  fetchSaleInfos(sale_id: string): void {
    console.log(`Fetching seller for seller_id: ${sale_id}`);  // Log pour vérifier si le seller_id est bien passé
    this.saleService.getSaleById(sale_id).subscribe({
      next: (sale: Sale) => {
        this.salesDates[sale_id] = new Date(sale.sale_date);
        this.salesPrices[sale_id] = sale.total_price;
        this.salesGames[sale_id] = sale.games_id;
        this.fetchGameDetails(sale.games_id);
        this.cdr.detectChanges();  // Assurez-vous que la vue est mise à jour après modification
      },
      error: (error) => {
        console.error(`Erreur`, error);
      },
    });
  }

  fetchGameDetails(games: GameLabel[]): void {

    games.forEach((gameLabel) => {
        const gameId = gameLabel._id; // Supposons que 'id' est la propriété d'identifiant

        this.gameService.getGameById(gameId).subscribe({
            next: (game: Game) => {
                // Stocke le nom du jeu dans salesGamesNames avec l'ID comme clé
                this.salesGamesNames[gameId] = game.name; // Supposons que 'name' est la propriété contenant le nom du jeu
            },
            error: (error) => {
                console.error(`Erreur lors de la récupération du jeu avec ID ${gameId}:`, error);
            },
        });
    });
}


generatePDF(invoiceId: string, saleId: string): void {
  // Vérifiez si jsPDF est bien importé
  const doc = new jsPDF();

  // Vérifiez que saleId correspond à une clé valide dans les objets this.salesDates et this.salesPrices
  const saleDate = this.salesDates[saleId] || "Date de vente inconnue"; // Fallback si saleId n'existe pas
  const salePrice = this.salesPrices[saleId] || "Prix inconnu";

  // Récupérez la liste des jeux associés à cette vente
  const games = this.salesGames[saleId] || []; // Fallback si aucun jeu n'est trouvé

  // Construisez le texte principal avec la date de la vente et le prix total
  let text = `Date de la vente : ${saleDate}\nPrix total : ${salePrice}\n\nJeux achetés :\n`;

  // Parcourez les jeux pour ajouter leurs détails (nom, prix, condition) au texte
  games.forEach((game: GameLabel) => {
      const gameName = this.salesGamesNames[game._id] || "Nom du jeu inconnu"; // Récupérez le nom du jeu à partir du tableau
      const gamePrice = game.price || "Prix inconnu"; // Vérifiez si le prix est défini
      const gameCondition = game.condition || "Condition inconnue"; // Vérifiez si la condition est définie

      text += `- ${gameName} : ${gamePrice}, ${gameCondition}\n`;
  });

  // Ajoutez le texte au document PDF
  doc.text(text, 10, 10); // Position du texte

  // Téléchargez le fichier PDF avec un nom basé sur l'ID de la facture
  doc.save(`${invoiceId}.pdf`);
}


}

