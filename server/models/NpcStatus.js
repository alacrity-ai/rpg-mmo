/**
 * Class representing an NPC's status.
 */
class NpcStatus {
    /**
     * Create an NPC's status.
     * @param {Object} params - The parameters for creating an NPC's status.
     * @param {number} params.id - The ID of the NPC status.
     * @param {number} params.npc_instance_id - The ID of the NPC instance.
     * @param {Object} params.statuses - A map of status template IDs to their applied timestamps.
     */
    constructor({ id, npc_instance_id, statuses }) {
      this.id = id;
      this.npcInstanceId = npc_instance_id;
      this.statuses = statuses;
    }
  }
  
  module.exports = NpcStatus;
  
  /**
   * Example usage:
   * 
   * const npcStatus = new NpcStatus({
   *   id: 1,
   *   npc_instance_id: 1,
   *   statuses: {
   *     101: '2024-05-20T15:00:00Z',
   *     102: '2024-05-20T15:05:00Z'
   *   }
   * });
   * 
   * console.log(npcStatus);
   * // NpcStatus {
   * //   id: 1,
   * //   npcInstanceId: 1,
   * //   statuses: {
   * //     101: '2024-05-20T15:00:00Z',
   * //     102: '2024-05-20T15:05:00Z'
   * //   }
   * // }
   */
  