/**
 * ============================================================================
 * Enemy Data Index
 * ============================================================================
 */

export * from './slimes.js';

// Re-export for convenience
import { slimeEnemies, allSlimeEnemies } from './slimes.js';

// Master enemy registry
const allEnemies = {
  ...slimeEnemies,
};

/**
 * Get enemy by ID from all enemies
 * @param {string} id
 * @returns {import('../schemas/enemy.schema.js').EnemyDefinition | null}
 */
export const getEnemyById = (id) => allEnemies[id] ?? null;

/**
 * Get enemies by category
 * @param {string} category
 * @returns {import('../schemas/enemy.schema.js').EnemyDefinition[]}
 */
export const getEnemiesByCategory = (category) =>
  Object.values(allEnemies).filter((enemy) => enemy.category === category);

/**
 * Get enemies that spawn on a specific map
 * @param {string} mapId
 * @returns {import('../schemas/enemy.schema.js').EnemyDefinition[]}
 */
export const getEnemiesByMapId = (mapId) =>
  Object.values(allEnemies).filter((enemy) => enemy.spawnMaps.includes(mapId));

/**
 * Get all enemies
 * @returns {import('../schemas/enemy.schema.js').EnemyDefinition[]}
 */
export const getAllEnemies = () => Object.values(allEnemies);

export { allEnemies };
