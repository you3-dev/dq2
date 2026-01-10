/**
 * ============================================================================
 * Slime Enemies - The Classic DQ Monsters
 * ============================================================================
 */

import {
  createEnemyDefinition,
  EnemyBehavior,
  EnemyCategory
} from '../schemas/index.js';

/**
 * Slime family enemies
 */
export const slimeEnemies = {
  // Basic Slime
  slime: createEnemyDefinition({
    id: 'slime',
    name: 'スライム',
    nameEn: 'Slime',
    description: '最も弱いモンスター。冒険者の最初の相手。',
    category: EnemyCategory.SLIME,
    stats: {
      hp: 8,
      mp: 0,
      attack: 5,
      defense: 4,
      agility: 3,
      wisdom: 1,
    },
    exp: 1,
    gold: 2,
    drops: [
      { itemId: 'herb', chance: 12.5 },
      { itemId: 'slime_jelly', chance: 6.25 },
    ],
    behavior: EnemyBehavior.AGGRESSIVE,
    actions: [
      { id: 'attack', type: 'attack', weight: 100 },
    ],
    spawnMaps: ['field_start', 'cave_beginner'],
    model: {
      path: 'models/enemies/slime.glb',
      scale: 0.8,
    },
    visual: {
      deathEffect: 'dissolve_blue',
    },
  }),

  // Red Slime
  slime_red: createEnemyDefinition({
    id: 'slime_red',
    name: 'スライムベス',
    nameEn: 'She-Slime',
    description: '赤いスライム。普通のスライムより少し強い。',
    category: EnemyCategory.SLIME,
    stats: {
      hp: 12,
      mp: 0,
      attack: 8,
      defense: 6,
      agility: 5,
      wisdom: 2,
    },
    exp: 2,
    gold: 4,
    drops: [
      { itemId: 'herb', chance: 12.5 },
      { itemId: 'slime_jelly', chance: 12.5 },
    ],
    resistances: {
      fire: 25,
    },
    behavior: EnemyBehavior.AGGRESSIVE,
    actions: [
      { id: 'attack', type: 'attack', weight: 100 },
    ],
    spawnMaps: ['field_start', 'field_forest'],
    model: {
      path: 'models/enemies/slime_red.glb',
      scale: 0.85,
    },
  }),

  // Metal Slime (rare, high exp)
  metal_slime: createEnemyDefinition({
    id: 'metal_slime',
    name: 'メタルスライム',
    nameEn: 'Metal Slime',
    description: '非常にレアなスライム。倒すと大量の経験値を得られる。',
    category: EnemyCategory.SLIME,
    stats: {
      hp: 4,
      mp: 10,
      attack: 20,
      defense: 255,
      agility: 200,
      wisdom: 50,
    },
    exp: 1350,
    gold: 5,
    drops: [
      { itemId: 'slime_crown', chance: 0.78 },
    ],
    resistances: {
      fire: 100,
      ice: 100,
      lightning: 100,
      wind: 100,
      earth: 100,
      dark: 100,
      physical: 75,
    },
    statusResistances: {
      poison: 100,
      sleep: 100,
      paralysis: 100,
      confusion: 100,
      silence: 100,
      instant_death: 100,
    },
    behavior: EnemyBehavior.DEFENSIVE,
    actions: [
      { id: 'attack', type: 'attack', weight: 30 },
      { id: 'flee', type: 'flee', weight: 70 },
    ],
    spawnMaps: ['cave_metal', 'field_ruins'],
    spawnConditions: {
      rareSpawn: true,
      spawnChance: 1.56,
    },
    model: {
      path: 'models/enemies/metal_slime.glb',
      scale: 0.75,
    },
    visual: {
      aura: 'metallic_shine',
      deathEffect: 'shatter_metal',
    },
  }),

  // King Slime (boss)
  king_slime: createEnemyDefinition({
    id: 'king_slime',
    name: 'キングスライム',
    nameEn: 'King Slime',
    description: 'スライムたちの王。巨大な体を持つ。',
    category: EnemyCategory.BOSS,
    stats: {
      hp: 350,
      mp: 30,
      attack: 45,
      defense: 40,
      agility: 20,
      wisdom: 30,
    },
    exp: 650,
    gold: 300,
    drops: [
      { itemId: 'slime_crown', chance: 25 },
      { itemId: 'king_slime_heart', chance: 100 },
    ],
    resistances: {
      ice: -25,  // Weakness
    },
    statusResistances: {
      sleep: 50,
      instant_death: 100,
    },
    behavior: EnemyBehavior.BALANCED,
    actions: [
      { id: 'attack', type: 'attack', weight: 50 },
      {
        id: 'heavy_attack',
        type: 'skill',
        skillId: 'heavy_stomp',
        weight: 30
      },
      {
        id: 'summon',
        type: 'skill',
        skillId: 'summon_slimes',
        weight: 20,
        condition: { type: 'hp_below', value: 50 },
      },
    ],
    spawnMaps: ['dungeon_slime_castle'],
    model: {
      path: 'models/enemies/king_slime.glb',
      scale: 2.5,
    },
    visual: {
      aura: 'royal_glow',
      deathEffect: 'explode_slime',
    },
  }),

  // Slime Knight
  slime_knight: createEnemyDefinition({
    id: 'slime_knight',
    name: 'スライムナイト',
    nameEn: 'Slime Knight',
    description: 'スライムに乗った小さな騎士。意外と強い。',
    category: EnemyCategory.SLIME,
    stats: {
      hp: 55,
      mp: 8,
      attack: 42,
      defense: 38,
      agility: 30,
      wisdom: 15,
    },
    exp: 78,
    gold: 42,
    drops: [
      { itemId: 'iron_sword', chance: 3.125 },
      { itemId: 'slime_jelly', chance: 12.5 },
    ],
    behavior: EnemyBehavior.BALANCED,
    actions: [
      { id: 'attack', type: 'attack', weight: 60 },
      {
        id: 'heal_slime',
        type: 'spell',
        spellId: 'heal',
        weight: 40,
        condition: { type: 'hp_below', value: 30 },
      },
    ],
    spawnMaps: ['field_highlands', 'cave_crystal'],
    model: {
      path: 'models/enemies/slime_knight.glb',
      scale: 1.0,
    },
  }),
};

// Export all slimes as array
export const allSlimeEnemies = Object.values(slimeEnemies);

// Export enemy by ID lookup
export const getSlimeById = (id) => slimeEnemies[id] ?? null;
