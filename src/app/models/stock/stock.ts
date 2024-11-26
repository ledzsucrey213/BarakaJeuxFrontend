import { GameLabel } from "../game_label/game-label";
import { User } from "../user/user";

export class Stock {
  _id: string;
  games_id: GameLabel[]; // List of available games
  seller_id: User; // Seller object
  games_sold: GameLabel[]; // List of sold games

  constructor(data: Partial<Stock>) {
    this._id = data._id || '';
    this.games_id = (data.games_id || []).map((game) => GameLabel.createFrom(game));
    this.seller_id = data.seller_id instanceof User ? data.seller_id : User.createFrom(data.seller_id || {}); // Ensure `seller_id` is a User instance
    this.games_sold = (data.games_sold || []).map((game) => GameLabel.createFrom(game));
  }

  // Method to convert JSON to `Stock` instance
  static createFrom(json: any): Stock {
    return new Stock({
      _id: json._id,
      games_id: json.games_id || [],
      seller_id: json.seller_id || {},
      games_sold: json.games_sold || [],
    });
  }
}
