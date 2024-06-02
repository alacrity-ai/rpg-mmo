const { query } = require('../database');
const BattleInstance = require('../../models/BattleInstance');
const BattlerInstance = require('../../models/BattlerInstance');
const { deleteBattlerInstancesByIds } = require('./battlerInstancesQueries');

async function getBattleInstanceById(id) {
  const sql = 'SELECT * FROM battle_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const battleInstance = new BattleInstance({
      ...rows[0],
      battler_ids: rows[0].battler_ids,
      area_instance_id: rows[0].area_instance_id,
      time_created: rows[0].time_created
    });
    return battleInstance;
  }
  return null;
}

async function getAllBattleInstances() {
  const sql = 'SELECT * FROM battle_instances';
  const rows = await query(sql);
  return rows.map(row => new BattleInstance({
    ...row,
    battler_ids: row.battler_ids,
    area_instance_id: row.area_instance_id,
    time_created: row.time_created
  }));
}

async function createBattleInstance(battleInstanceData) {
    const sql = `
        INSERT INTO battle_instances (
            battler_ids,
            area_instance_id
        ) VALUES (?, ?)
    `;
    const params = [
        JSON.stringify(battleInstanceData.battler_ids) || null,
        battleInstanceData.area_instance_id
    ];
    const result = await query(sql, params);
    const id = result.insertId;

    // Return the newly created BattleInstance object
    return new BattleInstance({
        id,
        battler_ids: battleInstanceData.battler_ids,
        area_instance_id: battleInstanceData.area_instance_id,
        time_created: new Date() // This is fine since it's set by the database, but we need to return it
    });
}

async function updateBattleInstance(id, battleInstanceData) {
  const fields = [
    'battler_ids',
    'area_instance_id',
    'time_created'
  ];

  const updates = [];
  const params = [];

  fields.forEach(field => {
    if (battleInstanceData[field] !== undefined) {
      updates.push(`${field} = ?`);
      if (field === 'battler_ids') {
        params.push(JSON.stringify(battleInstanceData[field]));
      } else {
        params.push(battleInstanceData[field]);
      }
    }
  });

  const sql = `
    UPDATE battle_instances SET
      ${updates.join(', ')}
    WHERE id = ?
  `;
  params.push(id);

  await query(sql, params);
}

async function deleteBattleInstance(id) {
    const battleInstance = await getBattleInstanceById(id);
    if (!battleInstance) {
        throw new Error(`Battle instance with ID ${id} not found.`);
    }

    const battlerIds = battleInstance.battlerIds;
    if (battlerIds && battlerIds.length > 0) {
        await deleteBattlerInstancesByIds(battlerIds);
    }

    const sql = 'DELETE FROM battle_instances WHERE id = ?';
    const params = [id];
    await query(sql, params);
}

async function getBattlerInstancesInBattle(battleId) {
    const sql = `
      SELECT bi.*
      FROM battler_instances bi
      JOIN battle_instances b ON JSON_CONTAINS(b.battler_ids, CAST(bi.id AS JSON), '$')
      WHERE b.id = ?
    `;
    const params = [battleId];
    const rows = await query(sql, params);
    return rows.map(row => new BattlerInstance({
      id: row.id,
      character_id: row.character_id,
      npc_template_id: row.npc_template_id,
      base_stats: row.base_stats,
      current_stats: row.current_stats,
      abilities: row.abilities,
      script_path: row.script_path,
      sprite_path: row.sprite_path,
      grid_position: row.grid_position,
      last_action_time: row.last_action_time,
      time_created: row.time_created,
      status_effects: row.status_effects,
      team: row.team
    }));
  }
  

module.exports = {
  getBattlerInstancesInBattle,
  getBattleInstanceById,
  getAllBattleInstances,
  createBattleInstance,
  updateBattleInstance,
  deleteBattleInstance
};
