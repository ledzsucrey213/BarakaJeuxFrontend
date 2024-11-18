import { Report } from './report.model';

describe('Report Model', () => {
  it('should create an empty Report instance', () => {
    const report = new Report({});

    expect(report._id).toBe('');
    expect(report.seller_id).toBe('');
    expect(report.total_earned).toBe(0);
    expect(report.total_due).toBe(0);
    expect(report.report_date).toEqual(jasmine.any(Date));
    expect(report.event_id).toBe('');
    expect(report.stock_id).toBe('');
  });

  it('should create a Report instance with provided data', () => {
    const reportData = {
      _id: '12345',
      seller_id: 'seller123',
      total_earned: 150.50,
      total_due: 20.00,
      report_date: '2024-11-17T00:00:00Z',
      event_id: 'event123',
      stock_id: 'stock123',
    };

    const report = new Report(reportData);

    expect(report._id).toBe(reportData._id);
    expect(report.seller_id).toBe(reportData.seller_id);
    expect(report.total_earned).toBe(reportData.total_earned);
    expect(report.total_due).toBe(reportData.total_due);
    expect(report.report_date).toEqual(new Date(reportData.report_date));
    expect(report.event_id).toBe(reportData.event_id);
    expect(report.stock_id).toBe(reportData.stock_id);
  });

  it('should create a Report instance from JSON using createFrom', () => {
    const json = {
      _id: '67890',
      seller_id: 'seller456',
      total_earned: 200,
      total_due: 50,
      report_date: '2024-11-18T12:00:00Z',
      event_id: 'event456',
      stock_id: 'stock456',
    };

    const report = Report.createFrom(json);

    expect(report._id).toBe(json._id);
    expect(report.seller_id).toBe(json.seller_id);
    expect(report.total_earned).toBe(json.total_earned);
    expect(report.total_due).toBe(json.total_due);
    expect(report.report_date).toEqual(new Date(json.report_date));
    expect(report.event_id).toBe(json.event_id);
    expect(report.stock_id).toBe(json.stock_id);
  });

  it('should handle missing optional properties in createFrom', () => {
    const json = {
      _id: '54321',
      seller_id: 'seller789',
      total_earned: 0,
      event_id: 'event789',
    };

    const report = Report.createFrom(json);

    expect(report._id).toBe(json._id);
    expect(report.seller_id).toBe(json.seller_id);
    expect(report.total_earned).toBe(json.total_earned);
    expect(report.total_due).toBe(0); // Default value
    expect(report.report_date).toEqual(jasmine.any(Date)); // Default date
    expect(report.event_id).toBe(json.event_id);
    expect(report.stock_id).toBe(''); // Default value
  });
});
