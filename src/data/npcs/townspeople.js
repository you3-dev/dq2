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
    defaultPosition: { x: 5, y: 0, z: 10 },
    defaultRotation: 180,
    dialogId: 'elder_thomas_dialog',
    questIds: ['main_quest_01'],
    model: {
      path: 'models/npcs/elder.glb',
      scale: 1.1,
    },
    portrait: 'textures/portraits/elder_thomas.png',
  }),

  // Weapon Shop Merchant
  weapon_merchant_bran: createMerchant({
    id: 'weapon_merchant_bran',
    name: '武器屋ブラン',
    nameEn: 'Bran the Weaponsmith',
    defaultMapId: 'town_start',
    defaultPosition: { x: -8, y: 0, z: 5 },
    defaultRotation: 90,
    dialogId: 'weapon_shop_dialog',
    shopInventory: [
      { itemId: 'wooden_sword', stock: -1 },
      { itemId: 'copper_sword', stock: -1 },
      { itemId: 'iron_sword', stock: 5 },
      { itemId: 'wooden_staff', stock: -1 },
      { itemId: 'leather_shield', stock: -1 },
    ],
    model: {
      path: 'models/npcs/merchant_male.glb',
    },
    portrait: 'textures/portraits/merchant_bran.png',
  }),

  // Item Shop Merchant
  item_merchant_lina: createMerchant({
    id: 'item_merchant_lina',
    name: '道具屋リナ',
    nameEn: 'Lina the Merchant',
    defaultMapId: 'town_start',
    defaultPosition: { x: 8, y: 0, z: -5 },
    defaultRotation: 270,
    dialogId: 'item_shop_dialog',
    shopInventory: [
      { itemId: 'herb', stock: -1 },
      { itemId: 'antidote', stock: -1 },
      { itemId: 'torch', stock: -1 },
      { itemId: 'magic_water', stock: 10 },
      { itemId: 'wing_of_wyvern', stock: 5 },
    ],
    model: {
      path: 'models/npcs/merchant_female.glb',
    },
    portrait: 'textures/portraits/merchant_lina.png',
  }),

  // Inn Keeper
  innkeeper_martha: createInnkeeper({
    id: 'innkeeper_martha',
    name: '宿屋マーサ',
    nameEn: 'Martha the Innkeeper',
    defaultMapId: 'town_start',
    defaultPosition: { x: 0, y: 0, z: -10 },
    defaultRotation: 0,
    dialogId: 'inn_dialog',
    innService: {
      pricePerPerson: 10,
      fullRestore: true,
      cureStatus: true,
      saveGame: true,
    },
    model: {
      path: 'models/npcs/innkeeper.glb',
    },
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
    model: {
      path: 'models/npcs/villager_old_man.glb',
    },
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
    model: {
      path: 'models/npcs/guard_captain.glb',
      scale: 1.2,
    },
    portrait: 'textures/portraits/guard_rex.png',
  }),
};

// Export all NPCs as array for iteration
export const allTownNPCs = Object.values(startingTownNPCs);

// Export NPC by ID lookup
export const getNPCById = (id) => startingTownNPCs[id] ?? null;
