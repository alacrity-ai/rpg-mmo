// test/models/AreaInstanceTest.js

const AreaInstance = require('../../models/AreaInstance');

describe('AreaInstance', () => {
  it('should create an instance of AreaInstance with correct properties', () => {
    const areaInstance = new AreaInstance({
      id: 1,
      background_image: 'forest.png',
      encounter: 1,
      friendlyNpcs: { 201: 1 },
      explored: false,
      created_at: new Date('2023-10-15T08:10:25.000Z')
    });

    expect(areaInstance.id).toBe(1);
    expect(areaInstance.background_image).toBe('forest.png');
    expect(areaInstance.encounter).toBe(1);
    expect(areaInstance.friendlyNpcs).toEqual({ 201: 1 });
    expect(areaInstance.explored).toBe(false);
    expect(areaInstance.created_at).toEqual(new Date('2023-10-15T08:10:25.000Z'));
  });

  it('should create an instance of AreaInstance with default encounter as null', () => {
    const areaInstance = new AreaInstance({
      id: 2,
      background_image: 'desert.png',
      friendlyNpcs: { 202: 2 },
      explored: true,
      created_at: new Date('2023-10-16T08:10:25.000Z')
    });

    expect(areaInstance.id).toBe(2);
    expect(areaInstance.background_image).toBe('desert.png');
    expect(areaInstance.encounter).toBeNull();
    expect(areaInstance.friendlyNpcs).toEqual({ 202: 2 });
    expect(areaInstance.explored).toBe(true);
    expect(areaInstance.created_at).toEqual(new Date('2023-10-16T08:10:25.000Z'));
  });

  it('should create an instance of AreaInstance with default explored as false', () => {
    const areaInstance = new AreaInstance({
      id: 3,
      background_image: 'mountains.png',
      encounter: 2,
      friendlyNpcs: { 203: 3 },
      created_at: new Date('2023-10-17T08:10:25.000Z')
    });

    expect(areaInstance.id).toBe(3);
    expect(areaInstance.background_image).toBe('mountains.png');
    expect(areaInstance.encounter).toBe(2);
    expect(areaInstance.friendlyNpcs).toEqual({ 203: 3 });
    expect(areaInstance.explored).toBe(false);
    expect(areaInstance.created_at).toEqual(new Date('2023-10-17T08:10:25.000Z'));
  });
});
