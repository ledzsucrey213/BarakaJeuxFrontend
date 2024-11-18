import { Invoice } from './invoice';

describe('Invoice Model', () => {
  it('should create an instance of Invoice with provided data', () => {
    const mockData = {
      _id: '644afab2c5c84212e8d6f3a3',
      sale_id: '6433be4df5d34208b8c8edaf',
      buyer_id: '6439be4df5d34208b8c8edaf',
    };

    const invoice = new Invoice(mockData);

    expect(invoice._id).toBe(mockData._id);
    expect(invoice.sale_id).toBe(mockData.sale_id);
    expect(invoice.buyer_id).toBe(mockData.buyer_id);
  });

  it('should create an empty instance of Invoice when no data is provided', () => {
    const invoice = new Invoice({});

    expect(invoice._id).toBe('');
    expect(invoice.sale_id).toBe('');
    expect(invoice.buyer_id).toBe('');
  });

  it('should correctly create an instance from JSON using static method', () => {
    const mockJson = {
      _id: '644afab2c5c84212e8d6f3a3',
      sale_id: '6433be4df5d34208b8c8edaf',
      buyer_id: '6439be4df5d34208b8c8edaf',
    };

    const invoice = Invoice.createFrom(mockJson);

    expect(invoice._id).toBe(mockJson._id);
    expect(invoice.sale_id).toBe(mockJson.sale_id);
    expect(invoice.buyer_id).toBe(mockJson.buyer_id);
  });
});
