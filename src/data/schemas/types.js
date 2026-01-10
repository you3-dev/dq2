/**
 * ============================================================================
 * DQ-Style 3D RPG Game - Core Type Definitions
 * ============================================================================
 * This file contains all core type definitions for the game.
 * Using JSDoc for type safety and IDE autocompletion.
 * ============================================================================
 */

// ============================================================================
// Enums / Constants
// ============================================================================

/** @enum {string} Element types for magic and resistances */
export const ElementType = {
  NONE: 'none',
  FIRE: 'fire',
  ICE: 'ice',
  LIGHTNING: 'lightning',
  WIND: 'wind',
  EARTH: 'earth',
  LIGHT: 'light',
  DARK: 'dark',
};

/** @enum {string} Character job/class types */
export const JobType = {
  HERO: 'hero',
  WARRIOR: 'warrior',
  MAGE: 'mage',
  PRIEST: 'priest',
  MARTIAL_ARTIST: 'martial_artist',
  THIEF: 'thief',
  MERCHANT: 'merchant',
  SAGE: 'sage',
};

/** @enum {string} Item categories */
export const ItemCategory = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  HELMET: 'helmet',
  SHIELD: 'shield',
  ACCESSORY: 'accessory',
  CONSUMABLE: 'consumable',
  KEY_ITEM: 'key_item',
  MATERIAL: 'material',
};

/** @enum {string} Weapon types */
export const WeaponType = {
  SWORD: 'sword',
  AXE: 'axe',
  SPEAR: 'spear',
  STAFF: 'staff',
  WHIP: 'whip',
  CLAW: 'claw',
  BOW: 'bow',
  BOOMERANG: 'boomerang',
};

/** @enum {string} Enemy behavior patterns */
export const EnemyBehavior = {
  AGGRESSIVE: 'aggressive',      // Always attacks
  DEFENSIVE: 'defensive',        // Uses defense/healing
  MAGIC_USER: 'magic_user',      // Prefers magic
  SUPPORT: 'support',            // Buffs allies
  BALANCED: 'balanced',          // Mixed actions
  RANDOM: 'random',              // Unpredictable
};

/** @enum {string} NPC types */
export const NPCType = {
  VILLAGER: 'villager',
  MERCHANT: 'merchant',
  INNKEEPER: 'innkeeper',
  GUARD: 'guard',
  SAGE: 'sage',
  KING: 'king',
  QUEST_GIVER: 'quest_giver',
};

/** @enum {string} Quest states */
export const QuestStatus = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

/** @enum {string} Quest objective types */
export const QuestObjectiveType = {
  TALK: 'talk',
  DEFEAT: 'defeat',
  COLLECT: 'collect',
  DELIVER: 'deliver',
  EXPLORE: 'explore',
  ESCORT: 'escort',
};

/** @enum {string} Map/area types */
export const MapType = {
  FIELD: 'field',
  TOWN: 'town',
  DUNGEON: 'dungeon',
  CASTLE: 'castle',
  CAVE: 'cave',
  TOWER: 'tower',
  SHRINE: 'shrine',
};

/** @enum {string} Weather types */
export const WeatherType = {
  CLEAR: 'clear',
  CLOUDY: 'cloudy',
  RAIN: 'rain',
  STORM: 'storm',
  SNOW: 'snow',
  FOG: 'fog',
};

/** @enum {string} Dialog expression types */
export const ExpressionType = {
  NORMAL: 'normal',
  HAPPY: 'happy',
  SAD: 'sad',
  ANGRY: 'angry',
  SURPRISED: 'surprised',
  THINKING: 'thinking',
};

// ============================================================================
// Base Types (JSDoc Type Definitions)
// ============================================================================

/**
 * @typedef {Object} Vector3
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number} z - Z coordinate
 */

/**
 * @typedef {Object} Transform
 * @property {Vector3} position - World position
 * @property {Vector3} [rotation] - Rotation in radians (default: {x:0, y:0, z:0})
 * @property {Vector3} [scale] - Scale factors (default: {x:1, y:1, z:1})
 */

/**
 * @typedef {Object} BoundingBox
 * @property {Vector3} min - Minimum corner
 * @property {Vector3} max - Maximum corner
 */

/**
 * @typedef {Object} ModelReference
 * @property {string} path - Path to GLTF model (relative to public/)
 * @property {string} [animation] - Default animation name
 * @property {number} [scale] - Model scale override
 */

// ============================================================================
// Export type factories for runtime validation
// ============================================================================

/**
 * Creates a default Vector3
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [z=0]
 * @returns {Vector3}
 */
export const createVector3 = (x = 0, y = 0, z = 0) => ({ x, y, z });

/**
 * Creates a default Transform
 * @param {Vector3} [position]
 * @param {Vector3} [rotation]
 * @param {Vector3} [scale]
 * @returns {Transform}
 */
export const createTransform = (
  position = createVector3(),
  rotation = createVector3(),
  scale = createVector3(1, 1, 1)
) => ({ position, rotation, scale });
