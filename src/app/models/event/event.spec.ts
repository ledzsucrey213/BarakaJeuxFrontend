import { Event } from './event';

describe('Event Model', () => {
  it('should create an empty Event instance', () => {
    const event = new Event({});

    expect(event._id).toBe('');
    expect(event.name).toBe('');
    expect(event.start).toEqual(jasmine.any(Date));
    expect(event.end).toEqual(jasmine.any(Date));
    expect(event.is_active).toBe(false);
    expect(event.commission).toBe(0);
  });

  it('should create an Event instance with provided data', () => {
    const eventData = {
      _id: '12345',
      name: 'Winter Carnival',
      start: new Date('2024-12-01T00:00:00Z'),
      end: new Date('2024-12-10T00:00:00Z'),
      is_active: true,
      commission: 12.5,
    };

    const event = new Event(eventData);

    expect(event._id).toBe(eventData._id);
    expect(event.name).toBe(eventData.name);
    expect(event.start).toEqual(eventData.start);
    expect(event.end).toEqual(eventData.end);
    expect(event.is_active).toBe(eventData.is_active);
    expect(event.commission).toBe(eventData.commission);
  });

  it('should create an Event instance from JSON using createFrom', () => {
    const json = {
      _id: '67890',
      name: 'Spring Gala',
      start: '2024-04-01T12:00:00Z',
      end: '2024-04-05T12:00:00Z',
      is_active: true,
      commission: 15.75,
    };

    const event = Event.createFrom(json);

    expect(event._id).toBe(json._id);
    expect(event.name).toBe(json.name);
    expect(event.start).toEqual(new Date(json.start));
    expect(event.end).toEqual(new Date(json.end));
    expect(event.is_active).toBe(json.is_active);
    expect(event.commission).toBe(json.commission);
  });

  it('should handle missing optional properties in createFrom', () => {
    const json = {
      _id: '54321',
      name: 'Autumn Fair',
    };

    const event = Event.createFrom(json);

    expect(event._id).toBe(json._id);
    expect(event.name).toBe(json.name);
    expect(event.start).toEqual(jasmine.any(Date)); // Default value
    expect(event.end).toEqual(jasmine.any(Date)); // Default value
    expect(event.is_active).toBe(false); // Default value
    expect(event.commission).toBe(0); // Default value
  });
});
