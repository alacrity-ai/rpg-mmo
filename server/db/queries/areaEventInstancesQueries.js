// db/queries/areaEventInstancesQueries.js

const { query } = require('../database');
const AreaEventInstance = require('../../models/AreaEventInstance');

/**
 * Get an area event instance by its ID.
 * @param {number} id - The ID of the event instance.
 * @returns {Promise<AreaEventInstance|null>} The event instance or null if not found.
 */
async function getAreaEventInstanceById(id) {
  const sql = 'SELECT * FROM area_event_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new AreaEventInstance({
      id: rows[0].id,
      template_id: rows[0].template_id,
      phase: rows[0].phase,
      phase_start_time: rows[0].phase_start_time,
      action_votes: rows[0].action_votes,
      completed: rows[0].completed === 1,  // Convert to boolean
      created_at: rows[0].created_at
    });
  }
  return null;
}

/**
 * Get all area event instances.
 * @returns {Promise<AreaEventInstance[]>} The list of all event instances.
 */
async function getAllAreaEventInstances() {
  const sql = 'SELECT * FROM area_event_instances';
  const rows = await query(sql);
  return rows.map(row => new AreaEventInstance({
    id: row.id,
    template_id: row.template_id,
    phase: row.phase,
    phase_start_time: row.phase_start_time,
    action_votes: row.action_votes,
    completed: row.completed === 1,  // Convert to boolean
    created_at: row.created_at
  }));
}

/**
 * Create a new area event instance.
 * @param {Object} params - The parameters for creating a new event instance.
 * @param {number} params.template_id - The ID of the event template.
 * @param {number} params.phase - The current phase of the event.
 * @param {Object} params.action_votes - A JSON object representing the action votes from clients.
 * @param {boolean} params.completed - Whether the event has been completed.
 * @returns {Promise<AreaEventInstance>} The newly created event instance.
 */
async function createAreaEventInstance(params) {
    const currentTime = new Date();
    const sql = 'INSERT INTO area_event_instances (template_id, phase, phase_start_time, action_votes, completed, created_at) VALUES (?, ?, ?, ?, ?, ?)';
    const actionVotes = JSON.stringify(params.action_votes);
    const result = await query(sql, [params.template_id, params.phase, currentTime, actionVotes, params.completed ? 1 : 0, currentTime]);
    const areaEventInstance = new AreaEventInstance({
      id: result.insertId,
      template_id: params.template_id,
      phase: params.phase,
      phase_start_time: currentTime,
      action_votes: params.action_votes,
      completed: params.completed,
      created_at: currentTime
    });
    return areaEventInstance;
}  

/**
 * Update an existing area event instance.
 * @param {number} id - The ID of the event instance to update.
 * @param {Object} params - The parameters for updating the event instance.
 * @param {number} [params.phase] - The current phase of the event.
 * @param {Date} [params.phase_start_time] - The timestamp when the current phase started.
 * @param {Object} [params.action_votes] - A JSON object representing the action votes from clients.
 * @param {boolean} [params.completed] - Whether the event has been completed.
 * @returns {Promise<AreaEventInstance|null>} The updated event instance or null if not found.
 */
async function updateAreaEventInstance(id, params) {
  const sql = 'UPDATE area_event_instances SET phase = ?, phase_start_time = ?, action_votes = ?, completed = ? WHERE id = ?';
  const actionVotes = JSON.stringify(params.action_votes);
  const result = await query(sql, [params.phase, params.phase_start_time, actionVotes, params.completed ? 1 : 0, id]);
  if (result.affectedRows > 0) {
    return getAreaEventInstanceById(id);
  }
  return null;
}

/**
 * Delete an area event instance by its ID.
 * @param {number} id - The ID of the event instance to delete.
 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
 */
async function deleteAreaEventInstance(id) {
  const sql = 'DELETE FROM area_event_instances WHERE id = ?';
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}

/**
 * Add a vote to an area event instance.
 * @param {number} id - The ID of the event instance.
 * @param {number} phase - The current phase of the event.
 * @param {number} action - The action number being voted for.
 * @returns {Promise<AreaEventInstance|null>} The updated event instance or null if not found.
 */
async function addVote(id, phase, action) {
  const eventInstance = await getAreaEventInstanceById(id);
  if (!eventInstance) return null;

  const actionVotes = eventInstance.action_votes || { phases: {} };
  if (!actionVotes.phases[phase]) {
    actionVotes.phases[phase] = {};
  }
  actionVotes.phases[phase][action] = (actionVotes.phases[phase][action] || 0) + 1;

  const sql = 'UPDATE area_event_instances SET action_votes = ? WHERE id = ?';
  await query(sql, [JSON.stringify(actionVotes), id]);

  return getAreaEventInstanceById(id);
}

/**
 * Progress the phase of an area event instance.
 * @param {number} id - The ID of the event instance.
 * @returns {Promise<AreaEventInstance|null>} The updated event instance or null if not found.
 */
async function progressPhase(id) {
  const eventInstance = await getAreaEventInstanceById(id);
  if (!eventInstance) return null;

  const sql = 'UPDATE area_event_instances SET phase = phase + 1, phase_start_time = ? WHERE id = ?';
  await query(sql, [new Date(), id]);

  return getAreaEventInstanceById(id);
}

/**
 * Set the phase of an area event instance to a specific number.
 * @param {number} id - The ID of the event instance.
 * @param {number} phase - The phase number to set.
 * @returns {Promise<AreaEventInstance|null>} The updated event instance or null if not found.
 */
async function setPhase(id, phase) {
  const sql = 'UPDATE area_event_instances SET phase = ?, phase_start_time = ? WHERE id = ?';
  await query(sql, [phase, new Date(), id]);

  return getAreaEventInstanceById(id);
}

/**
 * Complete an area event instance.
 * @param {number} id - The ID of the event instance.
 * @returns {Promise<AreaEventInstance|null>} The updated event instance or null if not found.
 */
async function completeEvent(id) {
  const sql = 'UPDATE area_event_instances SET completed = 1 WHERE id = ?';
  await query(sql, [id]);

  return getAreaEventInstanceById(id);
}

module.exports = {
  createAreaEventInstance,
  getAreaEventInstanceById,
  getAllAreaEventInstances,
  updateAreaEventInstance,
  deleteAreaEventInstance,
  addVote,
  progressPhase,
  setPhase,
  completeEvent
};
