/**
 * ============================================================================
 * Dialog Data Index
 * ============================================================================
 */

export * from './npc_dialogs.js';

// Re-export for convenience
import {
  allDialogs,
  elderThomasDialogs,
  shopDialogs,
  hintDialogs,
  getDialogById as getNPCDialogById,
} from './npc_dialogs.js';

// Master dialog registry
const dialogRegistry = {
  ...allDialogs,
};

/**
 * Get dialog tree by ID
 * @param {string} id
 * @returns {import('../schemas/dialog.schema.js').DialogTree | null}
 */
export const getDialogById = (id) => dialogRegistry[id] ?? null;

/**
 * Get dialog node by dialog ID and node ID
 * @param {string} dialogId
 * @param {string} nodeId
 * @returns {import('../schemas/dialog.schema.js').DialogNode | null}
 */
export const getDialogNode = (dialogId, nodeId) => {
  const dialog = dialogRegistry[dialogId];
  if (!dialog) return null;
  return dialog.nodes.find((node) => node.id === nodeId) ?? null;
};

/**
 * Get starting node for a dialog based on conditions
 * @param {string} dialogId
 * @param {Object} gameState - Current game state for condition checking
 * @returns {import('../schemas/dialog.schema.js').DialogNode | null}
 */
export const getDialogStartNode = (dialogId, gameState = {}) => {
  const dialog = dialogRegistry[dialogId];
  if (!dialog) return null;

  // Check conditional starts
  for (const condition of dialog.conditionalStarts ?? []) {
    // TODO: Implement condition checking based on gameState
    // For now, return default
  }

  return dialog.nodes.find((node) => node.id === dialog.defaultStartNode) ?? null;
};

/**
 * Get all dialogs
 * @returns {import('../schemas/dialog.schema.js').DialogTree[]}
 */
export const getAllDialogs = () => Object.values(dialogRegistry);

export { dialogRegistry };
