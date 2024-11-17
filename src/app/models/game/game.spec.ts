import { Game } from './game';

describe('Game', () => {
  it('should create an instance with provided values', () => {
    const gameData = {
      _id: '60f5c3b2f7a7f0d2b4db5d91', // Ajout de l'ID
      name: 'Chess',
      editor: 'Classic Games',
      description: 'A strategy board game for two players.',
      count: 2,
    };

    const game = new Game(gameData._id, gameData.name, gameData.editor, gameData.description, gameData.count);

    expect(game).toBeTruthy();
    expect(game._id).toBe('60f5c3b2f7a7f0d2b4db5d91'); // Test de l'_id
    expect(game.name).toBe('Chess');
    expect(game.editor).toBe('Classic Games');
    expect(game.description).toBe('A strategy board game for two players.');
    expect(game.count).toBe(2);
  });

  it('should create an instance with default values when using createFrom', () => {
    const jsonData = {
      _id: '60f5c3b2f7a7f0d2b4db5d91', // Ajout de l'ID dans les données JSON
      name: 'Monopoly',
      editor: 'Hasbro',
      description: 'A popular property trading game.',
      count: 5,
    };

    const game = Game.createFrom(jsonData);

    expect(game).toBeTruthy();
    expect(game._id).toBe('60f5c3b2f7a7f0d2b4db5d91'); // Vérification de l'_id
    expect(game.name).toBe('Monopoly');
    expect(game.editor).toBe('Hasbro');
    expect(game.description).toBe('A popular property trading game.');
    expect(game.count).toBe(5);
  });

  it('should create an instance with default values when properties are missing', () => {
    const jsonData = {
      _id: '60f5c3b2f7a7f0d2b4db5d91', // ID présent mais autres propriétés manquantes
      editor: 'Nintendo',
    };

    const game = Game.createFrom(jsonData);

    expect(game).toBeTruthy();
    expect(game._id).toBe('60f5c3b2f7a7f0d2b4db5d91'); // Vérification de l'_id
    expect(game.name).toBe(''); // Valeur par défaut
    expect(game.editor).toBe('Nintendo');
    expect(game.description).toBe(''); // Valeur par défaut
    expect(game.count).toBe(0); // Valeur par défaut
  });
});
