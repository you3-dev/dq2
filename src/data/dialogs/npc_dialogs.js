/**
 * ============================================================================
 * NPC Dialogs - Conversation Trees for NPCs
 * ============================================================================
 */

import {
  createDialogTree,
  createDialogNode,
  createChoiceNode,
  ExpressionType,
  DialogActionType,
} from '../schemas/index.js';

/**
 * Elder Thomas dialog trees
 */
export const elderThomasDialogs = {
  // Default dialog
  elder_thomas_dialog: createDialogTree({
    id: 'elder_thomas_dialog',
    description: 'Elder Thomas default conversation',
    defaultStartNode: 'greeting',
    conditionalStarts: [
      {
        type: 'quest_status',
        value: 'main_quest_01:not_started',
        startNodeId: 'first_meeting',
      },
      {
        type: 'quest_status',
        value: 'main_quest_01:in_progress',
        startNodeId: 'quest_progress',
      },
    ],
    nodes: [
      // First meeting
      {
        id: 'first_meeting',
        speaker: '長老トーマス',
        speakerEn: 'Elder Thomas',
        text: 'おお、若き者よ。ついにこの日が来たか。',
        textEn: 'Ah, young one. The day has finally come.',
        expression: ExpressionType.NORMAL,
        nextNodeId: 'first_meeting_2',
      },
      {
        id: 'first_meeting_2',
        speaker: '長老トーマス',
        speakerEn: 'Elder Thomas',
        text: 'この村に魔物の脅威が迫っておる。お前に頼みがあるのじゃ。',
        textEn: 'A monster threat approaches our village. I have a request for you.',
        expression: ExpressionType.THINKING,
        nextNodeId: 'quest_offer',
      },
      {
        id: 'quest_offer',
        speaker: '長老トーマス',
        speakerEn: 'Elder Thomas',
        text: '村を守るため、冒険者として立ち上がってくれぬか？',
        textEn: 'Will you rise as an adventurer to protect our village?',
        expression: ExpressionType.NORMAL,
        choices: [
          {
            id: 'accept',
            text: 'はい、引き受けます',
            textEn: 'Yes, I accept',
            nextNodeId: 'quest_accepted',
            action: {
              type: DialogActionType.START_QUEST,
              value: 'main_quest_01',
            },
          },
          {
            id: 'decline',
            text: 'まだ準備ができていません',
            textEn: 'I\'m not ready yet',
            nextNodeId: 'quest_declined',
          },
        ],
      },
      {
        id: 'quest_accepted',
        speaker: '長老トーマス',
        speakerEn: 'Elder Thomas',
        text: 'ありがたい！まずは武器屋で装備を整え、村の外でスライムを倒してくるのじゃ。',
        textEn: 'Thank you! First, get equipped at the weapon shop, then defeat some slimes outside the village.',
        expression: ExpressionType.HAPPY,
        action: {
          type: DialogActionType.GIVE_ITEM,
          value: 'herb',
          amount: 3,
        },
        nextNodeId: 'quest_accepted_end',
      },
      {
        id: 'quest_accepted_end',
        speaker: '長老トーマス',
        speakerEn: 'Elder Thomas',
        text: 'これは餞別じゃ。気をつけて行ってくるのじゃぞ。',
        textEn: 'Take these as a parting gift. Be careful out there.',
        expression: ExpressionType.NORMAL,
      },
      {
        id: 'quest_declined',
        speaker: '長老トーマス',
        speakerEn: 'Elder Thomas',
        text: 'そうか...準備ができたらまた来るのじゃ。村はお前を待っておる。',
        textEn: 'I see... Come back when you\'re ready. The village awaits you.',
        expression: ExpressionType.SAD,
      },
      // During quest
      {
        id: 'quest_progress',
        speaker: '長老トーマス',
        speakerEn: 'Elder Thomas',
        text: '頑張っておるようじゃな。スライムは倒せたかね？',
        textEn: 'You seem to be working hard. Have you defeated the slimes?',
        expression: ExpressionType.THINKING,
      },
      // Default greeting
      {
        id: 'greeting',
        speaker: '長老トーマス',
        speakerEn: 'Elder Thomas',
        text: 'よく来たの。何か困ったことがあれば相談するのじゃ。',
        textEn: 'Welcome. If you have any troubles, feel free to consult me.',
        expression: ExpressionType.NORMAL,
      },
    ],
  }),
};

/**
 * Shop dialogs
 */
