/**
 * ============================================================================
 * NPC Schema - Non-Player Characters
 * ============================================================================
 */

import { NPCType, createVector3 } from './types.js';

/**
 * @typedef {Object} NPCScheduleEntry
 * @property {number} startHour - Start hour (0-23)
 * @property {number} endHour - End hour (0-23)
 * @property {string} mapId - Map where NPC is located
 * @property {import('./types.js').Vector3} position - Position on map
 * @property {string} [activity] - What NPC is doing (idle, walking, working)
 * @property {string} [dialogId] - Override dialog during this time
 */

/**
 * @typedef {Object} NPCShopInventory
 * @property {string} itemId - Item ID
 * @property {number} [stock] - Stock count (-1 = unlimited)
 * @property {number} [priceMultiplier] - Price multiplier (1.0 = normal)
 */

/**
 * @typedef {Object} NPCInnService
 * @property {number} pricePerPerson - Price per party member
 * @property {boolean} [fullRestore] - Full HP/MP restoration
 * @property {boolean} [cureStatus] - Cure all status effects
 * @property {boolean} [saveGame] - Allow saving at inn
 */

/**
 * @typedef {Object} NPCDefinition
 * @property {string} id - Unique NPC identifier
 * @property {string} name - Display name (Japanese)
 * @property {string} nameEn - Display name (English)
 * @property {keyof typeof NPCType} type - NPC type
 * @property {string} defaultMapId - Default map location
 * @property {import('./types.js').Vector3} defaultPosition - Default position
 * @property {number} [defaultRotation] - Default Y rotation in degrees
 * @property {string} dialogId - Default dialog tree ID
 * @property {NPCScheduleEntry[]} [schedule] - Time-based schedule
 * @property {boolean} [canMove] - Whether NPC moves around
 * @property {import('./types.js').Vector3[]} [patrolPath] - Patrol waypoints
 * @property {NPCShopInventory[]} [shopInventory] - Items for sale (merchants)
 * @property {NPCInnService} [innService] - Inn service config (innkeepers)
 * @property {string[]} [questIds] - Related quest IDs
 * @property {Object} [conditions] - Visibility/behavior conditions
 * @property {string} [conditions.requiredQuest] - Quest required to appear
 * @property {string} [conditions.requiredItem] - Item required to appear
 * @property {string} [conditions.requiredFlag] - Game flag required
 * @property {Object} model - 3D model configuration
 * @property {string} model.path - Path to NPC GLTF model
 * @property {number} [model.scale] - Model scale
 * @property {Object} [model.animations] - Animation mappings
 * @property {string} [portrait] - Portrait image path
 */

/**
 * Creates a new NPC definition
 * @param {Partial<NPCDefinition>} config
 * @returns {NPCDefinition}
 */
export const createNPCDefinition = (config) => ({
  id: config.id ?? 'unknown_npc',
  name: config.name ?? '???',
  nameEn: config.nameEn ?? '???',
  type: config.type ?? NPCType.VILLAGER,
  defaultMapId: config.defaultMapId ?? 'town_start',
  defaultPosition: config.defaultPosition ?? createVector3(),
  defaultRotation: config.defaultRotation ?? 0,
  dialogId: config.dialogId ?? 'default_dialog',
  schedule: config.schedule ?? null,
  canMove: config.canMove ?? false,
  patrolPath: config.patrolPath ?? null,
  shopInventory: config.shopInventory ?? null,
  innService: config.innService ?? null,
  questIds: config.questIds ?? [],
  conditions: config.conditions ?? null,
  // 3Dモデル情報 (既存のNPC.jsxが props.modelPath / props.scale を期待しているため、トップレベルにも配置)
  modelPath: config.modelPath ?? config.model?.path ?? 'characters/Casual_Male.gltf',
  scale: config.scale ?? config.model?.scale ?? 1,
  // 互換性のためのmodelオブジェクト
  model: {
    path: config.modelPath ?? config.model?.path ?? 'characters/Casual_Male.gltf',
    scale: config.scale ?? config.model?.scale ?? 1,
    animations: config.model?.animations ?? {
      idle: 'Idle',
      walk: 'Walk',
      talk: 'Talk',
    },
  },
  portrait: config.portrait ?? null,
});

/**
 * Creates a merchant NPC
 * @param {Partial<NPCDefinition> & {shopInventory: NPCShopInventory[]}} config
 * @returns {NPCDefinition}
 */
export const createMerchant = (config) =>
  createNPCDefinition({
    ...config,
    type: NPCType.MERCHANT,
  });

/**
 * Creates an innkeeper NPC
 * @param {Partial<NPCDefinition> & {innService: NPCInnService}} config
 * @returns {NPCDefinition}
 */
export const createInnkeeper = (config) =>
  createNPCDefinition({
    ...config,
    type: NPCType.INNKEEPER,
  });
