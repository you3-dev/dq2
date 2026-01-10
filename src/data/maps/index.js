/**
 * ============================================================================
 * Map Data Index
 * ============================================================================
 */

export * from './starting_area.js';

// Re-export for convenience
import { startingAreaMaps, getMapById as getStartingMapById } from './starting_area.js';

// Master map registry
const allMaps = {
  ...startingAreaMaps,
};

/**
 * Get map by ID from all maps
 * @param {string} id
 * @returns {import('../schemas/map.schema.js').MapDefinition | null}
 */
export const getMapById = (id) => allMaps[id] ?? null;

/**
 * Get maps by type
 * @param {string} type
 * @returns {import('../schemas/map.schema.js').MapDefinition[]}
 */
export const getMapsByType = (type) =>
  Object.values(allMaps).filter((map) => map.type === type);

/**
 * Get connected maps for a given map
 * @param {string} mapId
 * @returns {string[]} - Array of connected map IDs
 */
export const getConnectedMapIds = (mapId) => {
  const map = allMaps[mapId];
  if (!map) return [];
  return Object.values(map.connections).map((conn) => conn.targetMapId);
};

/**
 * Get all maps
 * @returns {import('../schemas/map.schema.js').MapDefinition[]}
 */
export const getAllMaps = () => Object.values(allMaps);

export { allMaps };
