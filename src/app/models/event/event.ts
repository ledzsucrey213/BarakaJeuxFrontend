// models/event/event.ts

export class Event {
    _id: string;
    name: string;
    start: Date;
    end: Date;
    is_active: boolean;
    commission: number;
    deposit_fee : number
  
    constructor(data: Partial<Event>) {
      this._id = data._id || '';
      this.name = data.name || '';
      this.start = data.start ? new Date(data.start) : new Date();
      this.end = data.end ? new Date(data.end) : new Date();
      this.is_active = data.is_active || false;
      this.commission = data.commission || 0;
      this.deposit_fee = data.deposit_fee || 0;
    }
  
    // Méthode pour créer une instance d'Event à partir d'un objet JSON
    static createFrom(json: any): Event {
      return new Event({
        _id: json._id,
        name: json.name,
        start: json.start,
        end: json.end,
        is_active: json.is_active,
        commission: json.commission,
        deposit_fee : json.deposit_fee
      });
    }
  }
  