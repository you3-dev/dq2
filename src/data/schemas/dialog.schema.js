/**
 * ============================================================================
 * Dialog Schema - Conversations and Dialog Trees
 * ============================================================================
 */

import { ExpressionType } from './types.js';

/**
 * @typedef {Object} DialogChoice
 * @property {string} id - Choice identifier
 * @property {string} text - Choice text (Japanese)
 * @property {string} textEn - Choice text (English)
 * @property {string} [nextNodeId] - Next dialog node to go to
 * @property {Object} [action] - Action to perform when selected
 * @property {string} [action.type] - 'give_item' | 'take_item' | 'start_quest' | 'set_flag' | 'open_shop' | 'rest_inn' | 'exit'
 * @property {string} [action.value] - Action parameter
 * @property {number} [action.amount] - Amount for item actions
 * @property {Object} [condition] - Condition to show this choice
 * @property {string} [condition.type] - 'has_item' | 'has_gold' | 'quest_status' | 'flag' | 'party_member'
 * @property {string} [condition.value] - Condition check value
 * @property {number} [condition.amount] - Amount for quantity checks
 */

/**
 * @typedef {Object} DialogNode
 * @property {string} id - Node identifier
 * @property {string} speaker - Speaker name (Japanese, empty for narration)
 * @property {string} speakerEn - Speaker name (English)
 * @property {string} text - Dialog text (Japanese)
 * @property {string} textEn - Dialog text (English)
 * @property {keyof typeof ExpressionType} [expression] - Speaker expression
 * @property {string} [portrait] - Override portrait image
 * @property {string} [voice] - Voice clip ID
 * @property {string} [nextNodeId] - Next node (auto-advance)
 * @property {DialogChoice[]} [choices] - Player choices
 * @property {Object} [action] - Action to perform
 * @property {string} [action.type] - Action type
 * @property {string} [action.value] - Action value
 * @property {Object} [animation] - Character animation
 * @property {string} [animation.target] - Who to animate
 * @property {string} [animation.name] - Animation name
 * @property {Object} [camera] - Camera movement
 * @property {string} [camera.type] - 'focus' | 'pan' | 'shake'
 * @property {Object} [camera.target] - Camera target
 * @property {number} [delay] - Delay before showing (ms)
 * @property {boolean} [waitForInput] - Wait for player input (default: true)
 */

/**
 * @typedef {Object} DialogCondition
 * @property {string} type - Condition type
 * @property {string} value - Check value
 * @property {number} [amount] - Amount for quantity checks
 * @property {string} startNodeId - Node to start from if condition met
 */

/**
 * @typedef {Object} DialogTree
 * @property {string} id - Unique dialog identifier
 * @property {string} description - Dialog description (for developers)
 * @property {string} defaultStartNode - Default starting node
 * @property {DialogCondition[]} [conditionalStarts] - Conditional start nodes
 * @property {DialogNode[]} nodes - All dialog nodes
 */

/**
 * Creates a new dialog tree
 * @param {Partial<DialogTree>} config
 * @returns {DialogTree}
 */
export const createDialogTree = (config) => ({
  id: config.id ?? 'unknown_dialog',
  description: config.description ?? '',
  defaultStartNode: config.defaultStartNode ?? 'start',
  conditionalStarts: config.conditionalStarts ?? [],
  nodes: config.nodes ?? [],
});

/**
 * Creates a simple dialog node
 * @param {string} id - Node ID
 * @param {string} speaker - Speaker name
 * @param {string} text - Japanese text
 * @param {string} textEn - English text
 * @param {string} [nextNodeId] - Next node
 * @returns {DialogNode}
 */
export const createDialogNode = (id, speaker, text, textEn, nextNodeId = null) => ({
  id,
  speaker,
  speakerEn: speaker,
  text,
  textEn,
  nextNodeId,
  expression: ExpressionType.NORMAL,
  waitForInput: true,
});

/**
 * Creates a choice node
 * @param {string} id - Node ID
 * @param {string} speaker - Speaker name
 * @param {string} text - Question text (Japanese)
 * @param {string} textEn - Question text (English)
 * @param {DialogChoice[]} choices - Available choices
 * @returns {DialogNode}
 */
export const createChoiceNode = (id, speaker, text, textEn, choices) => ({
  id,
  speaker,
  speakerEn: speaker,
  text,
  textEn,
  choices,
  expression: ExpressionType.NORMAL,
  waitForInput: true,
});

/**
 * Dialog action types
 */
export const DialogActionType = {
  GIVE_ITEM: 'give_item',
  TAKE_ITEM: 'take_item',
  GIVE_GOLD: 'give_gold',
  TAKE_GOLD: 'take_gold',
  START_QUEST: 'start_quest',
  COMPLETE_QUEST: 'complete_quest',
  SET_FLAG: 'set_flag',
  OPEN_SHOP: 'open_shop',
  REST_INN: 'rest_inn',
  HEAL_PARTY: 'heal_party',
  ADD_PARTY_MEMBER: 'add_party_member',
  REMOVE_PARTY_MEMBER: 'remove_party_member',
  TELEPORT: 'teleport',
  START_BATTLE: 'start_battle',
  EXIT: 'exit',
};
