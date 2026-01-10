/**
 * ============================================================================
 * Item Schema - Items, Equipment, and Consumables
 * ============================================================================
 */

import { ItemCategory, WeaponType, ElementType } from './types.js';

/**
 * @typedef {Object} ItemEffect
 * @property {string} type - Effect type (heal_hp, heal_mp, buff, cure_status, damage, etc.)
 * @property {number} [value] - Effect value
 * @property {number} [percentage] - Percentage-based effect
 * @property {string} [status] - Status to cure/inflict
 * @property {string} [stat] - Stat to buff/debuff
 * @property {number} [duration] - Effect duration in turns
 * @property {keyof typeof ElementType} [element] - Element type for damage
 */

/**
 * @typedef {Object} EquipmentStats
 * @property {number} [attack] - Attack bonus
 * @property {number} [defense] - Defense bonus
 * @property {number} [agility] - Agility bonus
 * @property {number} [wisdom] - Wisdom bonus
 * @property {number} [maxHp] - Max HP bonus
 * @property {number} [maxMp] - Max MP bonus
 * @property {number} [luck] - Luck bonus
 */

/**
 * @typedef {Object} EquipmentResistances
 * @property {number} [fire] - Fire resistance (0-100)
 * @property {number} [ice] - Ice resistance
 * @property {number} [lightning] - Lightning resistance
 * @property {number} [sleep] - Sleep resistance
 * @property {number} [poison] - Poison resistance
 * @property {number} [instant_death] - Instant death resistance
 */

/**
 * @typedef {Object} ItemDefinition
 * @property {string} id - Unique item identifier
 * @property {string} name - Display name (Japanese)
 * @property {string} nameEn - Display name (English)
 * @property {string} description - Item description
 * @property {keyof typeof ItemCategory} category - Item category
 * @property {keyof typeof WeaponType} [weaponType] - Weapon type (if weapon)
 * @property {number} buyPrice - Shop buy price (0 = cannot buy)
 * @property {number} sellPrice - Shop sell price (0 = cannot sell)
 * @property {boolean} [canUseInBattle] - Can be used in battle
 * @property {boolean} [canUseInField] - Can be used outside battle
 * @property {boolean} [consumable] - Is consumed on use
 * @property {boolean} [cursed] - Is a cursed item
 * @property {ItemEffect[]} [effects] - Item use effects
 * @property {EquipmentStats} [equipStats] - Equipment stat bonuses
 * @property {EquipmentResistances} [equipResistances] - Equipment resistances
 * @property {string[]} [equippableBy] - Character IDs that can equip
 * @property {string[]} [equippableJobs] - Job types that can equip
 * @property {Object} [special] - Special properties
 * @property {boolean} [special.autoRevive] - Auto-revive once
 * @property {boolean} [special.preventEncounter] - Reduces random encounters
 * @property {boolean} [special.doubleGold] - Doubles gold earned
 * @property {boolean} [special.doubleExp] - Doubles exp earned
 * @property {string} [model] - 3D model path for world display
 * @property {string} icon - Icon path for UI
 */

/**
 * Creates a new item definition
 * @param {Partial<ItemDefinition>} config
 * @returns {ItemDefinition}
 */
export const createItemDefinition = (config) => ({
  id: config.id ?? 'unknown_item',
  name: config.name ?? '???',
  nameEn: config.nameEn ?? '???',
  description: config.description ?? '',
  category: config.category ?? ItemCategory.CONSUMABLE,
  weaponType: config.weaponType ?? null,
  buyPrice: config.buyPrice ?? 0,
  sellPrice: config.sellPrice ?? Math.floor((config.buyPrice ?? 0) / 2),
  canUseInBattle: config.canUseInBattle ?? false,
  canUseInField: config.canUseInField ?? false,
  consumable: config.consumable ?? true,
  cursed: config.cursed ?? false,
  effects: config.effects ?? [],
  equipStats: config.equipStats ?? null,
  equipResistances: config.equipResistances ?? null,
  equippableBy: config.equippableBy ?? null,
  equippableJobs: config.equippableJobs ?? null,
  special: config.special ?? null,
  model: config.model ?? null,
  icon: config.icon ?? 'textures/ui/items/default.png',
});

/**
 * Creates a weapon definition (shorthand)
 * @param {Partial<ItemDefinition> & {attack: number}} config
 * @returns {ItemDefinition}
 */
export const createWeapon = (config) =>
  createItemDefinition({
    ...config,
    category: ItemCategory.WEAPON,
    consumable: false,
    equipStats: {
      attack: config.attack ?? 0,
      ...config.equipStats,
    },
  });

/**
 * Creates an armor definition (shorthand)
 * @param {Partial<ItemDefinition> & {defense: number}} config
 * @returns {ItemDefinition}
 */
export const createArmor = (config) =>
  createItemDefinition({
    ...config,
    category: ItemCategory.ARMOR,
    consumable: false,
    equipStats: {
      defense: config.defense ?? 0,
      ...config.equipStats,
    },
  });

/**
 * Creates a consumable item (shorthand)
 * @param {Partial<ItemDefinition>} config
 * @returns {ItemDefinition}
 */
export const createConsumable = (config) =>
  createItemDefinition({
    ...config,
    category: ItemCategory.CONSUMABLE,
    consumable: true,
    canUseInBattle: config.canUseInBattle ?? true,
    canUseInField: config.canUseInField ?? true,
  });