export const shopDialogs = {
  // Weapon shop dialog
  weapon_shop_dialog: createDialogTree({
    id: 'weapon_shop_dialog',
    description: 'Weapon merchant Bran shop dialog',
    defaultStartNode: 'greeting',
    nodes: [
      {
        id: 'greeting',
        speaker: '武器屋ブラン',
        speakerEn: 'Bran the Weaponsmith',
        text: 'いらっしゃい！武器と防具を取り揃えてるぜ。何をお探しだい？',
        textEn: 'Welcome! I\'ve got weapons and armor. What are you looking for?',
        expression: ExpressionType.HAPPY,
        choices: [
          {
            id: 'buy',
            text: '買い物をする',
            textEn: 'I want to buy',
            action: {
              type: DialogActionType.OPEN_SHOP,
              value: 'weapon_merchant_bran',
            },
          },
          {
            id: 'sell',
            text: '売りたいものがある',
            textEn: 'I want to sell',
            action: {
              type: DialogActionType.OPEN_SHOP,
              value: 'weapon_merchant_bran:sell',
            },
          },
          {
            id: 'talk',
            text: '話を聞く',
            textEn: 'Just talking',
            nextNodeId: 'small_talk',
          },
          {
            id: 'leave',
            text: 'やめる',
            textEn: 'Never mind',
            action: {
              type: DialogActionType.EXIT,
            },
          },
        ],
      },
      {
        id: 'small_talk',
        speaker: '武器屋ブラン',
        speakerEn: 'Bran the Weaponsmith',
        text: '最近、洞窟の方で妙な気配がするって話だ。冒険に行くなら気をつけな。',
        textEn: 'I\'ve heard there\'s something strange in the cave lately. Be careful if you go adventuring.',
        expression: ExpressionType.THINKING,
      },
    ],
  }),

  // Item shop dialog
  item_shop_dialog: createDialogTree({
    id: 'item_shop_dialog',
    description: 'Item merchant Lina shop dialog',
    defaultStartNode: 'greeting',
    nodes: [
      {
        id: 'greeting',
        speaker: '道具屋リナ',
        speakerEn: 'Lina the Merchant',
        text: 'こんにちは！道具はいかがですか？',
        textEn: 'Hello! Would you like some supplies?',
        expression: ExpressionType.HAPPY,
        choices: [
          {
            id: 'buy',
            text: '買い物をする',
            textEn: 'I want to buy',
            action: {
              type: DialogActionType.OPEN_SHOP,
              value: 'item_merchant_lina',
            },
          },
          {
            id: 'leave',
            text: 'やめる',
            textEn: 'Never mind',
            action: {
              type: DialogActionType.EXIT,
            },
          },
        ],
      },
    ],
  }),

  // Inn dialog
  inn_dialog: createDialogTree({
    id: 'inn_dialog',
    description: 'Innkeeper Martha dialog',
    defaultStartNode: 'greeting',
    nodes: [
      {
        id: 'greeting',
        speaker: '宿屋マーサ',
        speakerEn: 'Martha the Innkeeper',
        text: 'いらっしゃいませ。一晩10ゴールドでお泊まりいただけますよ。お休みになりますか？',
        textEn: 'Welcome! It\'s 10 gold per person for a night\'s stay. Would you like to rest?',
        expression: ExpressionType.HAPPY,
        choices: [
          {
            id: 'rest',
            text: '泊まる',
            textEn: 'Yes, please',
            nextNodeId: 'check_gold',
          },
          {
            id: 'leave',
            text: 'やめる',
            textEn: 'No, thanks',
            nextNodeId: 'goodbye',
          },
        ],
      },
      {
        id: 'check_gold',
        speaker: '宿屋マーサ',
        speakerEn: 'Martha the Innkeeper',
        text: 'ありがとうございます。ごゆっくりお休みください。',
        textEn: 'Thank you. Please have a good rest.',
        expression: ExpressionType.HAPPY,
        action: {
          type: DialogActionType.REST_INN,
          value: 'innkeeper_martha',
        },
      },
      {
        id: 'goodbye',
        speaker: '宿屋マーサ',
        speakerEn: 'Martha the Innkeeper',
        text: 'またお越しくださいね。',
        textEn: 'Please come again.',
        expression: ExpressionType.NORMAL,
      },
    ],
  }),
};

/**
 * Hint dialogs
 */
export const hintDialogs = {
  hint_dialog_01: createDialogTree({
    id: 'hint_dialog_01',
    description: 'Old villager hint dialog',
    defaultStartNode: 'greeting',
    nodes: [
      {
        id: 'greeting',
        speaker: '村人のおじいさん',
        speakerEn: 'Old Villager',
        text: 'ほっほっほ...若い者は元気でいいのう。',
        textEn: 'Ho ho ho... It\'s good to see young folks so energetic.',
        expression: ExpressionType.HAPPY,
        nextNodeId: 'hint',
      },
      {
        id: 'hint',
        speaker: '村人のおじいさん',
        speakerEn: 'Old Villager',
        text: 'メタルスライムは逃げ足が速いが、倒せばたくさんの経験を得られるぞ。',
        textEn: 'Metal Slimes are quick to flee, but defeating one grants a lot of experience.',
        expression: ExpressionType.THINKING,
      },
    ],
  }),
};

// Export all dialogs
export const allDialogs = {
  ...elderThomasDialogs,
  ...shopDialogs,
  ...hintDialogs,
};

// Export dialog by ID lookup
export const getDialogById = (id) => allDialogs[id] ?? null;
