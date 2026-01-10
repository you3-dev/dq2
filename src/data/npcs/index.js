/**
 * ============================================================================
 * NPC Data Index
 * ============================================================================
 */

export * from './townspeople.js';

// Re-export for convenience
import { startingTownNPCs, allTownNPCs, getNPCById as getTownNPCById } from './townspeople.js';

// Master NPC registry
const allNPCs = {
  ...startingTownNPCs,
};

/**
 * Get NPC by ID from all NPCs
 * @param {string} id
 * @returns {import('../schemas/npc.schema.js').NPCDefinition | null}
 */
export const getNPCById = (id) => allNPCs[id] ?? null;

/**
 * Get all NPCs for a specific map
 * @param {string} mapId
 * @returns {import('../schemas/npc.schema.js').NPCDefinition[]}
 */
export const getNPCsByMapId = (mapId) =>
  Object.values(allNPCs).filter((npc) => npc.defaultMapId === mapId);

/**
 * Get all NPCs
 * @returns {import('../schemas/npc.schema.js').NPCDefinition[]}
 */
export const getAllNPCs = () => Object.values(allNPCs);

export { allNPCs };
