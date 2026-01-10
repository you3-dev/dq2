/**
 * ============================================================================
 * Item Data Index
 * ============================================================================
 */

export * from './consumables.js';
export * from './weapons.js';
export * from './armor.js';

// Re-export for convenience
import { allConsumables, getConsumableById } from './consumables.js';
import { allWeapons, getWeaponById } from './weapons.js';
import { allArmor, getArmorById } from './armor.js';

// Master item registry
const allItems = {
  ...allConsumables,
  ...allWeapons,
  ...allArmor,
};

/**
 * Get item by ID from all items
 * @param {string} id
 * @returns {import('../schemas/item.schema.js').ItemDefinition | null}
 */
export const getItemById = (id) => allItems[id] ?? null;

/**
 * Get items by category
 * @param {string} category
 * @returns {import('../schemas/item.schema.js').ItemDefinition[]}
 */
export const getItemsByCategory = (category) =>
  Object.values(allItems).filter((item) => item.category === category);

/**
 * Get all buyable items
 * @returns {import('../schemas/item.schema.js').ItemDefinition[]}
 */
export const getBuyableItems = () =>
  Object.values(allItems).filter((item) => item.buyPrice > 0);

/**
 * Get all items
 * @returns {import('../schemas/item.schema.js').ItemDefinition[]}
 */
export const getAllItems = () => Object.values(allItems);

export { allItems };
