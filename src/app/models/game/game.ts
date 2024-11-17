export class Game {
  _id: string;  // Ajout de l'attribut _id (qui correspondra à l'ObjectId de MongoDB)
  name: string;
  editor: string;
  description: string;
  count: number;

  constructor(
    _id: string,  // Ajouter le paramètre _id dans le constructeur
    name: string,
    editor: string,
    description: string,
    count: number
  ) {
    this._id = _id;
    this.name = name;
    this.editor = editor;
    this.description = description;
    this.count = count;
  }

  // Méthode pour créer une instance de Game à partir d'un objet JSON
  static createFrom(json: any): Game {
    return new Game(
      json._id || '',          // Récupération de l'_id si présent dans le JSON, sinon une chaîne vide
      json.name || '',        // Valeur par défaut si absente
      json.editor || '',
      json.description || '',
      json.count || 0
    );
  }
}
