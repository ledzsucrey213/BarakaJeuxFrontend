import { GameLabel } from './game-label';

describe('GameLabel', () => {
  it('should create an instance with provided values', () => {
    const gameLabelData = {
      _id: '60f5c3b2f7a7f0d2b4db5d91',  // Ajout de _id
      sellerId: '12345',
      gameId: '67890',
      price: 100,
      eventId: '54321',
      condition: 'new' as 'new' | 'very good' | 'good' | 'poor',
      depositFee: 20,
      isSold: false,
      creation: new Date('2024-11-15T10:00:00Z'),
      isOnSale: true,
    };

    const gameLabel = new GameLabel(gameLabelData);

    expect(gameLabel).toBeTruthy();
    expect(gameLabel._id).toBe('60f5c3b2f7a7f0d2b4db5d91');  // Vérification de _id
    expect(gameLabel.sellerId).toBe('12345');
    expect(gameLabel.gameId).toBe('67890');
    expect(gameLabel.price).toBe(100);
    expect(gameLabel.eventId).toBe('54321');
    expect(gameLabel.condition).toBe('new');
    expect(gameLabel.depositFee).toBe(20);
    expect(gameLabel.isSold).toBe(false);
    expect(gameLabel.creation).toEqual(new Date('2024-11-15T10:00:00Z'));
    expect(gameLabel.isOnSale).toBe(true);
  });

  it('should create an instance with default values when using createFrom', () => {
    const jsonData = {
      _id: '60f5c3b2f7a7f0d2b4db5d92', // Ajout de _id
      seller_id: '11111',
      game_id: '22222',
      price: 150,
      event_id: '33333',
      condition: 'very good',
      deposit_fee: 25,
      is_Sold: true,
      creation: '2024-11-14T09:30:00Z',
      is_On_Sale: false,
    };

    const gameLabel = GameLabel.createFrom(jsonData);

    expect(gameLabel).toBeTruthy();
    expect(gameLabel._id).toBe('60f5c3b2f7a7f0d2b4db5d92');  // Vérification de _id
    expect(gameLabel.sellerId).toBe('11111');
    expect(gameLabel.gameId).toBe('22222');
    expect(gameLabel.price).toBe(150);
    expect(gameLabel.eventId).toBe('33333');
    expect(gameLabel.condition).toBe('very good');
    expect(gameLabel.depositFee).toBe(25);
    expect(gameLabel.isSold).toBe(true);
    expect(gameLabel.creation).toEqual(new Date('2024-11-14T09:30:00Z'));
    expect(gameLabel.isOnSale).toBe(false);
  });

  it('should create an instance with default values when properties are missing', () => {
    const jsonData = {
      _id: '60f5c3b2f7a7f0d2b4db5d93', // Ajout de _id
      seller_id: '99999',
      price: 50,
      condition: 'poor',
    };

    const gameLabel = GameLabel.createFrom(jsonData);

    expect(gameLabel).toBeTruthy();
    expect(gameLabel._id).toBe('60f5c3b2f7a7f0d2b4db5d93');  // Vérification de _id
    expect(gameLabel.sellerId).toBe('99999');
    expect(gameLabel.gameId).toBe(''); // Valeur par défaut
    expect(gameLabel.price).toBe(50);
    expect(gameLabel.eventId).toBe(''); // Valeur par défaut
    expect(gameLabel.condition).toBe('poor');
    expect(gameLabel.depositFee).toBe(0); // Valeur par défaut
    expect(gameLabel.isSold).toBe(false); // Valeur par défaut
    expect(gameLabel.creation).toBeTruthy(); // La date actuelle
    expect(gameLabel.isOnSale).toBe(true); // Valeur par défaut
  });

  it('should create an instance with all default values when empty data is provided', () => {
    const gameLabel = new GameLabel({});

    expect(gameLabel).toBeTruthy();
    expect(gameLabel._id).toBe('');  // Vérification de _id (valeur par défaut)
    expect(gameLabel.sellerId).toBe('');
    expect(gameLabel.gameId).toBe('');
    expect(gameLabel.price).toBe(0);
    expect(gameLabel.eventId).toBe('');
    expect(gameLabel.condition).toBe('new'); // Valeur par défaut
    expect(gameLabel.depositFee).toBe(0);
    expect(gameLabel.isSold).toBe(false);
    expect(gameLabel.creation).toBeTruthy(); // La date actuelle
    expect(gameLabel.isOnSale).toBe(true);
  });
});
