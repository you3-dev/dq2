/**
 * ============================================================================
 * Enemy Schema - Monster/Enemy Definitions
 * ============================================================================
 */

import { ElementType, EnemyBehavior, createVector3 } from './types.js';

/**
 * @typedef {Object} EnemyStats
 * @property {number} hp - Hit points
 * @property {number} mp - Magic points
 * @property {number} attack - Physical attack power
 * @property {number} defense - Physical defense
 * @property {number} agility - Speed/turn order
 * @property {number} wisdom - Magic power
 */

/**
 * @typedef {Object} EnemyAction
 * @property {string} id - Action identifier
 * @property {string} type - 'attack' | 'spell' | 'skill' | 'item' | 'flee'
 * @property {string} [spellId] - Spell ID if type is 'spell'
 * @property {string} [skillId] - Skill ID if type is 'skill'
 * @property {number} weight - Selection weight (higher = more likely)
 * @property {Object} [condition] - Condition for this action
 * @property {string} [condition.type] - 'hp_below' | 'turn' | 'ally_dead' | 'random'
 * @property {number} [condition.value] - Threshold value
 */

/**
 * @typedef {Object} EnemyDropItem
 * @property {string} itemId - Item to drop
 * @property {number} chance - Drop chance (0-100)
 */

/**
 * @typedef {Object} EnemyResistances
 * @property {number} [fire] - Fire resistance (-100 to 100, negative = weakness)
 * @property {number} [ice] - Ice resistance
 * @property {number} [lightning] - Lightning resistance
 * @property {number} [wind] - Wind resistance
 * @property {number} [earth] - Earth resistance
 * @property {number} [light] - Light resistance
 * @property {number} [dark] - Dark resistance
 * @property {number} [physical] - Physical resistance
 */

/**
 * @typedef {Object} EnemyStatusResistances
 * @property {number} [poison] - Poison resistance (0-100)
 * @property {number} [sleep] - Sleep resistance
 * @property {number} [paralysis] - Paralysis resistance
 * @property {number} [confusion] - Confusion resistance
 * @property {number} [silence] - Silence resistance
 * @property {number} [instant_death] - Instant death resistance
 */

/**
 * @typedef {Object} EnemyDefinition
 * @property {string} id - Unique enemy identifier
 * @property {string} name - Display name (Japanese)
 * @property {string} nameEn - Display name (English)
 * @property {string} description - Enemy description
 * @property {string} category - Enemy category (slime, beast, demon, etc.)
 * @property {EnemyStats} stats - Combat statistics
 * @property {number} exp - Experience points awarded
 * @property {number} gold - Gold dropped
 * @property {EnemyDropItem[]} drops - Possible item drops
 * @property {EnemyResistances} resistances - Element resistances
 * @property {EnemyStatusResistances} statusResistances - Status effect resistances
 * @property {keyof typeof EnemyBehavior} behavior - AI behavior pattern
 * @property {EnemyAction[]} actions - Available actions in battle
 * @property {string[]} [spawnMaps] - Maps where this enemy appears
 * @property {Object} [spawnConditions] - Special spawn conditions
 * @property {Object} model - 3D model configuration
 * @property {string} model.path - Path to enemy GLTF model
 * @property {number} [model.scale] - Model scale
 * @property {Object} [model.animations] - Animation mappings
 * @property {Object} [visual] - Visual effects
 * @property {string} [visual.aura] - Aura effect type
 * @property {string} [visual.deathEffect] - Death animation effect
 */

/**
 * Creates a new enemy definition
 * @param {Partial<EnemyDefinition>} config
 * @returns {EnemyDefinition}
 */
export const createEnemyDefinition = (config) => ({
  id: config.id ?? 'unknown_enemy',
  name: config.name ?? '???',
  nameEn: config.nameEn ?? '???',
  description: config.description ?? '',
  category: config.category ?? 'unknown',
  stats: {
    hp: 10,
    mp: 0,
    attack: 5,
    defense: 5,
    agility: 5,
    wisdom: 5,
    ...config.stats,
  },
  exp: config.exp ?? 1,
  gold: config.gold ?? 1,
  drops: config.drops ?? [],
  resistances: config.resistances ?? {},
  statusResistances: config.statusResistances ?? {},
  behavior: config.behavior ?? EnemyBehavior.BALANCED,
  actions: config.actions ?? [
    { id: 'attack', type: 'attack', weight: 100 },
  ],
  spawnMaps: config.spawnMaps ?? [],
  spawnConditions: config.spawnConditions ?? null,
  model: {
    path: config.model?.path ?? 'models/enemies/default.glb',
    scale: config.model?.scale ?? 1,
    animations: config.model?.animations ?? {
      idle: 'Idle',
      attack: 'Attack',
      damage: 'Damage',
      death: 'Death',
    },
  },
  visual: config.visual ?? null,
});

/**
 * Enemy category definitions
 */
export const EnemyCategory = {
  SLIME: 'slime',
  BEAST: 'beast',
  BIRD: 'bird',
  INSECT: 'insect',
  PLANT: 'plant',
  DEMON: 'demon',
  UNDEAD: 'undead',
  DRAGON: 'dragon',
  MACHINE: 'machine',
  MATERIAL: 'material',
  HUMANOID: 'humanoid',
  AQUATIC: 'aquatic',
  BOSS: 'boss',
};
