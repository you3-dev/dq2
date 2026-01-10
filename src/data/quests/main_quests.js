/**
 * ============================================================================
 * Main Story Quests - Core Story Progression
 * ============================================================================
 */

import { createMainQuest, QuestObjectiveType } from '../schemas/index.js';

/**
 * Chapter 1: The Beginning
 */
export const mainQuests = {
  // First main quest
  main_quest_01: createMainQuest({
    id: 'main_quest_01',
    name: '勇者の目覚め',
    nameEn: 'The Hero Awakens',
    description: '長老トーマスから話を聞き、村の危機を救うための冒険を始めよう。',
    descriptionEn: 'Speak with Elder Thomas and begin your adventure to save the village from danger.',
    chapter: 1,
    requirements: null,  // Starting quest
    objectives: [
      {
        id: 'talk_to_elder',
        type: QuestObjectiveType.TALK,
        description: '長老トーマスと話す',
        descriptionEn: 'Talk to Elder Thomas',
        targetId: 'elder_thomas',
      },
      {
        id: 'prepare_for_journey',
        type: QuestObjectiveType.TALK,
        description: '武器屋で装備を整える',
        descriptionEn: 'Get equipment from the weapon shop',
        targetId: 'weapon_merchant_bran',
      },
      {
        id: 'defeat_slimes',
        type: QuestObjectiveType.DEFEAT,
        description: 'スライムを5匹倒す',
        descriptionEn: 'Defeat 5 Slimes',
        targetId: 'slime',
        targetCount: 5,
      },
      {
        id: 'return_to_elder',
        type: QuestObjectiveType.TALK,
        description: '長老に報告する',
        descriptionEn: 'Report back to Elder Thomas',
        targetId: 'elder_thomas',
      },
    ],
    rewards: {
      exp: 50,
      gold: 100,
      items: [
        { itemId: 'copper_sword', count: 1 },
        { itemId: 'herb', count: 5 },
      ],
      unlockQuest: 'main_quest_02',
    },
    dialogTriggers: [
      {
        npcId: 'elder_thomas',
        dialogId: 'elder_thomas_quest_01_start',
      },
      {
        npcId: 'elder_thomas',
        dialogId: 'elder_thomas_quest_01_complete',
        afterObjective: 'defeat_slimes',
      },
    ],
    events: {
      onStart: 'event_quest_01_start',
      onComplete: 'event_quest_01_complete',
    },
  }),

  // Second main quest
  main_quest_02: createMainQuest({
    id: 'main_quest_02',
    name: '洞窟の脅威',
    nameEn: 'Threat in the Cave',
    description: '始まりの洞窟に巣食うモンスターの親玉を倒し、村を守れ。',
    descriptionEn: 'Defeat the monster boss lurking in the Beginner\'s Cave to protect the village.',
    chapter: 1,
    requirements: {
      requiredQuests: ['main_quest_01'],
      minLevel: 3,
    },
    objectives: [
      {
        id: 'talk_guard',
        type: QuestObjectiveType.TALK,
        description: '衛兵隊長レックスと話す',
        descriptionEn: 'Speak with Captain Rex',
        targetId: 'guard_captain_rex',
      },
      {
        id: 'explore_cave',
        type: QuestObjectiveType.EXPLORE,
        description: '始まりの洞窟を探索する',
        descriptionEn: 'Explore the Beginner\'s Cave',
        targetId: 'cave_beginner',
      },
      {
        id: 'defeat_king_slime',
        type: QuestObjectiveType.DEFEAT,
        description: 'キングスライムを倒す',
        descriptionEn: 'Defeat the King Slime',
        targetId: 'king_slime',
        targetCount: 1,
      },
      {
        id: 'return_victorious',
        type: QuestObjectiveType.TALK,
        description: '勝利を報告する',
        descriptionEn: 'Report your victory',
        targetId: 'guard_captain_rex',
      },
    ],
    rewards: {
      exp: 200,
      gold: 300,
      items: [
        { itemId: 'iron_armor', count: 1 },
        { itemId: 'magic_water', count: 3 },
      ],
      unlockQuest: 'main_quest_03',
      unlockMap: 'field_forest',
      setFlag: 'chapter_1_complete',
    },
    dialogTriggers: [
      {
        npcId: 'guard_captain_rex',
        dialogId: 'guard_rex_quest_02_start',
      },
      {
        npcId: 'guard_captain_rex',
        dialogId: 'guard_rex_quest_02_complete',
        afterObjective: 'defeat_king_slime',
      },
    ],
    events: {
      onStart: 'event_quest_02_start',
      onComplete: 'event_chapter_1_complete',
    },
  }),

  // Third main quest (Chapter 2 start)
  main_quest_03: createMainQuest({
    id: 'main_quest_03',
    name: '森の先へ',
    nameEn: 'Beyond the Forest',
    description: '噂の魔王城へ続く道を探すため、森の奥へと進め。',
    descriptionEn: 'Journey through the forest to find the path to the rumored Demon Lord\'s castle.',
    chapter: 2,
    requirements: {
      requiredQuests: ['main_quest_02'],
      minLevel: 5,
      requiredFlags: ['chapter_1_complete'],
    },
    objectives: [
      {
        id: 'enter_forest',
        type: QuestObjectiveType.EXPLORE,
        description: '深い森に入る',
        descriptionEn: 'Enter the deep forest',
        targetId: 'field_forest',
      },
      {
        id: 'find_sage',
        type: QuestObjectiveType.TALK,
        description: '森の賢者を探す',
        descriptionEn: 'Find the forest sage',
        targetId: 'forest_sage',
        hidden: true,  // Revealed after entering forest
      },
      {
        id: 'collect_herbs',
        type: QuestObjectiveType.COLLECT,
        description: '賢者のために薬草を10個集める',
        descriptionEn: 'Collect 10 herbs for the sage',
        targetId: 'herb',
        targetCount: 10,
        hidden: true,
      },
    ],
    rewards: {
      exp: 400,
      gold: 500,
      items: [
        { itemId: 'magic_staff', count: 1 },
      ],
      unlockQuest: 'main_quest_04',
      unlockMap: 'field_highlands',
    },
  }),
};

// Export all main quests as array
export const allMainQuests = Object.values(mainQuests);

// Export quest by ID lookup
export const getMainQuestById = (id) => mainQuests[id] ?? null;

// Export quests by chapter
export const getQuestsByChapter = (chapter) =>
  allMainQuests.filter((quest) => quest.chapter === chapter);
