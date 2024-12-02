export class GameLabel {
    _id: string;
    seller_id: string;
    game_id: string;
    price: number;
    event_id: string;
    condition: 'new' | 'very good' | 'good' | 'poor';
    is_Sold: boolean;
    creation: Date;
    is_On_Sale: boolean;
  
    constructor(data: Partial<GameLabel>) {
      this._id = data._id || ''; // Initialisation de _id
      this.seller_id = data.seller_id || '';
      this.game_id = data.game_id || '';
      this.price = data.price || 0;
      this.event_id = data.event_id || '';
      this.condition = data.condition || 'new';
      this.is_Sold = data.is_Sold || false;
      this.creation = data.creation ? new Date(data.creation) : new Date();
      this.is_On_Sale = data.is_On_Sale !== undefined ? data.is_On_Sale : true;
    }
  
    // Méthode pour créer une instance de GameLabel à partir d'un objet JSON
    static createFrom(json: any): GameLabel {
      return new GameLabel({
        _id: json._id, // Inclure l'ID dans la création
        seller_id: json.seller_id,
        game_id: json.game_id,
        price: json.price,
        event_id: json.event_id,
        condition: json.condition,
        is_Sold: json.is_Sold,
        creation: json.creation,
        is_On_Sale: json.is_On_Sale,
      });
    }
}
