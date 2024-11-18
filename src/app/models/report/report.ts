export class Report {
    _id: string;
    seller_id: string;
    total_earned: number;
    total_due: number;
    report_date: Date;
    event_id: string;
    stock_id: string;
  
    constructor(data: Partial<Report>) {
      this._id = data._id || '';
      this.seller_id = data.seller_id || '';
      this.total_earned = data.total_earned || 0;
      this.total_due = data.total_due || 0;
      this.report_date = data.report_date ? new Date(data.report_date) : new Date();
      this.event_id = data.event_id || '';
      this.stock_id = data.stock_id || '';
    }
  
    // Méthode pour créer une instance de Report à partir d'un objet JSON
    static createFrom(json: any): Report {
      return new Report({
        _id: json._id,
        seller_id: json.seller_id,
        total_earned: json.total_earned,
        total_due: json.total_due,
        report_date: json.report_date,
        event_id: json.event_id,
        stock_id: json.stock_id,
      });
    }
  }
  