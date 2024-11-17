export class Game {
    constructor(
      public name: string,
      public editor: string,
      public description: string,
      public count: number
    ) {}
  
    // Méthode pour créer une instance de Game à partir d'un objet JSON
    static createFrom(json: any): Game {
      return new Game(
        json.name || '',       // Valeur par défaut si absente
        json.editor || '',
        json.description || '',
        json.count || 0
      );
    }
  }
  