const { query } = require('../database');

async function getCharacterInventoryById(characterId) {
  const sql = 'SELECT * FROM character_inventory WHERE character_id = ?';
  const params = [characterId];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const inventory = rows[0];
    inventory.inventory_slots = inventory.inventory_slots.split(',').map(Number);
    return inventory;
  }
  return null;
}

async function updateCharacterInventory(characterId, inventorySlots, gold) {
  const sql = 'UPDATE character_inventory SET inventory_slots = ?, gold = ? WHERE character_id = ?';
  const params = [inventorySlots.join(','), gold, characterId];
  await query(sql, params);
}

async function addItemToInventory(characterId, itemTemplateId) {
  const inventory = await getCharacterInventoryById(characterId);
  if (!inventory) {
    throw new Error('Character inventory not found');
  }

  const emptySlotIndex = inventory.inventory_slots.indexOf(0);
  if (emptySlotIndex === -1) {
    throw new Error('No empty slot available in inventory');
  }

  inventory.inventory_slots[emptySlotIndex] = itemTemplateId;
  await updateCharacterInventory(characterId, inventory.inventory_slots, inventory.gold);
}

async function removeItemFromInventory(characterId, slotIndex) {
  const inventory = await getCharacterInventoryById(characterId);
  if (!inventory) {
    throw new Error('Character inventory not found');
  }

  if (slotIndex < 0 || slotIndex >= inventory.inventory_slots.length) {
    throw new Error('Invalid slot index');
  }

  inventory.inventory_slots[slotIndex] = 0;
  await updateCharacterInventory(characterId, inventory.inventory_slots, inventory.gold);
}

async function moveItemInInventory(characterId, fromSlotIndex, toSlotIndex) {
  const inventory = await getCharacterInventoryById(characterId);
  if (!inventory) {
    throw new Error('Character inventory not found');
  }

  if (fromSlotIndex < 0 || fromSlotIndex >= inventory.inventory_slots.length || toSlotIndex < 0 || toSlotIndex >= inventory.inventory_slots.length) {
    throw new Error('Invalid slot index');
  }

  // Swap the items
  const temp = inventory.inventory_slots[toSlotIndex];
  inventory.inventory_slots[toSlotIndex] = inventory.inventory_slots[fromSlotIndex];
  inventory.inventory_slots[fromSlotIndex] = temp;

  await updateCharacterInventory(characterId, inventory.inventory_slots, inventory.gold);
}

async function addGoldToInventory(characterId, amount) {
  const inventory = await getCharacterInventoryById(characterId);
  if (!inventory) {
    throw new Error('Character inventory not found');
  }

  const newGoldAmount = inventory.gold + amount;
  await updateCharacterInventory(characterId, inventory.inventory_slots, newGoldAmount);
}

async function removeGoldFromInventory(characterId, amount) {
  const inventory = await getCharacterInventoryById(characterId);
  if (!inventory) {
    throw new Error('Character inventory not found');
  }

  if (inventory.gold < amount) {
    throw new Error('Not enough gold in inventory');
  }

  const newGoldAmount = inventory.gold - amount;
  await updateCharacterInventory(characterId, inventory.inventory_slots, newGoldAmount);
}

module.exports = { 
  getCharacterInventoryById, 
  updateCharacterInventory,
  addItemToInventory,
  removeItemFromInventory,
  moveItemInInventory,
  addGoldToInventory,
  removeGoldFromInventory
};
