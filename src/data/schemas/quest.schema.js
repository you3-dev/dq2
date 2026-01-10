/**
 * ============================================================================
 * Quest Schema - Quests and Objectives
 * ============================================================================
 */

import { QuestStatus, QuestObjectiveType } from './types.js';

/**
 * @typedef {Object} QuestObjective
 * @property {string} id - Objective identifier
 * @property {keyof typeof QuestObjectiveType} type - Objective type
 * @property {string} description - Objective description (Japanese)
 * @property {string} descriptionEn - Objective description (English)
 * @property {boolean} [hidden] - Hidden until revealed
 * @property {boolean} [optional] - Optional objective
 * @property {string} [targetId] - Target NPC/enemy/item/map ID
 * @property {number} [targetCount] - Required count (for defeat/collect)
 * @property {number} [currentCount] - Current progress (runtime)
 * @property {boolean} [completed] - Is completed (runtime)
 */

/**
 * @typedef {Object} QuestReward
 * @property {number} [exp] - Experience points
 * @property {number} [gold] - Gold
 * @property {Object[]} [items] - Item rewards
 * @property {string} items[].itemId - Item ID
 * @property {number} items[].count - Item count
 * @property {string} [unlockQuest] - Quest ID to unlock
 * @property {string} [unlockMap] - Map ID to unlock
 * @property {string} [setFlag] - Game flag to set
 */

/**
 * @typedef {Object} QuestRequirement
 * @property {number} [minLevel] - Minimum party level
 * @property {string[]} [requiredQuests] - Quest IDs that must be completed
 * @property {string[]} [requiredItems] - Items that must be in inventory
 * @property {string[]} [requiredPartyMembers] - Characters required in party
 * @property {string[]} [requiredFlags] - Game flags that must be set
 */

/**
 * @typedef {Object} QuestDialogTrigger
 * @property {string} npcId - NPC that triggers dialog
 * @property {string} dialogId - Dialog tree to show
 * @property {string} [afterObjective] - Show after this objective completes
 */

/**
 * @typedef {Object} QuestDefinition
 * @property {string} id - Unique quest identifier
 * @property {string} name - Quest name (Japanese)
 * @property {string} nameEn - Quest name (English)
 * @property {string} description - Quest description (Japanese)
 * @property {string} descriptionEn - Quest description (English)
 * @property {string} category - Quest category (main, side, guild, etc.)
 * @property {number} [chapter] - Story chapter (for main quests)
 * @property {QuestRequirement} [requirements] - Requirements to start quest
 * @property {QuestObjective[]} objectives - Quest objectives
 * @property {QuestReward} rewards - Quest completion rewards
 * @property {QuestDialogTrigger[]} [dialogTriggers] - NPC dialog overrides
 * @property {Object} [events] - Event hooks
 * @property {string} [events.onStart] - Event when quest starts
 * @property {string} [events.onComplete] - Event when quest completes
 * @property {string} [events.onFail] - Event when quest fails
 * @property {boolean} [repeatable] - Can be done multiple times
 * @property {number} [timeLimit] - Time limit in game minutes (0 = none)
 * @property {string} [failQuest] - Quest ID that causes this to fail
 */

/**
 * Creates a new quest definition
 * @param {Partial<QuestDefinition>} config
 * @returns {QuestDefinition}
 */
export const createQuestDefinition = (config) => ({
  id: config.id ?? 'unknown_quest',
  name: config.name ?? '???',
  nameEn: config.nameEn ?? '???',
  description: config.description ?? '',
  descriptionEn: config.descriptionEn ?? '',
  category: config.category ?? 'side',
  chapter: config.chapter ?? null,
  requirements: config.requirements ?? null,
  objectives: config.objectives ?? [],
  rewards: config.rewards ?? {},
  dialogTriggers: config.dialogTriggers ?? [],
  events: config.events ?? null,
  repeatable: config.repeatable ?? false,
  timeLimit: config.timeLimit ?? 0,
  failQuest: config.failQuest ?? null,
});

/**
 * Creates a main story quest
 * @param {Partial<QuestDefinition> & {chapter: number}} config
 * @returns {QuestDefinition}
 */
export const createMainQuest = (config) =>
  createQuestDefinition({
    ...config,
    category: 'main',
  });

/**
 * Creates a side quest
 * @param {Partial<QuestDefinition>} config
 * @returns {QuestDefinition}
 */
export const createSideQuest = (config) =>
  createQuestDefinition({
    ...config,
    category: 'side',
  });

/**
 * Quest category definitions
 */
export const QuestCategory = {
  MAIN: 'main',           // Main story quests
  SIDE: 'side',           // Optional side quests
  GUILD: 'guild',         // Guild/faction quests
  BOUNTY: 'bounty',       // Monster hunting quests
  COLLECTION: 'collection', // Item collection quests
  DAILY: 'daily',         // Daily repeatable quests
};
