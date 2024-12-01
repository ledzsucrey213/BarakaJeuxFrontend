import { GameLabel } from "../game_label/game-label";

export class Sale {
    _id: string; // ID unique (correspondant à l'ObjectId de MongoDB)
    total_price: number; // Prix total de la vente
    games_id: GameLabel[]; // Tableau d'IDs de GameLabel
    buyer_id: string; // ID de l'utilisateur acheteur
    sale_date: Date; // Date de la vente
    total_commission: number; // Commission totale sur la vente
    paid_with: 'card' | 'cash'; // Mode de paiement
  
    constructor(
      _id: string,
      total_price: number,
      games_id: GameLabel[],
      buyer_id: string,
      sale_date: Date,
      total_commission: number,
      paid_with: 'card' | 'cash'
    ) {
      this._id = _id;
      this.total_price = total_price;
      this.games_id = games_id;
      this.buyer_id = buyer_id;
      this.sale_date = sale_date;
      this.total_commission = total_commission;
      this.paid_with = paid_with;
    }
  
    // Méthode pour créer une instance de Sale à partir d'un objet JSON
    static createFrom(json: any): Sale {
      return new Sale(
        json._id || '',
        json.total_price || 0,
        json.games_id || [],
        json.buyer_id || '',
        new Date(json.sale_date || Date.now()), // Par défaut, la date actuelle
        json.total_commission || 0,
        json.paid_with || 'card' // Mode par défaut 'card'
      );
    }
  }
  