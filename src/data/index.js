/**
 * ============================================================================
 * Game Data Index - Central Data Access Point
 * ============================================================================
 *
 * This is the main entry point for all game data.
 * Import from here to access any game data definitions.
 *
 * Example usage:
 *   import { getItemById, getEnemyById, getMapById } from '@/data';
 *
 * ============================================================================
 */

// Schema definitions and types
export * from './schemas/index.js';

// Data modules
export * from './npcs/index.js';
export * from './enemies/index.js';
export * from './items/index.js';
export * from './maps/index.js';
export * from './quests/index.js';
export * from './dialogs/index.js';

// Convenience re-exports for common lookups
import { getNPCById, getNPCsByMapId, getAllNPCs } from './npcs/index.js';
import { getEnemyById, getEnemiesByCategory, getEnemiesByMapId, getAllEnemies } from './enemies/index.js';
import { getItemById, getItemsByCategory, getAllItems } from './items/index.js';
import { getMapById, getMapsByType, getConnectedMapIds, getAllMaps } from './maps/index.js';
import { getQuestById, getQuestsByCategory, getAvailableQuests, getAllQuests } from './quests/index.js';
import { getDialogById, getDialogNode, getDialogStartNode, getAllDialogs } from './dialogs/index.js';

/**
 * Central data access object
 * Provides a unified interface to all game data
 */
export const GameData = {
  // NPCs
  npc: {
    getById: getNPCById,
    getByMap: getNPCsByMapId,
    getAll: getAllNPCs,
  },

  // Enemies
  enemy: {
    getById: getEnemyById,
    getByCategory: getEnemiesByCategory,
    getByMap: getEnemiesByMapId,
    getAll: getAllEnemies,
  },

  // Items
  item: {
    getById: getItemById,
    getByCategory: getItemsByCategory,
    getAll: getAllItems,
  },

  // Maps
  map: {
    getById: getMapById,
    getByType: getMapsByType,
    getConnections: getConnectedMapIds,
    getAll: getAllMaps,
  },

  // Quests
  quest: {
    getById: getQuestById,
    getByCategory: getQuestsByCategory,
    getAvailable: getAvailableQuests,
    getAll: getAllQuests,
  },

  // Dialogs
  dialog: {
    getById: getDialogById,
    getNode: getDialogNode,
    getStartNode: getDialogStartNode,
    getAll: getAllDialogs,
  },
};

export default GameData;
