/**
 * ============================================================================
 * Inventory System - Item and Equipment Management
 * ============================================================================
 *
 * This system handles:
 * - Item storage and organization
 * - Equipment management
 * - Item usage
 * - Shop transactions
 *
 * ============================================================================
 */

import { getItemById } from '../../data/index.js';
import { ItemCategory } from '../../data/schemas/index.js';

/**
 * @typedef {Object} InventoryItem
 * @property {string} itemId - Item definition ID
 * @property {number} count - Stack count
 * @property {number} slot - Inventory slot index
 */

/**
 * @typedef {Object} InventoryState
 * @property {InventoryItem[]} items - All inventory items
 * @property {number} maxSlots - Maximum inventory slots
 * @property {number} gold - Current gold
 */

/**
 * Check if item is stackable
 * @param {string} itemId
 * @returns {boolean}
 */
export const isStackable = (itemId) => {
  const item = getItemById(itemId);
  if (!item) return false;
  return item.consumable || item.category === ItemCategory.MATERIAL;
};

/**
 * Check if item can be equipped
 * @param {string} itemId
 * @returns {boolean}
 */
export const isEquippable = (itemId) => {
  const item = getItemById(itemId);
  if (!item) return false;
  return [
    ItemCategory.WEAPON,
    ItemCategory.ARMOR,
    ItemCategory.HELMET,
    ItemCategory.SHIELD,
    ItemCategory.ACCESSORY,
  ].includes(item.category);
};

/**
 * Get equipment slot for item
 * @param {string} itemId
 * @returns {string | null}
 */
export const getEquipmentSlot = (itemId) => {
  const item = getItemById(itemId);
  if (!item) return null;

  switch (item.category) {
    case ItemCategory.WEAPON:
      return 'weapon';
    case ItemCategory.ARMOR:
      return 'armor';
    case ItemCategory.HELMET:
      return 'helmet';
    case ItemCategory.SHIELD:
      return 'shield';
    case ItemCategory.ACCESSORY:
      return 'accessory';
    default:
      return null;
  }
};

/**
 * InventorySystem class
 */
export class InventorySystem {
  constructor(maxSlots = 50) {
    this.items = [];
    this.maxSlots = maxSlots;
    this.gold = 0;
  }

  /**
   * Add item to inventory
   * @param {string} itemId
   * @param {number} [count=1]
   * @returns {boolean} - Success
   */
  addItem(itemId, count = 1) {
    const itemDef = getItemById(itemId);
    if (!itemDef) return false;

    // Check if stackable and already exists
    if (isStackable(itemId)) {
      const existing = this.items.find((i) => i.itemId === itemId);
      if (existing) {
        existing.count += count;
        return true;
      }
    }

    // Check if inventory is full
    if (this.items.length >= this.maxSlots) {
      return false;
    }

    // Find empty slot
    const usedSlots = new Set(this.items.map((i) => i.slot));
    let slot = 0;
    while (usedSlots.has(slot)) slot++;

    this.items.push({
      itemId,
      count,
      slot,
    });

    return true;
  }

  /**
   * Remove item from inventory
   * @param {string} itemId
   * @param {number} [count=1]
   * @returns {boolean} - Success
   */
  removeItem(itemId, count = 1) {
    const index = this.items.findIndex((i) => i.itemId === itemId);
    if (index === -1) return false;

    const item = this.items[index];
    if (item.count < count) return false;

    item.count -= count;
    if (item.count <= 0) {
      this.items.splice(index, 1);
    }

    return true;
  }

  /**
   * Check if has item
   * @param {string} itemId
   * @param {number} [count=1]
   * @returns {boolean}
   */
  hasItem(itemId, count = 1) {
    const item = this.items.find((i) => i.itemId === itemId);
    return item ? item.count >= count : false;
  }

  /**
   * Get item count
   * @param {string} itemId
   * @returns {number}
   */
  getItemCount(itemId) {
    const item = this.items.find((i) => i.itemId === itemId);
    return item?.count ?? 0;
  }

  /**
   * Use an item
   * @param {string} itemId
   * @param {Object} target - Use target
   * @returns {Object | null} - Effect result
   */
  useItem(itemId, target) {
    const itemDef = getItemById(itemId);
    if (!itemDef || !this.hasItem(itemId)) return null;

    if (itemDef.consumable) {
      this.removeItem(itemId, 1);
    }

    // Return effects for external handling
    return {
      effects: itemDef.effects,
      target,
    };
  }

  /**
   * Add gold
   * @param {number} amount
   */
  addGold(amount) {
    this.gold += amount;
  }

  /**
   * Remove gold
   * @param {number} amount
   * @returns {boolean} - Success
   */
  removeGold(amount) {
    if (this.gold < amount) return false;
    this.gold -= amount;
    return true;
  }

  /**
   * Buy item from shop
   * @param {string} itemId
   * @param {number} [count=1]
   * @param {number} [priceMultiplier=1]
   * @returns {boolean} - Success
   */
  buyItem(itemId, count = 1, priceMultiplier = 1) {
    const itemDef = getItemById(itemId);
    if (!itemDef || itemDef.buyPrice === 0) return false;

    const totalPrice = Math.floor(itemDef.buyPrice * count * priceMultiplier);
    if (!this.removeGold(totalPrice)) return false;

    return this.addItem(itemId, count);
  }

  /**
   * Sell item to shop
   * @param {string} itemId
   * @param {number} [count=1]
   * @returns {boolean} - Success
   */
  sellItem(itemId, count = 1) {
    const itemDef = getItemById(itemId);
    if (!itemDef || itemDef.sellPrice === 0) return false;

    if (!this.hasItem(itemId, count)) return false;

    this.removeItem(itemId, count);
    this.addGold(itemDef.sellPrice * count);

    return true;
  }

  /**
   * Get all items
   */
  getAllItems() {
    return this.items.map((item) => ({
      ...item,
      definition: getItemById(item.itemId),
    }));
  }

  /**
   * Get items by category
   * @param {string} category
   */
  getItemsByCategory(category) {
    return this.items
      .map((item) => ({
        ...item,
        definition: getItemById(item.itemId),
      }))
      .filter((item) => item.definition?.category === category);
  }

  /**
   * Get current gold
   */
  getGold() {
    return this.gold;
  }

  /**
   * Export state for saving
   */
  exportState() {
    return {
      items: this.items,
      gold: this.gold,
    };
  }

  /**
   * Import state from save
   * @param {Object} state
   */
  importState(state) {
    this.items = state.items ?? [];
    this.gold = state.gold ?? 0;
  }
}

export default InventorySystem;
