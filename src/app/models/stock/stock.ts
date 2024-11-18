export class Stock {
    _id: string;
    games_id: string[]; // Tableau d'ID de GameLabel
    seller_id: string; // ID du vendeur
    games_sold: string[]; // Tableau des jeux vendus (ID de GameLabel)
  
    constructor(data: Partial<Stock>) {
      this._id = data._id || '';
      this.games_id = data.games_id || [];
      this.seller_id = data.seller_id || '';
      this.games_sold = data.games_sold || [];
    }
  
    // Méthode pour créer une instance de Stock à partir d'un objet JSON
    static createFrom(json: any): Stock {
      return new Stock({
        _id: json._id,
        games_id: json.games_id,
        seller_id: json.seller_id,
        games_sold: json.games_sold,
      });
    }
  }
  