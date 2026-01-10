/**
 * ============================================================================
 * Weapons - Swords, Staffs, and Other Weapons
 * ============================================================================
 */

import { createWeapon, WeaponType, JobType } from '../schemas/index.js';

/**
 * Sword weapons
 */
export const swords = {
  // Wooden Sword (starter)
  wooden_sword: createWeapon({
    id: 'wooden_sword',
    name: 'ひのきのぼう',
    nameEn: 'Cypress Stick',
    description: 'ひのきで作られた棒。武器としては心もとない。',
    weaponType: WeaponType.SWORD,
    attack: 2,
    buyPrice: 5,
    equippableJobs: [JobType.HERO, JobType.WARRIOR, JobType.MARTIAL_ARTIST],
    icon: 'textures/ui/items/wooden_sword.png',
    model: 'models/items/wooden_sword.glb',
  }),

  // Copper Sword
  copper_sword: createWeapon({
    id: 'copper_sword',
    name: 'どうのつるぎ',
    nameEn: 'Copper Sword',
    description: '銅で作られた剣。初心者向け。',
    weaponType: WeaponType.SWORD,
    attack: 12,
    buyPrice: 100,
    equippableJobs: [JobType.HERO, JobType.WARRIOR],
    icon: 'textures/ui/items/copper_sword.png',
    model: 'models/items/copper_sword.glb',
  }),

  // Iron Sword
  iron_sword: createWeapon({
    id: 'iron_sword',
    name: 'てつのつるぎ',
    nameEn: 'Iron Sword',
    description: '鉄で鍛えられた頑丈な剣。',
    weaponType: WeaponType.SWORD,
    attack: 25,
    buyPrice: 560,
    equippableJobs: [JobType.HERO, JobType.WARRIOR],
    icon: 'textures/ui/items/iron_sword.png',
    model: 'models/items/iron_sword.glb',
  }),

  // Steel Sword
  steel_sword: createWeapon({
    id: 'steel_sword',
    name: 'はがねのつるぎ',
    nameEn: 'Steel Broadsword',
    description: '鋼で作られた優秀な剣。',
    weaponType: WeaponType.SWORD,
    attack: 40,
    buyPrice: 1500,
    equippableJobs: [JobType.HERO, JobType.WARRIOR],
    icon: 'textures/ui/items/steel_sword.png',
    model: 'models/items/steel_sword.glb',
  }),

  // Flame Sword
  flame_sword: createWeapon({
    id: 'flame_sword',
    name: 'ほのおのつるぎ',
    nameEn: 'Flame Sword',
    description: '炎を纏う魔法の剣。戦闘中に使うと炎の呪文効果。',
    weaponType: WeaponType.SWORD,
    attack: 63,
    buyPrice: 0,
    sellPrice: 4500,
    equipStats: {
      attack: 63,
    },
    equipResistances: {
      fire: 25,
    },
    equippableJobs: [JobType.HERO, JobType.WARRIOR],
    icon: 'textures/ui/items/flame_sword.png',
    model: 'models/items/flame_sword.glb',
  }),

  // Legendary Sword
  legendary_sword: createWeapon({
    id: 'legendary_sword',
    name: '王者のつるぎ',
    nameEn: 'Sword of Kings',
    description: '伝説の勇者だけが扱える聖剣。',
    weaponType: WeaponType.SWORD,
    attack: 120,
    buyPrice: 0,
    sellPrice: 0,  // Cannot sell
    equipStats: {
      attack: 120,
      wisdom: 20,
    },
    equipResistances: {
      dark: 50,
      instant_death: 100,
    },
    equippableJobs: [JobType.HERO],
    special: {
      autoRevive: true,
    },
    icon: 'textures/ui/items/legendary_sword.png',
    model: 'models/items/legendary_sword.glb',
  }),
};

/**
 * Staff weapons
 */
export const staffs = {
  // Wooden Staff
  wooden_staff: createWeapon({
    id: 'wooden_staff',
    name: 'きのつえ',
    nameEn: 'Oaken Club',
    description: '木で作られた杖。魔法使い向け。',
    weaponType: WeaponType.STAFF,
    attack: 5,
    buyPrice: 30,
    equipStats: {
      attack: 5,
      wisdom: 3,
    },
    equippableJobs: [JobType.MAGE, JobType.PRIEST, JobType.SAGE],
    icon: 'textures/ui/items/wooden_staff.png',
    model: 'models/items/wooden_staff.glb',
  }),

  // Magic Staff
  magic_staff: createWeapon({
    id: 'magic_staff',
    name: 'まどうしのつえ',
    nameEn: 'Wizard\'s Staff',
    description: '魔力が込められた杖。MPが少し回復する。',
    weaponType: WeaponType.STAFF,
    attack: 15,
    buyPrice: 1500,
    equipStats: {
      attack: 15,
      wisdom: 15,
      maxMp: 10,
    },
    equippableJobs: [JobType.MAGE, JobType.SAGE],
    icon: 'textures/ui/items/magic_staff.png',
    model: 'models/items/magic_staff.glb',
  }),

  // Sage Staff
  sage_staff: createWeapon({
    id: 'sage_staff',
    name: '賢者のつえ',
    nameEn: 'Sage\'s Staff',
    description: '賢者の力が宿る杖。使うと回復魔法効果。',
    weaponType: WeaponType.STAFF,
    attack: 30,
    buyPrice: 0,
    sellPrice: 5000,
    equipStats: {
      attack: 30,
      wisdom: 30,
      maxMp: 30,
    },
    equippableJobs: [JobType.PRIEST, JobType.SAGE],
    icon: 'textures/ui/items/sage_staff.png',
    model: 'models/items/sage_staff.glb',
  }),
};

// Combine all weapons
export const allWeapons = {
  ...swords,
  ...staffs,
};

// Export weapon by ID lookup
export const getWeaponById = (id) => allWeapons[id] ?? null;
