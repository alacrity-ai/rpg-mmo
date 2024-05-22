// db/queries/utility/cleanup.js

const { query } = require('../../database');

async function cleanupOldAreaInstances(days) {
  const sql = 'DELETE FROM area_instances WHERE created_at < NOW() - INTERVAL ? DAY';
  const params = [days];
  const result = await query(sql, params);
  return result.affectedRows;
}

async function cleanupOldZoneInstances(days) {
  const sql = 'DELETE FROM zone_instances WHERE created_at < NOW() - INTERVAL ? DAY';
  const params = [days];
  const result = await query(sql, params);
  return result.affectedRows;
}

module.exports = {
  cleanupOldAreaInstances,
  cleanupOldZoneInstances
};
