const { query } = require('../database');
const { getCharacterInventoryById, updateCharacterInventory } = require('./characterInventoryQueries');

async function getCharacterEquipmentById(characterId) {
  const sql = 'SELECT * FROM character_equipment WHERE character_id = ?';
  const params = [characterId];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

async function equipItem(characterId, itemTemplateId) {
  const equipmentSlots = ['main_hand', 'off_hand', 'two_hand', 'ammo', 'head', 'chest', 'hands', 'waist', 'feet', 'ring1', 'ring2', 'neck'];
  const inventory = await getCharacterInventoryById(characterId);

  // Check if item is in the inventory
  const itemIndex = inventory.inventory_slots.indexOf(itemTemplateId);
  if (itemIndex === -1) {
    throw new Error('Item not found in inventory');
  }

  // Get item details to determine the slot
  const itemDetailsSql = 'SELECT * FROM item_templates WHERE id = ?';
  const itemDetailsParams = [itemTemplateId];
  const itemDetailsRows = await query(itemDetailsSql, itemDetailsParams);

  if (itemDetailsRows.length === 0) {
    throw new Error('Item template not found');
  }

  const item = itemDetailsRows[0];
  const slot = item.equipment_type;

  if (!equipmentSlots.includes(slot)) {
    throw new Error('Invalid equipment slot');
  }

  // Get current equipment
  const currentEquipment = await getCharacterEquipmentById(characterId);
  const currentlyEquippedItem = currentEquipment[slot];

  // Swap items if something is already equipped in the same slot
  if (currentlyEquippedItem) {
    inventory.inventory_slots[itemIndex] = currentlyEquippedItem;
  } else {
    // Remove item from inventory
    inventory.inventory_slots[itemIndex] = 0;
  }

  // Update character equipment
  const equipSql = `UPDATE character_equipment SET ${slot} = ? WHERE character_id = ?`;
  const equipParams = [itemTemplateId, characterId];
  await query(equipSql, equipParams);

  // Update inventory slots
  await updateCharacterInventory(characterId, inventory.inventory_slots, inventory.gold);
}

async function unequipItem(characterId, slot) {
  const equipment = await getCharacterEquipmentById(characterId);

  if (!equipment || !equipment[slot]) {
    throw new Error('No item equipped in the specified slot');
  }

  const itemTemplateId = equipment[slot];

  // Update character equipment
  const unequipSql = `UPDATE character_equipment SET ${slot} = NULL WHERE character_id = ?`;
  const unequipParams = [characterId];
  await query(unequipSql, unequipParams);

  // Add item back to inventory
  const inventory = await getCharacterInventoryById(characterId);
  const emptySlotIndex = inventory.inventory_slots.indexOf(0);
  if (emptySlotIndex === -1) {
    throw new Error('No empty slot available in inventory');
  }

  inventory.inventory_slots[emptySlotIndex] = itemTemplateId;
  await updateCharacterInventory(characterId, inventory.inventory_slots, inventory.gold);
}

module.exports = { getCharacterEquipmentById, equipItem, unequipItem };
