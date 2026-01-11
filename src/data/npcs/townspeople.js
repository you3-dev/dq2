/**
 * ============================================================================
 * Town NPCs - Villagers, Merchants, and Service NPCs
 * ============================================================================
 */

import {
  createNPCDefinition,
  createMerchant,
  createInnkeeper
} from '../schemas/index.js';

/**
 * Starting town NPCs
 */
export const startingTownNPCs = {
  // Village Elder
  elder_thomas: createNPCDefinition({
    id: 'elder_thomas',
    name: '長老トーマス',
    nameEn: 'Elder Thomas',
    type: 'sage',
    defaultMapId: 'town_start',
    defaultPosition: { x: 12, y: 0, z: -18 }, // 長老の家の前
    defaultRotation: 180,
    dialogId: 'elder_thomas_dialog',
    questIds: ['main_quest_01'],
    modelPath: 'characters/OldClassy_Male.gltf',
    scale: 0.5,
    portrait: 'textures/portraits/elder_thomas.png',
  }),

  // Weapon Shop Merchant
  weapon_merchant_bran: createMerchant({
    id: 'weapon_merchant_bran',
    name: '武器屋ブラン',
    nameEn: 'Bran the Weaponsmith',
    defaultMapId: 'town_start',
    defaultPosition: { x: -10, y: 0, z: 2 }, // 赤い屋台の前
    defaultRotation: 90,
    dialogId: 'weapon_shop_dialog',
    shopInventory: [
      { itemId: 'wooden_sword', stock: -1 },
      { itemId: 'copper_sword', stock: -1 },
      { itemId: 'iron_sword', stock: 5 },
      { itemId: 'wooden_staff', stock: -1 },
      { itemId: 'leather_shield', stock: -1 },
    ],
    modelPath: 'characters/Soldier_Male.gltf', // 腕利きっぽく
    scale: 0.5,
    portrait: 'textures/portraits/merchant_bran.png',
  }),

  // Item Shop Merchant
  item_merchant_lina: createMerchant({
    id: 'item_merchant_lina',
    name: '道具屋リナ',
    nameEn: 'Lina the Merchant',
    defaultMapId: 'town_start',
    defaultPosition: { x: 10, y: 0, z: -3 }, // 緑の屋台の前
    defaultRotation: 270,
    dialogId: 'item_shop_dialog',
    shopInventory: [
      { itemId: 'herb', stock: -1 },
      { itemId: 'antidote', stock: -1 },
      { itemId: 'torch', stock: -1 },
      { itemId: 'magic_water', stock: 10 },
      { itemId: 'wing_of_wyvern', stock: 5 },
    ],
    modelPath: 'characters/Casual_Female.gltf',
    scale: 0.5,
    portrait: 'textures/portraits/merchant_lina.png',
  }),

  // Inn Keeper
  innkeeper_martha: createInnkeeper({
    id: 'innkeeper_martha',
    name: '宿屋マーサ',
    nameEn: 'Martha the Innkeeper',
    defaultMapId: 'town_start',
    defaultPosition: { x: -15, y: 0, z: -8 }, // 宿屋の前
    defaultRotation: 180,
    dialogId: 'inn_dialog',
    innService: {
      pricePerPerson: 10,
      fullRestore: true,
      cureStatus: true,
      saveGame: true,
    },
    modelPath: 'characters/Casual2_Female.gltf',
    scale: 0.5,
    portrait: 'textures/portraits/innkeeper_martha.png',
  }),

  // Villager with hints
  villager_old_man: createNPCDefinition({
    id: 'villager_old_man',
    name: '村人のおじいさん',
    nameEn: 'Old Villager',
    type: 'villager',
    defaultMapId: 'town_start',
    defaultPosition: { x: 12, y: 0, z: 8 },
    canMove: true,
    patrolPath: [
      { x: 12, y: 0, z: 8 },
      { x: 15, y: 0, z: 8 },
      { x: 15, y: 0, z: 12 },
      { x: 12, y: 0, z: 12 },
    ],
    dialogId: 'hint_dialog_01',
    modelPath: 'characters/Casual3_Male.gltf',
    scale: 0.5,
  }),

  // Guard NPC
  guard_captain_rex: createNPCDefinition({
    id: 'guard_captain_rex',
    name: '衛兵隊長レックス',
    nameEn: 'Captain Rex',
    type: 'guard',
    defaultMapId: 'town_start',
    defaultPosition: { x: 0, y: 0, z: 20 },
    defaultRotation: 180,
    dialogId: 'guard_captain_dialog',
    conditions: {
      requiredQuest: 'main_quest_01',
    },
    modelPath: 'characters/BlueSoldier_Male.gltf',
    scale: 0.55,
    portrait: 'textures/portraits/guard_rex.png',
  }),
};

// Export all NPCs as array for iteration
export const allTownNPCs = Object.values(startingTownNPCs);

// Export NPC by ID lookup
export const getNPCById = (id) => startingTownNPCs[id] ?? null;
