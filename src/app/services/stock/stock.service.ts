import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stock } from '../../models/stock/stock';
import { GameLabel } from '../../models/game_label/game-label';
import { GameLabelService } from '../game_label/game-label.service';

@Injectable({
  providedIn: 'root',
})
export class stockService {
  private apiUrl = 'http://localhost:3000/api/stock'; // URL de l'API backend

  constructor(private http: HttpClient, private gameLabelService : GameLabelService) {
    
  }

  // Pour récupérer plusieurs stocks (tableau)
  getStocks(): Observable<Stock[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map((data) => data.map((stock) => Stock.createFrom(stock)))
    );
  }

  // Pour récupérer un seul stock par son ID
  getStockById(id: string): Observable<Stock> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((data) => Stock.createFrom(data))
    );
  }

  // Pour récupérer un stock par sellerId
  getStocksBySellerId(sellerId: string): Observable<Stock> {
    return this.http.get<any>(`${this.apiUrl}/seller/${sellerId}`).pipe(
      map((data) => Stock.createFrom(data))
    );
  }

  updateStock(stockId: string, updatedStock: Partial<Stock>): Observable<Stock> {
    const url = `${this.apiUrl}/${stockId}`; // URL de la ressource à mettre à jour
    return this.http.put<Stock>(url, updatedStock);
  }


  addNewGameLabelToStock(sellerId: string): void {
    // Étape 2 : Récupérer tous les GameLabels associés au vendeur
    this.gameLabelService.getGameLabelsBySellerId(sellerId).subscribe({
      next: (sellerGameLabels: GameLabel[]) => {
        console.log('GameLabels associés au vendeur récupérés :', sellerGameLabels);
  
        // Étape 3 : Récupérer le stock actuel du vendeur
        this.getStocksBySellerId(sellerId).subscribe({
          next: (stock: Stock) => {
            if (!stock || !stock._id) {
              console.error('Stock invalide ou non trouvé.');
              return;
            }
  
            console.log('Stock actuel récupéré :', stock);
  
            // Étape 4 : Mettre à jour le tableau games_id avec les objets GameLabel
            const updatedStock: Partial<Stock> = {
              games_id: [
                ...stock.games_id, // Conserver les GameLabels existants dans le stock
                ...sellerGameLabels, // Ajouter les nouveaux GameLabels
              ],
            };
  
            console.log('Mise à jour du stock avec :', updatedStock);
  
            // Mettre à jour le stock via StockService
            this.updateStock(stock._id, updatedStock).subscribe({
              next: (updatedStock: Stock) => {
                console.log('Stock mis à jour avec succès :', updatedStock);
              },
              error: (error) => {
                console.error('Erreur lors de la mise à jour du stock :', error);
              },
            });
          },
          error: (error) => {
            console.error('Erreur lors de la récupération du stock :', error);
          },
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des GameLabels du vendeur :', error);
      },
    });
  }

  sellGame(sellerId: string, soldGames: GameLabel[]): void {
    // Étape 1 : Récupérer les games_id et games_sold du stock
    this.getStocksBySellerId(sellerId).subscribe({
      next: (stock: Stock) => {
        if (!stock || !stock._id) {
          console.error('Stock invalide ou non trouvé.');
          return;
        }
  
        console.log('Stock actuel récupéré :', stock);
  
        // Étape 2 : Retirer les jeux vendus de games_id et les ajouter à games_sold
        const updatedGamesId = stock.games_id.filter(
          game => !soldGames.some(soldGame => soldGame._id === game._id)
        ); // Retirer les jeux vendus
        const updatedGamesSold = [...stock.games_sold, ...soldGames]; // Ajouter les jeux vendus à games_sold
  
        console.log('Nouveau tableau games_id :', updatedGamesId);
        console.log('Nouveau tableau games_sold :', updatedGamesSold);
  
        // Étape 3 : Mettre à jour le stock via updateStock
        const updatedStock: Partial<Stock> = {
          games_id: updatedGamesId,
          games_sold: updatedGamesSold,
        };
  
        this.updateStock(stock._id, updatedStock).subscribe({
          next: (updatedStock: Stock) => {
            console.log('Stock mis à jour avec succès :', updatedStock);
  
            // Étape 4 : Mettre à jour chaque GameLabel vendu
            soldGames.forEach(game => {
              const updatedGameLabel: Partial<GameLabel> = {
                is_Sold: true,
                is_On_Sale: false,
              };
  
              this.gameLabelService.updateGameLabel(game._id, updatedGameLabel).subscribe({
                next: (updatedGame: GameLabel) => {
                  console.log(`GameLabel mis à jour avec succès :`, updatedGame);
                },
                error: (error) => {
                  console.error(`Erreur lors de la mise à jour du GameLabel ${game._id} :`, error);
                },
              });
            });
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du stock :', error);
          },
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du stock :', error);
      },
    });
  }
  
  
  

}
