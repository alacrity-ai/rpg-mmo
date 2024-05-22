// test/models/NpcStatus.test.js

const NpcStatus = require('../../models/NpcStatus');

describe('NpcStatus', () => {
  it('should create an instance of NpcStatus with correct properties', () => {
    const npcStatus = new NpcStatus({
      id: 1,
      npc_instance_id: 1,
      statuses: {
        101: '2024-05-20T15:00:00Z',
        102: '2024-05-20T15:05:00Z'
      }
    });

    expect(npcStatus.id).toBe(1);
    expect(npcStatus.npcInstanceId).toBe(1);
    expect(npcStatus.statuses).toEqual({
      101: '2024-05-20T15:00:00Z',
      102: '2024-05-20T15:05:00Z'
    });
  });

  it('should handle an empty statuses object correctly', () => {
    const npcStatus = new NpcStatus({
      id: 2,
      npc_instance_id: 2,
      statuses: {}
    });

    expect(npcStatus.id).toBe(2);
    expect(npcStatus.npcInstanceId).toBe(2);
    expect(npcStatus.statuses).toEqual({});
  });

  it('should handle a single status correctly', () => {
    const npcStatus = new NpcStatus({
      id: 3,
      npc_instance_id: 3,
      statuses: {
        103: '2024-05-21T10:00:00Z'
      }
    });

    expect(npcStatus.id).toBe(3);
    expect(npcStatus.npcInstanceId).toBe(3);
    expect(npcStatus.statuses).toEqual({
      103: '2024-05-21T10:00:00Z'
    });
  });
});
