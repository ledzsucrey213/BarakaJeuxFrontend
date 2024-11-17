export class User {
    id: string;
    firstname: string;
    name: string;
    email: string;
    address?: string;
    role: 'seller' | 'buyer' | 'admin' | 'manager';
    password?: string;
  
    constructor(data: Partial<User>) {
      this.id = data.id || '';
      this.firstname = data.firstname || '';
      this.name = data.name || '';
      this.email = data.email || '';
      this.address = data.address;
      this.role = data.role || 'buyer';
      this.password = data.password;
    }
  
    // Crée une instance de User à partir d'un objet JSON
    static createFrom(json: any): User {
      return new User({
        id: json._id,
        firstname: json.firstname,
        name: json.name,
        email: json.email,
        address: json.address,
        role: json.role,
      });
    }
  }
  