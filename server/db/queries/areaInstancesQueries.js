// db/queries/areaInstancesQueries.js

const { query } = require('../database');
const AreaInstance = require('../../models/AreaInstance');

/**
 * Get an area instance by its ID.
 * @param {number} id - The ID of the area instance.
 * @returns {Promise<AreaInstance|null>} The area instance or null if not found.
 */
async function getAreaInstanceById(id) {
  const sql = 'SELECT * FROM area_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new AreaInstance({
      id: rows[0].id,
      background_image: rows[0].background_image,
      encounter: rows[0].encounter,
      friendlyNpcs: rows[0].friendly_npcs,
      explored: rows[0].explored === 1,  // Convert to boolean
      event_instance_id: rows[0].event_instance_id,
      created_at: rows[0].created_at
    });
  }
  return null;
}

/**
 * Get all area instances.
 * @returns {Promise<AreaInstance[]>} The list of all area instances.
 */
async function getAllAreaInstances() {
  const sql = 'SELECT * FROM area_instances';
  const rows = await query(sql);
  return rows.map(row => new AreaInstance({
    id: row.id,
    background_image: row.background_image,
    encounter: row.encounter,
    friendlyNpcs: row.friendly_npcs,
    explored: row.explored === 1,  // Convert to boolean
    event_instance_id: row.event_instance_id,
    created_at: row.created_at
  }));
}

/**
 * Create a new area instance.
 * @param {Object} params - The parameters for creating a new area instance.
 * @param {string} params.background_image - The background image for the area instance.
 * @param {number} [params.encounter] - The ID of the encounter associated with the area.
 * @param {Object} params.friendlyNpcs - A map of friendly NPC template IDs to their quantities.
 * @param {boolean} [params.explored] - Whether the area has been explored.
 * @param {number} [params.event_instance_id] - The ID of the event instance associated with the area.
 * @returns {Promise<AreaInstance>} The newly created area instance.
 */
async function createAreaInstance(params) {
  const sql = 'INSERT INTO area_instances (background_image, encounter, friendly_npcs, explored, event_instance_id, created_at) VALUES (?, ?, ?, ?, ?, ?)';
  const friendlyNpcs = JSON.stringify(params.friendlyNpcs);
  const queryParams = [
    params.background_image,
    params.encounter,
    friendlyNpcs,
    params.explored ? 1 : 0,
    params.event_instance_id !== undefined ? params.event_instance_id : null,
    new Date()
  ];
  const result = await query(sql, queryParams);
  const areaInstance = new AreaInstance({
    id: result.insertId,
    background_image: params.background_image,
    encounter: params.encounter,
    friendlyNpcs: params.friendlyNpcs,
    explored: params.explored,
    event_instance_id: params.event_instance_id !== undefined ? params.event_instance_id : null,
    created_at: new Date()
  });
  return areaInstance;
}

/**
 * Update an existing area instance.
 * @param {number} id - The ID of the area instance to update.
 * @param {Object} params - The parameters for updating the area instance.
 * @param {string} [params.background_image] - The background image for the area instance.
 * @param {number} [params.encounter] - The ID of the encounter associated with the area.
 * @param {Object} [params.friendlyNpcs] - A map of friendly NPC template IDs to their quantities.
 * @param {boolean} [params.explored] - Whether the area has been explored.
 * @param {number} [params.event_instance_id] - The ID of the event instance associated with the area.
 * @returns {Promise<AreaInstance|null>} The updated area instance or null if not found.
 */
async function updateAreaInstance(id, params) {
  const sql = 'UPDATE area_instances SET background_image = ?, encounter = ?, friendly_npcs = ?, explored = ?, event_instance_id = ? WHERE id = ?';
  const friendlyNpcs = JSON.stringify(params.friendlyNpcs);
  const result = await query(sql, [params.background_image, params.encounter, friendlyNpcs, params.explored ? 1 : 0, params.event_instance_id, id]);
  if (result.affectedRows > 0) {
    return getAreaInstanceById(id);
  }
  return null;
}

/**
 * Delete an area instance by its ID.
 * @param {number} id - The ID of the area instance to delete.
 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
 */
async function deleteAreaInstance(id) {
  const sql = 'DELETE FROM area_instances WHERE id = ?';
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}

async function getEncounterByAreaInstanceId(id) {
  const sql = 'SELECT encounter FROM area_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0].encounter : null;
}

async function getFriendlyNPCsByAreaInstanceId(id) {
  const sql = 'SELECT friendly_npcs FROM area_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0].friendly_npcs : null;
}

module.exports = {
  deleteAreaInstance,
  createAreaInstance,
  getAreaInstanceById,
  getAllAreaInstances,
  getEncounterByAreaInstanceId,
  getFriendlyNPCsByAreaInstanceId
};
