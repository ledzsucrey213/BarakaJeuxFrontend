// models/invoice/invoice.ts
export class Invoice {
    _id: string;
    sale_id: string;
    buyer_id: string;
  
    constructor(data: Partial<Invoice>) {
      this._id = data._id || '';
      this.sale_id = data.sale_id || '';
      this.buyer_id = data.buyer_id || '';
    }
  
    // Méthode pour créer une instance d'Invoice à partir d'un objet JSON
    static createFrom(json: any): Invoice {
      return new Invoice({
        _id: json._id,
        sale_id: json.sale_id,
        buyer_id: json.buyer_id,
      });
    }
  }
  