// test/models/AreaInstanceTest.js

const AreaInstance = require('../../models/AreaInstance');

describe('AreaInstance', () => {
  it('should create an instance of AreaInstance with correct properties', () => {
    const areaInstance = new AreaInstance({
      id: 1,
      background_image: 'forest.png',
      encounter: 1,
      friendlyNpcs: { 201: 1 },
      created_at: new Date('2023-10-15T08:10:25.000Z')
    });

    expect(areaInstance.id).toBe(1);
    expect(areaInstance.backgroundImage).toBe('forest.png');
    expect(areaInstance.encounter).toBe(1);
    expect(areaInstance.friendlyNpcs).toEqual({ 201: 1 });
    expect(areaInstance.created_at).toEqual(new Date('2023-10-15T08:10:25.000Z'));
  });

  it('should create an instance of AreaInstance with default encounter as null', () => {
    const areaInstance = new AreaInstance({
      id: 2,
      background_image: 'desert.png',
      friendlyNpcs: { 202: 2 },
      created_at: new Date('2023-10-16T08:10:25.000Z')
    });

    expect(areaInstance.id).toBe(2);
    expect(areaInstance.backgroundImage).toBe('desert.png');
    expect(areaInstance.encounter).toBeNull();
    expect(areaInstance.friendlyNpcs).toEqual({ 202: 2 });
    expect(areaInstance.created_at).toEqual(new Date('2023-10-16T08:10:25.000Z'));
  });
});
