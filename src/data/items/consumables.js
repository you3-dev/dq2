/**
 * ============================================================================
 * Consumable Items - Healing, Utility, and Battle Items
 * ============================================================================
 */

import { createConsumable, createItemDefinition, ItemCategory } from '../schemas/index.js';

/**
 * Healing items
 */
export const healingItems = {
  // Basic Herb
  herb: createConsumable({
    id: 'herb',
    name: 'やくそう',
    nameEn: 'Medicinal Herb',
    description: 'HPを30回復する薬草。',
    buyPrice: 8,
    effects: [
      { type: 'heal_hp', value: 30 },
    ],
    icon: 'textures/ui/items/herb.png',
  }),

  // Strong Herb
  strong_herb: createConsumable({
    id: 'strong_herb',
    name: '上やくそう',
    nameEn: 'Strong Herb',
    description: 'HPを60回復する上質な薬草。',
    buyPrice: 30,
    effects: [
      { type: 'heal_hp', value: 60 },
    ],
    icon: 'textures/ui/items/strong_herb.png',
  }),

  // Special Herb
  special_herb: createConsumable({
    id: 'special_herb',
    name: '特やくそう',
    nameEn: 'Special Herb',
    description: 'HPを90回復する最高級の薬草。',
    buyPrice: 80,
    effects: [
      { type: 'heal_hp', value: 90 },
    ],
    icon: 'textures/ui/items/special_herb.png',
  }),

  // Magic Water (MP recovery)
  magic_water: createConsumable({
    id: 'magic_water',
    name: 'まほうの聖水',
    nameEn: 'Magic Water',
    description: 'MPを20回復する聖なる水。',
    buyPrice: 50,
    effects: [
      { type: 'heal_mp', value: 20 },
    ],
    icon: 'textures/ui/items/magic_water.png',
  }),

  // Elixir
  elixir: createConsumable({
    id: 'elixir',
    name: 'エリクサー',
    nameEn: 'Elixir',
    description: 'HPとMPを完全回復する貴重な霊薬。',
    buyPrice: 0,  // Cannot buy
    sellPrice: 500,
    effects: [
      { type: 'heal_hp', percentage: 100 },
      { type: 'heal_mp', percentage: 100 },
    ],
    icon: 'textures/ui/items/elixir.png',
  }),
};

/**
 * Status cure items
 */
export const statusCureItems = {
  // Antidote
  antidote: createConsumable({
    id: 'antidote',
    name: 'どくけしそう',
    nameEn: 'Antidotal Herb',
    description: '毒状態を回復する。',
    buyPrice: 10,
    effects: [
      { type: 'cure_status', status: 'poison' },
    ],
    icon: 'textures/ui/items/antidote.png',
  }),

  // Awakening Powder
  awakening_powder: createConsumable({
    id: 'awakening_powder',
    name: 'めざめのこな',
    nameEn: 'Moonwort Bulb',
    description: '睡眠・麻痺状態を回復する。',
    buyPrice: 30,
    effects: [
      { type: 'cure_status', status: 'sleep' },
      { type: 'cure_status', status: 'paralysis' },
    ],
    icon: 'textures/ui/items/awakening_powder.png',
  }),

  // Sage Leaf
  sage_leaf: createConsumable({
    id: 'sage_leaf',
    name: 'せかいじゅの葉',
    nameEn: 'Yggdrasil Leaf',
    description: '戦闘不能の仲間を復活させる。',
    buyPrice: 0,
    sellPrice: 1000,
    effects: [
      { type: 'revive', percentage: 100 },
    ],
    icon: 'textures/ui/items/sage_leaf.png',
  }),
};

/**
 * Utility items
 */
export const utilityItems = {
  // Torch
  torch: createConsumable({
    id: 'torch',
    name: 'たいまつ',
    nameEn: 'Torch',
    description: '暗い洞窟を照らす。',
    buyPrice: 5,
    canUseInBattle: false,
    effects: [
      { type: 'field_effect', value: 'illuminate' },
    ],
    icon: 'textures/ui/items/torch.png',
  }),

  // Wing of Wyvern (teleport to town)
  wing_of_wyvern: createConsumable({
    id: 'wing_of_wyvern',
    name: 'キメラのつばさ',
    nameEn: 'Chimaera Wing',
    description: '最後に訪れた町にワープする。',
    buyPrice: 25,
    canUseInBattle: false,
    effects: [
      { type: 'teleport', value: 'last_town' },
    ],
    icon: 'textures/ui/items/chimera_wing.png',
  }),

  // Holy Water (reduce encounters)
  holy_water: createConsumable({
    id: 'holy_water',
    name: '聖水',
    nameEn: 'Holy Water',
    description: 'しばらくの間、弱い敵が出現しなくなる。',
    buyPrice: 20,
    canUseInBattle: false,
    effects: [
      { type: 'field_effect', value: 'repel_weak', duration: 100 },
    ],
    icon: 'textures/ui/items/holy_water.png',
  }),
};

/**
 * Battle items
 */
export const battleItems = {
  // Bomb Stone
  bomb_stone: createConsumable({
    id: 'bomb_stone',
    name: 'ばくだん石',
    nameEn: 'Rockbomb Shard',
    description: '敵全体に20〜30のダメージを与える。',
    buyPrice: 100,
    canUseInField: false,
    effects: [
      { type: 'damage', value: 25, variance: 5, target: 'all_enemies' },
    ],
    icon: 'textures/ui/items/bomb_stone.png',
  }),

  // Smoke Bomb
  smoke_bomb: createConsumable({
    id: 'smoke_bomb',
    name: 'けむり玉',
    nameEn: 'Smoke Bomb',
    description: '戦闘から確実に逃げられる。',
    buyPrice: 80,
    canUseInField: false,
    effects: [
      { type: 'escape', value: 'guaranteed' },
    ],
    icon: 'textures/ui/items/smoke_bomb.png',
  }),
};

/**
 * Material items (crafting/drops)
 */
export const materialItems = {
  slime_jelly: createItemDefinition({
    id: 'slime_jelly',
    name: 'スライムゼリー',
    nameEn: 'Slime Drop',
    description: 'スライムから取れるゼリー状の物質。',
    category: ItemCategory.MATERIAL,
    buyPrice: 0,
    sellPrice: 5,
    consumable: false,
    icon: 'textures/ui/items/slime_jelly.png',
  }),

  king_slime_heart: createItemDefinition({
    id: 'king_slime_heart',
    name: 'キングスライムの心',
    nameEn: 'King Slime Heart',
    description: 'キングスライムの核。とても希少。',
    category: ItemCategory.MATERIAL,
    buyPrice: 0,
    sellPrice: 500,
    consumable: false,
    icon: 'textures/ui/items/king_slime_heart.png',
  }),
};

// Combine all consumables
export const allConsumables = {
  ...healingItems,
  ...statusCureItems,
  ...utilityItems,
  ...battleItems,
  ...materialItems,
};

// Export item by ID lookup
export const getConsumableById = (id) => allConsumables[id] ?? null;
