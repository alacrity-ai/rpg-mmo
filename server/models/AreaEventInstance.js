// models/AreaEventInstance.js

/**
 * Class representing an area event instance.
 */
class AreaEventInstance {
    /**
     * Create an area event instance.
     * @param {Object} params - The parameters for creating an area event instance.
     * @param {number} params.id - The ID of the event instance.
     * @param {number} params.template_id - The ID of the event template.
     * @param {number} params.phase - The current phase of the event.
     * @param {Date} params.phase_start_time - The timestamp when the current phase started.
     * @param {Object} params.action_votes - A JSON object representing the action votes from clients.
     * @param {boolean} params.completed - Whether the event has been completed.
     * @param {Date} params.created_at - The timestamp when the event instance was created.
     */
    constructor({ id, template_id, phase, phase_start_time, action_votes, completed, created_at }) {
      this.id = id;
      this.template_id = template_id;
      this.phase = phase;
      this.phase_start_time = phase_start_time;
      this.action_votes = action_votes;
      this.completed = !!completed;  // Ensure boolean value
      this.created_at = created_at;
    }
  }
  
module.exports = AreaEventInstance;
  
/**
 * Example usage:
 *
 * const areaEventInstance = new AreaEventInstance({
 *   id: 1,
 *   template_id: 1,
 *   phase: 1,
 *   phase_start_time: new Date(),
 *   action_votes: { phases: { '1': { '1': 2, '2': 1 } } },
 *   completed: false,
 *   created_at: new Date()
 * });
 *
 * Example action_votes JSON object:
 * {
 *   "phases": {
 *     "1": {
 *       "1": 2, // Action 1 received 2 votes
 *       "2": 1  // Action 2 received 1 vote
 *     },
 *     "2": {
 *       "1": 3, // Action 1 received 3 votes in phase 2
 *       "2": 2  // Action 2 received 2 votes in phase 2
 *     }
 *   }
 * }
 */
  