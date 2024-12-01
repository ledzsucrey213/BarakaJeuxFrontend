import { Sale } from './sale';
import { GameLabel } from '../game_label/game-label';

describe('Sale', () => {
  it('should create an instance of Sale with the provided values', () => {
    const mockGameLabel: GameLabel = new GameLabel({
      _id: 'game123',
      seller_id: 'seller123',
      game_id: 'gameABC',
      price: 59.99,
      event_id: 'event123',
      condition: 'new',
      deposit_fee: 5,
      is_Sold: false,
      creation: new Date('2024-01-01T12:00:00Z'),
      is_On_Sale: true,
    });

    const sale = new Sale(
      'sale123',
      100,
      [mockGameLabel],
      new Date('2024-01-01T10:00:00Z'),
      10,
      'card'
    );

    expect(sale._id).toBe('sale123');
    expect(sale.total_price).toBe(100);
    expect(sale.games_id.length).toBe(1);
    expect(sale.games_id[0]._id).toBe('game123');
    expect(sale.games_id[0].seller_id).toBe('seller123');
    expect(sale.sale_date.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    expect(sale.total_commission).toBe(10);
    expect(sale.paid_with).toBe('card');
  });

  it('should create an instance of Sale using createFrom method with JSON', () => {
    const json = {
      _id: 'sale456',
      total_price: 200,
      games_id: [
        {
          _id: 'game456',
          seller_id: 'seller456',
          game_id: 'gameDEF',
          price: 49.99,
          event_id: 'event456',
          condition: 'very good',
          deposit_fee: 10,
          is_Sold: false,
          creation: '2024-01-01T12:00:00Z',
          is_On_Sale: true,
        },
      ],
      buyer_id: 'buyer456',
      sale_date: '2024-02-01T15:00:00Z',
      total_commission: 20,
      paid_with: 'cash',
    };

    const sale = Sale.createFrom(json);

    expect(sale._id).toBe('sale456');
    expect(sale.total_price).toBe(200);
    expect(sale.games_id.length).toBe(1);
    expect(sale.games_id[0]._id).toBe('game456');
    expect(sale.games_id[0].seller_id).toBe('seller456');
    expect(sale.games_id[0].condition).toBe('very good');
    expect(sale.sale_date.toISOString()).toBe('2024-02-01T15:00:00.000Z');
    expect(sale.total_commission).toBe(20);
    expect(sale.paid_with).toBe('cash');
  });

  it('should handle missing fields gracefully with createFrom', () => {
    const json = {
      total_price: 50,
      buyer_id: 'buyer789',
      paid_with: 'card',
    };

    const sale = Sale.createFrom(json);

    expect(sale._id).toBe('');
    expect(sale.total_price).toBe(50);
    expect(sale.games_id).toEqual([]);
    expect(sale.sale_date instanceof Date).toBe(true);
    expect(sale.total_commission).toBe(0);
    expect(sale.paid_with).toBe('card');
  });

  it('should default paid_with to "card" if not provided', () => {
    const json = {
      _id: 'sale789',
      total_price: 150,
      games_id: [],
      buyer_id: 'buyer789',
      sale_date: '2024-03-01T12:00:00Z',
      total_commission: 15,
    };

    const sale = Sale.createFrom(json);

    expect(sale.paid_with).toBe('card');
  });
});
