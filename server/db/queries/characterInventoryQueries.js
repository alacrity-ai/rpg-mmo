const { query } = require('../database');
const CharacterInventory = require('../../models/CharacterInventory');

async function getCharacterInventoryById(characterId) {
  const sql = 'SELECT * FROM character_inventory WHERE character_id = ?';
  const params = [characterId];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const inventory = rows[0];
    inventory.inventory_slots = inventory.inventory_slots.split(',').map(Number);
    return new CharacterInventory(inventory);
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

  const emptySlotIndex = inventory.inventorySlots.indexOf(0);
  if (emptySlotIndex === -1) {
    throw new Error('No empty slot available in inventory');
  }

  inventory.inventorySlots[emptySlotIndex] = itemTemplateId;
  await updateCharacterInventory(characterId, inventory.inventorySlots, inventory.gold);
}

async function removeItemFromInventory(characterId, slotIndex) {
  const inventory = await getCharacterInventoryById(characterId);
  if (!inventory) {
    throw new Error('Character inventory not found');
  }

  if (slotIndex < 0 || slotIndex >= inventory.inventorySlots.length) {
    throw new Error('Invalid slot index');
  }

  inventory.inventorySlots[slotIndex] = 0;
  await updateCharacterInventory(characterId, inventory.inventorySlots, inventory.gold);
}

async function moveItemInInventory(characterId, fromSlotIndex, toSlotIndex) {
  const inventory = await getCharacterInventoryById(characterId);
  if (!inventory) {
    throw new Error('Character inventory not found');
  }

  if (fromSlotIndex < 0 || fromSlotIndex >= inventory.inventorySlots.length || toSlotIndex < 0 || toSlotIndex >= inventory.inventorySlots.length) {
    throw new Error('Invalid slot index');
  }

  // Swap the items
  const temp = inventory.inventorySlots[toSlotIndex];
  inventory.inventorySlots[toSlotIndex] = inventory.inventorySlots[fromSlotIndex];
  inventory.inventorySlots[fromSlotIndex] = temp;

  await updateCharacterInventory(characterId, inventory.inventorySlots, inventory.gold);
}

async function addGoldToInventory(characterId, amount) {
  const inventory = await getCharacterInventoryById(characterId);
  if (!inventory) {
    throw new Error('Character inventory not found');
  }

  const newGoldAmount = inventory.gold + amount;
  await updateCharacterInventory(characterId, inventory.inventorySlots, newGoldAmount);
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
  await updateCharacterInventory(characterId, inventory.inventorySlots, newGoldAmount);
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
