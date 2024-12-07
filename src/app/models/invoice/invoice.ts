import { Sale } from "../sale/sale";

export class Invoice {
  _id: string;
  sale_id: Sale; // Objet Sale
  buyer_id: string;

  constructor(
    _id: string,
    sale_id: Sale,
    buyer_id: string
  ) {
    this._id = _id;
    this.sale_id = sale_id;
    this.buyer_id = buyer_id;
  }

  /**
   * Méthode pour créer une instance d'Invoice à partir d'un objet JSON
   * @param json - Données en format brut (JSON)
   * @returns Instance d'Invoice
   */
  static createFrom(json: any): Invoice {
    return new Invoice(
      json._id || '',
      Sale.createFrom(json.sale_id), // Convertit les données brutes en instance de Sale
      json.buyer_id || ''
    );
  }
}
