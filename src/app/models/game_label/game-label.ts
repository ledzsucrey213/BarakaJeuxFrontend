export class GameLabel {
    _id: string; // Ajout de l'attribut _id
    sellerId: string;
    gameId: string;
    price: number;
    eventId: string;
    condition: 'new' | 'very good' | 'good' | 'poor';
    depositFee: number;
    isSold: boolean;
    creation: Date;
    isOnSale: boolean;
  
    constructor(data: Partial<GameLabel>) {
      this._id = data._id || ''; // Initialisation de _id
      this.sellerId = data.sellerId || '';
      this.gameId = data.gameId || '';
      this.price = data.price || 0;
      this.eventId = data.eventId || '';
      this.condition = data.condition || 'new';
      this.depositFee = data.depositFee || 0;
      this.isSold = data.isSold || false;
      this.creation = data.creation ? new Date(data.creation) : new Date();
      this.isOnSale = data.isOnSale !== undefined ? data.isOnSale : true;
    }
  
    // Méthode pour créer une instance de GameLabel à partir d'un objet JSON
    static createFrom(json: any): GameLabel {
      return new GameLabel({
        _id: json._id, // Inclure l'ID dans la création
        sellerId: json.seller_id,
        gameId: json.game_id,
        price: json.price,
        eventId: json.event_id,
        condition: json.condition,
        depositFee: json.deposit_fee,
        isSold: json.is_Sold,
        creation: json.creation,
        isOnSale: json.is_On_Sale,
      });
    }
}
