/**
 * ============================================================================
 * Quest System - Quest Tracking and Progression
 * ============================================================================
 *
 * This system handles:
 * - Quest state management
 * - Objective tracking
 * - Reward distribution
 * - Quest prerequisites checking
 *
 * ============================================================================
 */

import { getQuestById, getAvailableQuests } from '../../data/index.js';
import { QuestStatus } from '../../data/schemas/index.js';

/**
 * @typedef {Object} QuestState
 * @property {string} questId - Quest definition ID
 * @property {keyof typeof QuestStatus} status - Current quest status
 * @property {Object.<string, ObjectiveState>} objectives - Objective states by ID
 * @property {number} startedAt - Timestamp when quest started
 * @property {number} [completedAt] - Timestamp when quest completed
 */

/**
 * @typedef {Object} ObjectiveState
 * @property {boolean} completed - Is objective complete
 * @property {number} [currentCount] - Current progress count
 * @property {boolean} [revealed] - Is hidden objective revealed
 */

/**
 * Create initial quest state from definition
 * @param {string} questId
 * @returns {QuestState | null}
 */
export const createQuestState = (questId) => {
  const definition = getQuestById(questId);
  if (!definition) return null;

  const objectives = {};
  for (const obj of definition.objectives) {
    objectives[obj.id] = {
      completed: false,
      currentCount: obj.targetCount ? 0 : undefined,
      revealed: !obj.hidden,
    };
  }

  return {
    questId,
    status: QuestStatus.IN_PROGRESS,
    objectives,
    startedAt: Date.now(),
  };
};

/**
 * Check if quest requirements are met
 * @param {string} questId
 * @param {Object} gameState - Current game state
 * @returns {boolean}
 */
export const checkQuestRequirements = (questId, gameState) => {
  const definition = getQuestById(questId);
  if (!definition || !definition.requirements) return true;

  const { minLevel, requiredQuests, requiredItems, requiredFlags } = definition.requirements;

  // Check level
  if (minLevel && gameState.partyLevel < minLevel) return false;

  // Check required quests
  if (requiredQuests) {
    const completed = gameState.completedQuests ?? [];
    if (!requiredQuests.every((q) => completed.includes(q))) return false;
  }

  // Check required items
  if (requiredItems) {
    const inventory = gameState.inventory ?? [];
    if (!requiredItems.every((item) => inventory.some((i) => i.id === item))) return false;
  }

  // Check flags
  if (requiredFlags) {
    const flags = gameState.flags ?? {};
    if (!requiredFlags.every((f) => flags[f])) return false;
  }

  return true;
};

/**
 * Update objective progress
 * @param {QuestState} questState
 * @param {string} objectiveId
 * @param {number} [amount=1] - Amount to add (for count-based objectives)
 * @returns {QuestState} - Updated state
 */
export const updateObjectiveProgress = (questState, objectiveId, amount = 1) => {
  const definition = getQuestById(questState.questId);
  if (!definition) return questState;

  const objectiveDef = definition.objectives.find((o) => o.id === objectiveId);
  if (!objectiveDef) return questState;

  const newState = { ...questState, objectives: { ...questState.objectives } };
  const objState = { ...newState.objectives[objectiveId] };

  if (objectiveDef.targetCount) {
    objState.currentCount = Math.min(
      (objState.currentCount ?? 0) + amount,
      objectiveDef.targetCount
    );
    objState.completed = objState.currentCount >= objectiveDef.targetCount;
  } else {
    objState.completed = true;
  }

  newState.objectives[objectiveId] = objState;

  // Check if all required objectives are complete
  const allComplete = definition.objectives
    .filter((o) => !o.optional)
    .every((o) => newState.objectives[o.id]?.completed);

  if (allComplete) {
    newState.status = QuestStatus.COMPLETED;
    newState.completedAt = Date.now();
  }

  return newState;
};

/**
 * QuestSystem class placeholder
 * TODO: Implement full quest system
 */
export class QuestSystem {
  constructor() {
    this.activeQuests = new Map();
    this.completedQuests = new Set();
  }

  /**
   * Start a quest
   * @param {string} questId
   * @returns {QuestState | null}
   */
  startQuest(questId) {
    if (this.activeQuests.has(questId) || this.completedQuests.has(questId)) {
      return null;
    }

    const state = createQuestState(questId);
    if (state) {
      this.activeQuests.set(questId, state);
    }
    return state;
  }

  /**
   * Update quest objective
   * @param {string} questId
   * @param {string} objectiveId
   * @param {number} [amount]
   */
  updateObjective(questId, objectiveId, amount) {
    const state = this.activeQuests.get(questId);
    if (!state) return null;

    const newState = updateObjectiveProgress(state, objectiveId, amount);
    this.activeQuests.set(questId, newState);

    if (newState.status === QuestStatus.COMPLETED) {
      this.completeQuest(questId);
    }

    return newState;
  }

  /**
   * Complete a quest
   * @param {string} questId
   */
  completeQuest(questId) {
    this.activeQuests.delete(questId);
    this.completedQuests.add(questId);
    // TODO: Distribute rewards
  }

  /**
   * Get active quests
   */
  getActiveQuests() {
    return Array.from(this.activeQuests.values());
  }

  /**
   * Get completed quest IDs
   */
  getCompletedQuestIds() {
    return Array.from(this.completedQuests);
  }
}

export default QuestSystem;
