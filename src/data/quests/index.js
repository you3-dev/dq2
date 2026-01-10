/**
 * ============================================================================
 * Quest Data Index
 * ============================================================================
 */

export * from './main_quests.js';

// Re-export for convenience
import { mainQuests, allMainQuests, getMainQuestById, getQuestsByChapter } from './main_quests.js';

// Master quest registry
const allQuests = {
  ...mainQuests,
};

/**
 * Get quest by ID from all quests
 * @param {string} id
 * @returns {import('../schemas/quest.schema.js').QuestDefinition | null}
 */
export const getQuestById = (id) => allQuests[id] ?? null;

/**
 * Get quests by category
 * @param {string} category
 * @returns {import('../schemas/quest.schema.js').QuestDefinition[]}
 */
export const getQuestsByCategory = (category) =>
  Object.values(allQuests).filter((quest) => quest.category === category);

/**
 * Get available quests based on completed quests
 * @param {string[]} completedQuestIds
 * @returns {import('../schemas/quest.schema.js').QuestDefinition[]}
 */
export const getAvailableQuests = (completedQuestIds) =>
  Object.values(allQuests).filter((quest) => {
    if (!quest.requirements?.requiredQuests) return true;
    return quest.requirements.requiredQuests.every((id) =>
      completedQuestIds.includes(id)
    );
  });

/**
 * Get all quests
 * @returns {import('../schemas/quest.schema.js').QuestDefinition[]}
 */
export const getAllQuests = () => Object.values(allQuests);

export { allQuests, getQuestsByChapter };
