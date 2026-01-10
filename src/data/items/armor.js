/**
 * ============================================================================
 * Armor - Body Armor, Helmets, Shields, and Accessories
 * ============================================================================
 */

import { createArmor, createItemDefinition, ItemCategory, JobType } from '../schemas/index.js';

/**
 * Body Armor
 */
export const bodyArmor = {
  // Traveler Clothes
  traveler_clothes: createArmor({
    id: 'traveler_clothes',
    name: 'たびびとのふく',
    nameEn: 'Wayfarer\'s Clothes',
    description: '旅人が着る丈夫な服。',
    defense: 4,
    buyPrice: 70,
    equippableJobs: [JobType.HERO, JobType.WARRIOR, JobType.MAGE, JobType.PRIEST, JobType.THIEF, JobType.MERCHANT],
    icon: 'textures/ui/items/traveler_clothes.png',
  }),

  // Leather Armor
  leather_armor: createArmor({
    id: 'leather_armor',
    name: 'かわのよろい',
    nameEn: 'Leather Armour',
    description: '革で作られた軽い鎧。',
    defense: 12,
    buyPrice: 180,
    equippableJobs: [JobType.HERO, JobType.WARRIOR, JobType.MARTIAL_ARTIST, JobType.THIEF],
    icon: 'textures/ui/items/leather_armor.png',
  }),

  // Chain Mail
  chain_mail: createArmor({
    id: 'chain_mail',
    name: 'くさりかたびら',
    nameEn: 'Chain Mail',
    description: '鎖を編んで作った鎧。',
    defense: 20,
    buyPrice: 500,
    equippableJobs: [JobType.HERO, JobType.WARRIOR],
    icon: 'textures/ui/items/chain_mail.png',
  }),

  // Iron Armor
  iron_armor: createArmor({
    id: 'iron_armor',
    name: 'てつのよろい',
    nameEn: 'Iron Armour',
    description: '鉄で作られた重厚な鎧。',
    defense: 30,
    buyPrice: 1200,
    equippableJobs: [JobType.HERO, JobType.WARRIOR],
    icon: 'textures/ui/items/iron_armor.png',
  }),

  // Magic Robe
  magic_robe: createArmor({
    id: 'magic_robe',
    name: 'まほうのほうい',
    nameEn: 'Magical Robes',
    description: '魔力が込められたローブ。',
    defense: 18,
    buyPrice: 1500,
    equipStats: {
      defense: 18,
      wisdom: 15,
      maxMp: 15,
    },
    equipResistances: {
      fire: 15,
      ice: 15,
    },
    equippableJobs: [JobType.MAGE, JobType.PRIEST, JobType.SAGE],
    icon: 'textures/ui/items/magic_robe.png',
  }),

  // Dragon Mail
  dragon_mail: createArmor({
    id: 'dragon_mail',
    name: 'ドラゴンメイル',
    nameEn: 'Dragon Mail',
    description: 'ドラゴンの鱗で作られた最高級の鎧。',
    defense: 50,
    buyPrice: 0,
    sellPrice: 7500,
    equipStats: {
      defense: 50,
    },
    equipResistances: {
      fire: 50,
    },
    equippableJobs: [JobType.HERO, JobType.WARRIOR],
    icon: 'textures/ui/items/dragon_mail.png',
  }),
};

/**
 * Shields
 */
