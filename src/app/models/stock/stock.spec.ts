import { Stock } from "./stock";

describe('Stock Model', () => {
  it('should create an empty Stock instance', () => {
    const stock = new Stock({});

    expect(stock._id).toBe('');
    expect(stock.games_id).toEqual([]);
    expect(stock.seller_id).toBe('');
    expect(stock.games_sold).toEqual([]);
  });

  it('should create a Stock instance with provided data', () => {
    const stockData = {
      _id: '12345',
      games_id: ['game1', 'game2'],
      seller_id: 'seller123',
      games_sold: ['game3']
    };

    const stock = new Stock(stockData);

    expect(stock._id).toBe(stockData._id);
    expect(stock.games_id).toEqual(stockData.games_id);
    expect(stock.seller_id).toBe(stockData.seller_id);
    expect(stock.games_sold).toEqual(stockData.games_sold);
  });

  it('should create a Stock instance from JSON using createFrom', () => {
    const json = {
      _id: '67890',
      games_id: ['game4', 'game5'],
      seller_id: 'seller456',
      games_sold: ['game6']
    };

    const stock = Stock.createFrom(json);

    expect(stock._id).toBe(json._id);
    expect(stock.games_id).toEqual(json.games_id);
    expect(stock.seller_id).toBe(json.seller_id);
    expect(stock.games_sold).toEqual(json.games_sold);
  });

  it('should handle missing optional properties in createFrom', () => {
    const json = {
      _id: '54321',
      seller_id: 'seller789'
    };

    const stock = Stock.createFrom(json);

    expect(stock._id).toBe(json._id);
    expect(stock.seller_id).toBe(json.seller_id);
    expect(stock.games_id).toEqual([]);
    expect(stock.games_sold).toEqual([]);
  });
});
