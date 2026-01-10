/**
 * ============================================================================
 * Character Schema - Player Characters and Party Members
 * ============================================================================
 */

import { JobType, ElementType, createVector3 } from './types.js';

/**
 * @typedef {Object} CharacterStats
 * @property {number} level - Current level (1-99)
 * @property {number} hp - Current HP
 * @property {number} maxHp - Maximum HP
 * @property {number} mp - Current MP
 * @property {number} maxMp - Maximum MP
 * @property {number} attack - Physical attack power
 * @property {number} defense - Physical defense
 * @property {number} agility - Speed/turn order
 * @property {number} wisdom - Magic power
 * @property {number} luck - Critical hit, item drop rate
 * @property {number} exp - Current experience points
 * @property {number} expToNext - EXP needed for next level
 */

/**
 * @typedef {Object} CharacterGrowthRate
 * @property {number} hp - HP gain per level (multiplier)
 * @property {number} mp - MP gain per level (multiplier)
 * @property {number} attack - Attack gain per level
 * @property {number} defense - Defense gain per level
 * @property {number} agility - Agility gain per level
 * @property {number} wisdom - Wisdom gain per level
 */

/**
 * @typedef {Object} CharacterEquipment
 * @property {string|null} weapon - Equipped weapon ID
 * @property {string|null} armor - Equipped armor ID
 * @property {string|null} helmet - Equipped helmet ID
 * @property {string|null} shield - Equipped shield ID
 * @property {string|null} accessory - Equipped accessory ID
 */

/**
 * @typedef {Object} CharacterResistances
 * @property {number} [fire] - Fire resistance (0-100)
 * @property {number} [ice] - Ice resistance (0-100)
 * @property {number} [lightning] - Lightning resistance (0-100)
 * @property {number} [wind] - Wind resistance (0-100)
 * @property {number} [earth] - Earth resistance (0-100)
 * @property {number} [light] - Light resistance (0-100)
 * @property {number} [dark] - Dark resistance (0-100)
 * @property {number} [poison] - Poison resistance (0-100)
 * @property {number} [sleep] - Sleep resistance (0-100)
 * @property {number} [paralysis] - Paralysis resistance (0-100)
 * @property {number} [confusion] - Confusion resistance (0-100)
 * @property {number} [instant_death] - Instant death resistance (0-100)
 */

/**
 * @typedef {Object} LearnableSpell
 * @property {string} spellId - Spell ID to learn
 * @property {number} level - Level at which spell is learned
 */

/**
 * @typedef {Object} CharacterDefinition
 * @property {string} id - Unique character identifier
 * @property {string} name - Display name (Japanese)
 * @property {string} nameEn - Display name (English)
 * @property {string} description - Character description
 * @property {keyof typeof JobType} job - Character class/job
 * @property {CharacterStats} baseStats - Starting stats at level 1
 * @property {CharacterGrowthRate} growthRate - Stats growth per level
 * @property {CharacterResistances} resistances - Element/status resistances
 * @property {LearnableSpell[]} learnableSpells - Spells learned by leveling
 * @property {string[]} equippableWeapons - List of equippable weapon types
 * @property {string[]} equippableArmor - List of equippable armor types
 * @property {Object} model - 3D model configuration
 * @property {string} model.path - Path to character GLTF model
 * @property {string} model.portrait - Path to portrait image
 * @property {Object} model.animations - Animation mappings
 */

/**
 * Creates a new character definition
 * @param {Partial<CharacterDefinition>} config
 * @returns {CharacterDefinition}
 */
export const createCharacterDefinition = (config) => ({
  id: config.id ?? 'unknown',
  name: config.name ?? '???',
  nameEn: config.nameEn ?? '???',
  description: config.description ?? '',
  job: config.job ?? JobType.HERO,
  baseStats: {
    level: 1,
    hp: 15,
    maxHp: 15,
    mp: 0,
    maxMp: 0,
    attack: 5,
    defense: 5,
    agility: 5,
    wisdom: 5,
    luck: 5,
    exp: 0,
    expToNext: 10,
    ...config.baseStats,
  },
  growthRate: {
    hp: 1.0,
    mp: 1.0,
    attack: 1.0,
    defense: 1.0,
    agility: 1.0,
    wisdom: 1.0,
    ...config.growthRate,
  },
  resistances: config.resistances ?? {},
  learnableSpells: config.learnableSpells ?? [],
  equippableWeapons: config.equippableWeapons ?? ['sword'],
  equippableArmor: config.equippableArmor ?? ['armor', 'helmet', 'shield'],
  model: {
    path: config.model?.path ?? 'models/characters/default.glb',
    portrait: config.model?.portrait ?? 'textures/portraits/default.png',
    animations: config.model?.animations ?? {
      idle: 'Idle',
      walk: 'Walk',
      run: 'Run',
      attack: 'Attack',
      cast: 'Cast',
      damage: 'Damage',
      death: 'Death',
      victory: 'Victory',
    },
  },
});

/**
 * Creates character runtime state (for save data)
 * @param {CharacterDefinition} definition
 * @returns {Object}
 */
export const createCharacterState = (definition) => ({
  id: definition.id,
  stats: { ...definition.baseStats },
  equipment: {
    weapon: null,
    armor: null,
    helmet: null,
    shield: null,
    accessory: null,
  },
  learnedSpells: [],
  statusEffects: [],
  isAlive: true,
  inParty: false,
});
