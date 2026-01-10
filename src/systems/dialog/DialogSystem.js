/**
 * ============================================================================
 * Dialog System - Conversation and Interaction Management
 * ============================================================================
 *
 * This system handles:
 * - Dialog tree traversal
 * - Choice selection
 * - Condition evaluation
 * - Action execution (give items, start quests, etc.)
 *
 * ============================================================================
 */

import { getDialogById, getDialogNode, getDialogStartNode } from '../../data/index.js';
import { DialogActionType } from '../../data/schemas/index.js';

/**
 * @typedef {Object} DialogState
 * @property {string} dialogId - Current dialog tree ID
 * @property {string} currentNodeId - Current node ID
 * @property {boolean} isActive - Is dialog currently active
 * @property {Object[]} history - Visited node history
 */

/**
 * Evaluate a dialog condition
 * @param {Object} condition - Condition to evaluate
 * @param {Object} gameState - Current game state
 * @returns {boolean}
 */
export const evaluateCondition = (condition, gameState) => {
  if (!condition) return true;

  const { type, value, amount } = condition;

  switch (type) {
    case 'has_item':
      return gameState.inventory?.some((item) => item.id === value) ?? false;

    case 'has_gold':
      return (gameState.gold ?? 0) >= (amount ?? 0);

    case 'quest_status': {
      const [questId, status] = value.split(':');
      const quest = gameState.quests?.[questId];
      return quest?.status === status;
    }

    case 'flag':
      return gameState.flags?.[value] ?? false;

    case 'party_member':
      return gameState.party?.some((member) => member.id === value) ?? false;

    default:
      return true;
  }
};

/**
 * Get available choices for current node
 * @param {Object} node - Dialog node
 * @param {Object} gameState - Current game state
 * @returns {Object[]} - Available choices
 */
export const getAvailableChoices = (node, gameState) => {
  if (!node.choices) return [];

  return node.choices.filter((choice) =>
    evaluateCondition(choice.condition, gameState)
  );
};

/**
 * DialogSystem class
 */
export class DialogSystem {
  constructor() {
    this.state = null;
    this.onAction = null; // Callback for dialog actions
  }

  /**
   * Start a dialog
   * @param {string} dialogId
   * @param {Object} gameState
   * @returns {Object | null} - First dialog node
   */
  startDialog(dialogId, gameState = {}) {
    const startNode = getDialogStartNode(dialogId, gameState);
    if (!startNode) return null;

    this.state = {
      dialogId,
      currentNodeId: startNode.id,
      isActive: true,
      history: [],
    };

    return startNode;
  }

  /**
   * Advance to next node
   * @param {string} [nextNodeId] - Specific node to go to
   * @returns {Object | null} - Next node or null if dialog ends
   */
  advance(nextNodeId) {
    if (!this.state?.isActive) return null;

    const currentNode = getDialogNode(this.state.dialogId, this.state.currentNodeId);
    if (!currentNode) return null;

    // Add to history
    this.state.history.push(this.state.currentNodeId);

    // Determine next node
    const targetNodeId = nextNodeId ?? currentNode.nextNodeId;

    if (!targetNodeId) {
      // End of dialog
      this.endDialog();
      return null;
    }

    this.state.currentNodeId = targetNodeId;
    return getDialogNode(this.state.dialogId, targetNodeId);
  }

  /**
   * Select a choice
   * @param {string} choiceId
   * @param {Object} gameState
   * @returns {Object | null} - Next node
   */
  selectChoice(choiceId, gameState = {}) {
    if (!this.state?.isActive) return null;

    const currentNode = getDialogNode(this.state.dialogId, this.state.currentNodeId);
    if (!currentNode?.choices) return null;

    const choice = currentNode.choices.find((c) => c.id === choiceId);
    if (!choice) return null;

    // Check condition
    if (!evaluateCondition(choice.condition, gameState)) return null;

    // Execute action if present
    if (choice.action && this.onAction) {
      this.onAction(choice.action);
    }

    // Handle exit action
    if (choice.action?.type === DialogActionType.EXIT) {
      this.endDialog();
      return null;
    }

    // Advance to next node
    return this.advance(choice.nextNodeId);
  }

  /**
   * End current dialog
   */
  endDialog() {
    if (this.state) {
      this.state.isActive = false;
    }
  }

  /**
   * Get current node
   */
  getCurrentNode() {
    if (!this.state?.isActive) return null;
    return getDialogNode(this.state.dialogId, this.state.currentNodeId);
  }

  /**
   * Check if dialog is active
   */
  isActive() {
    return this.state?.isActive ?? false;
  }

  /**
   * Set action handler
   * @param {Function} handler
   */
  setActionHandler(handler) {
    this.onAction = handler;
  }
}

export default DialogSystem;
