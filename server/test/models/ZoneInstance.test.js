// test/models/ZoneInstance.test.js

const ZoneInstance = require('../../models/ZoneInstance');

describe('ZoneInstance', () => {
  it('should create an instance of ZoneInstance with correct properties', () => {
    const zoneInstance = new ZoneInstance({
      id: 1,
      name: 'Forest Zone',
      template_id: 101,
      areas: {
        1: { north: 2, south: null, east: 3, west: null, type: 'entrance' },
        2: { north: null, south: 1, east: 4, west: null, type: 'area' },
        3: { north: 4, south: null, east: null, west: 1, type: 'area' },
        4: { north: null, south: 3, east: null, west: 2, type: 'exit' }
      },
      created_at: new Date('2023-10-15T08:10:25.000Z')
    });

    expect(zoneInstance.id).toBe(1);
    expect(zoneInstance.name).toBe('Forest Zone');
    expect(zoneInstance.templateId).toBe(101);
    expect(zoneInstance.areas).toEqual({
      1: { north: 2, south: null, east: 3, west: null, type: 'entrance' },
      2: { north: null, south: 1, east: 4, west: null, type: 'area' },
      3: { north: 4, south: null, east: null, west: 1, type: 'area' },
      4: { north: null, south: 3, east: null, west: 2, type: 'exit' }
    });
    expect(zoneInstance.created_at).toEqual(new Date('2023-10-15T08:10:25.000Z'));
  });

  it('should handle missing optional properties correctly', () => {
    const zoneInstance = new ZoneInstance({
      id: 2,
      name: 'Desert Zone',
      template_id: 102,
      areas: {
        1: { north: null, south: 2, east: null, west: null, type: 'entrance' },
        2: { north: 1, south: null, east: null, west: null, type: 'exit' }
      },
      created_at: new Date('2023-11-15T08:10:25.000Z')
    });

    expect(zoneInstance.id).toBe(2);
    expect(zoneInstance.name).toBe('Desert Zone');
    expect(zoneInstance.templateId).toBe(102);
    expect(zoneInstance.areas).toEqual({
      1: { north: null, south: 2, east: null, west: null, type: 'entrance' },
      2: { north: 1, south: null, east: null, west: null, type: 'exit' }
    });
    expect(zoneInstance.created_at).toEqual(new Date('2023-11-15T08:10:25.000Z'));
  });
});
