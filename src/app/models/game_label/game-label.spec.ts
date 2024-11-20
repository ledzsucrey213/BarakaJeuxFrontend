import { GameLabel } from './game-label';

describe('GameLabel', () => {
  it('should create an instance with provided values', () => {
    const gameLabelData = {
      _id: '60f5c3b2f7a7f0d2b4db5d91',  // Ajout de _id
      seller_id: '12345',
      game_id: '67890',
      price: 100,
      eventId: '54321',
      condition: 'new' as 'new' | 'very good' | 'good' | 'poor',
      depositFee: 20,
      isSold: false,
      creation: new Date('2024-11-15T10:00:00Z'),
      is_On_Sale: true,
    };

    const gameLabel = new GameLabel(gameLabelData);

    expect(gameLabel).toBeTruthy();
    expect(gameLabel._id).toBe('60f5c3b2f7a7f0d2b4db5d91');  // Vérification de _id
    expect(gameLabel.seller_id).toBe('12345');
    expect(gameLabel.game_id).toBe('67890');
    expect(gameLabel.price).toBe(100);
    expect(gameLabel.event_id).toBe('54321');
    expect(gameLabel.condition).toBe('new');
    expect(gameLabel.deposit_fee).toBe(20);
    expect(gameLabel.is_Sold).toBe(false);
    expect(gameLabel.creation).toEqual(new Date('2024-11-15T10:00:00Z'));
    expect(gameLabel.is_On_Sale).toBe(true);
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
    expect(gameLabel.seller_id).toBe('11111');
    expect(gameLabel.game_id).toBe('22222');
    expect(gameLabel.price).toBe(150);
    expect(gameLabel.event_id).toBe('33333');
    expect(gameLabel.condition).toBe('very good');
    expect(gameLabel.deposit_fee).toBe(25);
    expect(gameLabel.is_Sold).toBe(true);
    expect(gameLabel.creation).toEqual(new Date('2024-11-14T09:30:00Z'));
    expect(gameLabel.is_On_Sale).toBe(false);
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
    expect(gameLabel.seller_id).toBe('99999');
    expect(gameLabel.game_id).toBe(''); // Valeur par défaut
    expect(gameLabel.price).toBe(50);
    expect(gameLabel.event_id).toBe(''); // Valeur par défaut
    expect(gameLabel.condition).toBe('poor');
    expect(gameLabel.deposit_fee).toBe(0); // Valeur par défaut
    expect(gameLabel.is_Sold).toBe(false); // Valeur par défaut
    expect(gameLabel.creation).toBeTruthy(); // La date actuelle
    expect(gameLabel.is_On_Sale).toBe(true); // Valeur par défaut
  });

  it('should create an instance with all default values when empty data is provided', () => {
    const gameLabel = new GameLabel({});

    expect(gameLabel).toBeTruthy();
    expect(gameLabel._id).toBe('');  // Vérification de _id (valeur par défaut)
    expect(gameLabel.seller_id).toBe('');
    expect(gameLabel.game_id).toBe('');
    expect(gameLabel.price).toBe(0);
    expect(gameLabel.event_id).toBe('');
    expect(gameLabel.condition).toBe('new'); // Valeur par défaut
    expect(gameLabel.deposit_fee).toBe(0);
    expect(gameLabel.is_Sold).toBe(false);
    expect(gameLabel.creation).toBeTruthy(); // La date actuelle
    expect(gameLabel.is_On_Sale).toBe(true);
  });
});
