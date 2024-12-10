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
import { GameLabelService } from '../../services/game_label/game-label.service';

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
  salesIds : { [key : string] : string} = {};
  salesDates: { [key: string]: Date } = {};
  salesPrices: { [key: string]: number } = {};
  salesGamesId: { [key : string]: string[] } = {};
  salesGamesNames : { [key : string] : string } = {};
  salesGamesConditions : { [key : string] : string } = {};
  salesGamesPrices : { [key : string] : number } = {};

  constructor(private router : Router, 
    private invoiceService : InvoiceService,
    private saleService : SaleService, 
    private cdr : ChangeDetectorRef,
    private route : ActivatedRoute,
    private gameLabelService : GameLabelService) {}
  
  ngOnInit(): void {
    // Récupérer l'ID du jeu depuis l'URL
    this.route.paramMap.subscribe((params) => {
      this.buyerId = params.get('id') || '';
      this.fetchInvoices();  
    });
    
  }

  // Récupère les utilisateurs via le UserService
  fetchInvoices(): void {
    this.invoiceService.getInvoicesByClientId(this.buyerId).subscribe({
        next: (data : Invoice[]) => {
            this.invoices = data;

            // Parcourez chaque facture pour récupérer les informations de vente associées
            this.invoices.forEach((invoice) => {
                if (invoice.sale_id) {
                    console.log(`${invoice.sale_id}`);
                    this.fetchSaleInfos(invoice.sale_id, invoice._id);
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
  fetchSaleInfos(sale_id: Sale, invoiceId : string): void {
    console.log(`Fetching seller for seller_id: ${sale_id}`);  // Log pour vérifier si le seller_id est bien passé
    if (sale_id) {
        this.salesDates[invoiceId] = new Date(sale_id.sale_date);
        console.log(`${this.salesDates[invoiceId]}`)
        this.salesPrices[invoiceId] = sale_id.total_price;
        this.salesGamesId[invoiceId] = String(sale_id.games_id).split(',');
        this.fetchGameDetails(this.salesGamesId[invoiceId]);
        this.cdr.detectChanges();  // Assurez-vous que la vue est mise à jour après modification
    }

  }

  fetchGameDetails(games: string[]): void {
    games.forEach((gameLabel) => {
      const gameId = gameLabel; // Supposons que '_id' est la propriété d'identifiant
  
      this.gameLabelService.getGameLabelById(gameId).subscribe({
        next: (game: GameLabel) => {
          this.salesGamesConditions[gameId]=game.condition;
          this.salesGamesPrices[gameId]=game.price;
          // Utilise getNameOfGameLabel pour récupérer le nom du jeu
          this.gameLabelService.getNameOfGameLabel(game.game_id).subscribe({
            next: (name: string) => {
              // Stocke le nom du jeu dans salesGamesNames avec l'ID comme clé
              this.salesGamesNames[gameId] = name;
            },
            error: (error) => {
              console.error(`Erreur lors de la récupération du nom du jeu pour ID ${gameId}:`, error);
            },
          });
        },
        error: (error) => {
          console.error(`Erreur lors de la récupération de GameLabel avec ID ${gameId}:`, error);
        },
      });
    });
  }  


generatePDF(invoiceId: string, saleId: string): void {
  // Vérifiez si jsPDF est bien importé
  const doc = new jsPDF();

  // Vérifiez que saleId correspond à une clé valide dans les objets this.salesDates et this.salesPrices
  const saleDate = this.salesDates[invoiceId] || "Date de vente inconnue"; // Fallback si saleId n'existe pas
  const salePrice = this.salesPrices[invoiceId] || "Prix inconnu";

  // Récupérez la liste des jeux associés à cette vente
  const games = this.salesGamesId[invoiceId] || []; // Fallback si aucun jeu n'est trouvé

  // Construisez le texte principal avec la date de la vente et le prix total
  let text = `Date de la vente : ${saleDate}\nPrix total : ${salePrice}\n\nJeux achetés :\n`;

  // Parcourez les jeux pour ajouter leurs détails (nom, prix, condition) au texte
  games.forEach((game: string) => {
      const gameName = this.salesGamesNames[game] || "Nom du jeu inconnu"; // Récupérez le nom du jeu à partir du tableau
      const gamePrice = this.salesGamesPrices[game] || "Prix inconnu"; // Vérifiez si le prix est défini
      const gameCondition = this.salesGamesConditions[game] || "Condition inconnue"; // Vérifiez si la condition est définie

      text += `- nom : ${gameName}, prix : ${gamePrice} €, état : ${gameCondition}\n`;
  });

  // Ajoutez le texte au document PDF
  doc.text(text, 10, 10); // Position du texte

  // Téléchargez le fichier PDF avec un nom basé sur l'ID de la facture
  doc.save(`${invoiceId}.pdf`);
}


}