export const shields = {
  // Leather Shield
  leather_shield: createItemDefinition({
    id: 'leather_shield',
    name: 'かわのたて',
    nameEn: 'Leather Shield',
    description: '革で作られた軽い盾。',
    category: ItemCategory.SHIELD,
    buyPrice: 90,
    consumable: false,
    equipStats: {
      defense: 4,
    },
    equippableJobs: [JobType.HERO, JobType.WARRIOR, JobType.PRIEST],
    icon: 'textures/ui/items/leather_shield.png',
  }),

  // Iron Shield
  iron_shield: createItemDefinition({
    id: 'iron_shield',
    name: 'てつのたて',
    nameEn: 'Iron Shield',
    description: '鉄で作られた頑丈な盾。',
    category: ItemCategory.SHIELD,
    buyPrice: 720,
    consumable: false,
    equipStats: {
      defense: 12,
    },
    equippableJobs: [JobType.HERO, JobType.WARRIOR],
    icon: 'textures/ui/items/iron_shield.png',
  }),

  // Magic Shield
  magic_shield: createItemDefinition({
    id: 'magic_shield',
    name: 'まほうのたて',
    nameEn: 'Magic Shield',
    description: '魔法の力で守る盾。',
    category: ItemCategory.SHIELD,
    buyPrice: 3000,
    consumable: false,
    equipStats: {
      defense: 20,
    },
    equipResistances: {
      fire: 15,
      ice: 15,
      lightning: 15,
    },
    equippableJobs: [JobType.HERO, JobType.WARRIOR, JobType.PRIEST],
    icon: 'textures/ui/items/magic_shield.png',
  }),
};

/**
 * Helmets
 */
export const helmets = {
  // Leather Hat
  leather_hat: createItemDefinition({
    id: 'leather_hat',
    name: 'かわのぼうし',
    nameEn: 'Leather Hat',
    description: '革で作られた帽子。',
    category: ItemCategory.HELMET,
    buyPrice: 65,
    consumable: false,
    equipStats: {
      defense: 2,
    },
    equippableJobs: [JobType.HERO, JobType.WARRIOR, JobType.MAGE, JobType.PRIEST, JobType.THIEF],
    icon: 'textures/ui/items/leather_hat.png',
  }),

  // Iron Helmet
  iron_helmet: createItemDefinition({
    id: 'iron_helmet',
    name: 'てつかぶと',
    nameEn: 'Iron Helmet',
    description: '鉄で作られた兜。',
    category: ItemCategory.HELMET,
    buyPrice: 1100,
    consumable: false,
    equipStats: {
      defense: 16,
    },
    equippableJobs: [JobType.HERO, JobType.WARRIOR],
    icon: 'textures/ui/items/iron_helmet.png',
  }),
};

/**
 * Accessories
 */
export const accessories = {
  // Power Ring
  power_ring: createItemDefinition({
    id: 'power_ring',
    name: 'ちからのゆびわ',
    nameEn: 'Strength Ring',
    description: '攻撃力が上がる指輪。',
    category: ItemCategory.ACCESSORY,
    buyPrice: 2400,
    consumable: false,
    equipStats: {
      attack: 7,
    },
    icon: 'textures/ui/items/power_ring.png',
  }),

  // Speed Ring
  speed_ring: createItemDefinition({
    id: 'speed_ring',
    name: 'すばやさのゆびわ',
    nameEn: 'Agility Ring',
    description: '素早さが上がる指輪。',
    category: ItemCategory.ACCESSORY,
    buyPrice: 1500,
    consumable: false,
    equipStats: {
      agility: 15,
    },
    icon: 'textures/ui/items/speed_ring.png',
  }),

  // Life Bracelet
  life_bracelet: createItemDefinition({
    id: 'life_bracelet',
    name: 'いのちのうでわ',
    nameEn: 'Life Bracer',
    description: 'HPが上がるうでわ。',
    category: ItemCategory.ACCESSORY,
    buyPrice: 3500,
    consumable: false,
    equipStats: {
      maxHp: 30,
    },
    icon: 'textures/ui/items/life_bracelet.png',
  }),

  // Slime Crown
  slime_crown: createItemDefinition({
    id: 'slime_crown',
    name: 'スライムの王冠',
    nameEn: 'Slime Crown',
    description: 'スライムたちの王の証。不思議な力がある。',
    category: ItemCategory.ACCESSORY,
    buyPrice: 0,
    sellPrice: 3000,
    consumable: false,
    equipStats: {
      defense: 5,
      luck: 20,
    },
    special: {
      doubleExp: true,
    },
    icon: 'textures/ui/items/slime_crown.png',
  }),
};

// Combine all armor
export const allArmor = {
  ...bodyArmor,
  ...shields,
  ...helmets,
  ...accessories,
};

// Export armor by ID lookup
export const getArmorById = (id) => allArmor[id] ?? null;
