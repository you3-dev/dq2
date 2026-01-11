/**
 * ============================================================================
 * Starting Area Maps - First Town and Surrounding Areas
 * ============================================================================
 */

import { createTownMap, createMapDefinition, createDungeonMap, WeatherType, MapType } from '../schemas/index.js';

/**
 * Starting town map
 */
export const townStart = createTownMap({
  id: 'town_start',
  name: 'アレフガルドの村',
  nameEn: 'Village of Alefgard',
  description: '物語が始まる平和な村。冒険者たちの出発点。',
  model: {
    path: 'models/environment/town_start.glb',
    collisionPath: 'models/environment/town_start_collision.glb',
    scale: 1,
  },
  bounds: { x: 100, y: 30, z: 100 },
  spawnPoints: [
    { id: 'default', position: { x: 0, y: 0, z: 15 }, rotation: 180 },
    { id: 'from_field', position: { x: 0, y: 0, z: 40 }, rotation: 180, fromMapId: 'field_start' },
    { id: 'from_inn', position: { x: -5, y: 0, z: 5 }, rotation: 0, fromMapId: 'inn_interior' },
    { id: 'from_elder_house', position: { x: 5, y: 0, z: 10 }, rotation: 0, fromMapId: 'elder_house_interior' },
  ],
  connections: {
    to_field: {
      targetMapId: 'field_start',
      entryPoint: { x: 0, y: 0, z: 48 },
      entryRotation: 0,
      transitionType: 'fade',
    },
    to_inn: {
      targetMapId: 'inn_interior',
      entryPoint: { x: -8, y: 0, z: 5 },
      entryRotation: 0,
      transitionType: 'door',
    },
    to_elder_house: {
      targetMapId: 'elder_house_interior',
      entryPoint: { x: 8, y: 0, z: 12 },
      entryRotation: 0,
      transitionType: 'door',
    },
  },
  triggers: [
    {
      id: 'town_entrance_event',
      type: 'event',
      position: { x: 0, y: 0, z: 40 },
      size: { x: 10, y: 5, z: 2 },
      eventId: 'first_time_leave_town',
      oneTime: true,
      conditions: {
        requiredQuest: 'main_quest_01',
        questStatus: 'in_progress',
      },
    },
  ],
  npcIds: [
    'elder_thomas',
    'weapon_merchant_bran',
    'item_merchant_lina',
    'innkeeper_martha',
    'villager_old_man',
    'guard_captain_rex',
  ],
  environment: {
    skybox: 'day_clear',
    lighting: {
      ambient: '#fffaf0',
      ambientIntensity: 0.5,
      directional: '#fffff0',
      directionalIntensity: 1.0,
      direction: { x: -0.5, y: -1, z: -0.5 },
      castShadows: true,
    },
    weather: WeatherType.CLEAR,
  },
  audio: {
    bgm: 'bgm_town_peaceful',
    bgmVolume: 0.6,
    ambience: 'ambience_village',
    ambienceVolume: 0.3,
  },
  minimap: {
    image: 'textures/minimaps/town_start.png',
    offset: { x: 0, y: 0, z: 0 },
    scale: 1,
  },
});

/**
 * Starting field map
 */
export const fieldStart = createMapDefinition({
  id: 'field_start',
  name: '草原',
  nameEn: 'Grasslands',
  type: MapType.FIELD,
  description: '村の周辺に広がる穏やかな草原。弱い敵が出現する。',
  model: {
    path: 'models/environment/field_grassland.glb',
    collisionPath: 'models/environment/field_grassland_collision.glb',
    scale: 1,
  },
  bounds: { x: 500, y: 50, z: 500 },
  spawnPoints: [
    { id: 'from_town', position: { x: 0, y: 0, z: 50 }, rotation: 0, fromMapId: 'town_start' },
    { id: 'from_cave', position: { x: 100, y: 0, z: 100 }, rotation: 90, fromMapId: 'cave_beginner' },
    { id: 'from_forest', position: { x: -100, y: 0, z: 150 }, rotation: 270, fromMapId: 'field_forest' },
  ],
  connections: {
    to_town: {
      targetMapId: 'town_start',
      entryPoint: { x: 0, y: 0, z: 60 },
      entryRotation: 180,
      transitionType: 'fade',
    },
    to_cave: {
      targetMapId: 'cave_beginner',
      entryPoint: { x: 0, y: 0, z: 2 },
      entryRotation: 0,
      transitionType: 'cave_enter',
    },
    to_forest: {
      targetMapId: 'field_forest',
      entryPoint: { x: 45, y: 0, z: 0 },
      entryRotation: 90,
      transitionType: 'fade',
    },
  },
  triggers: [
    {
      id: 'treasure_chest_01',
      type: 'chest',
      position: { x: 50, y: 0, z: 30 },
      size: { x: 2, y: 2, z: 2 },
      itemId: 'herb',
      oneTime: true,
    },
  ],
  npcIds: [],
  allowRandomEncounters: true,
  encounterRate: 40,
  encounters: [
    { enemyId: 'slime', weight: 60, minCount: 1, maxCount: 3 },
    { enemyId: 'slime_red', weight: 30, minCount: 1, maxCount: 2 },
    {
      enemyId: 'metal_slime',
      weight: 1,
      minCount: 1,
      maxCount: 1,
      zone: {
        min: { x: 100, y: 0, z: 100 },
        max: { x: 200, y: 50, z: 200 },
      },
    },
  ],
  environment: {
    skybox: 'day_clear',
    lighting: {
      ambient: '#f0f8ff',
      ambientIntensity: 0.4,
      directional: '#fffacd',
      directionalIntensity: 1.2,
      direction: { x: -0.3, y: -1, z: -0.3 },
      castShadows: true,
    },
    fog: {
      color: '#e8f4ff',
      near: 100,
      far: 400,
    },
    weather: WeatherType.CLEAR,
  },
  audio: {
    bgm: 'bgm_field_adventure',
    bgmVolume: 0.7,
    ambience: 'ambience_grassland',
    ambienceVolume: 0.4,
  },
  allowSave: true,
  allowTeleport: true,
  allowEscape: true,
});

/**
 * Beginner cave/dungeon
 */
export const caveBeginner = createDungeonMap({
  id: 'cave_beginner',
  name: '始まりの洞窟',
  nameEn: 'Beginner\'s Cave',
  description: '村の近くにある小さな洞窟。冒険者の最初の試練。',
  model: {
    path: 'models/environment/cave_beginner.glb',
    collisionPath: 'models/environment/cave_beginner_collision.glb',
    scale: 1,
  },
  bounds: { x: 80, y: 20, z: 120 },
  spawnPoints: [
    { id: 'entrance', position: { x: 0, y: 0, z: 2 }, rotation: 180 },
    { id: 'from_field', position: { x: 0, y: 0, z: 2 }, rotation: 180, fromMapId: 'field_start' },
  ],
  connections: {
    to_field: {
      targetMapId: 'field_start',
      entryPoint: { x: 100, y: 0, z: 100 },
      entryRotation: 90,
      transitionType: 'cave_exit',
    },
  },
  triggers: [
    {
      id: 'treasure_iron_sword',
      type: 'chest',
      position: { x: 30, y: 0, z: 80 },
      size: { x: 2, y: 2, z: 2 },
      itemId: 'iron_sword',
      oneTime: true,
    },
    {
      id: 'boss_trigger',
      type: 'battle',
      position: { x: 0, y: 0, z: 100 },
      size: { x: 15, y: 10, z: 5 },
      enemyIds: ['king_slime'],
      oneTime: true,
      conditions: {
        requiredQuest: 'main_quest_01',
      },
    },
  ],
  npcIds: [],
  allowRandomEncounters: true,
  encounterRate: 25,
  encounters: [
    { enemyId: 'slime', weight: 50, minCount: 2, maxCount: 4 },
    { enemyId: 'slime_red', weight: 40, minCount: 1, maxCount: 3 },
    { enemyId: 'slime_knight', weight: 10, minCount: 1, maxCount: 1 },
  ],
  environment: {
    skybox: 'cave_dark',
    lighting: {
      ambient: '#2a2a3a',
      ambientIntensity: 0.2,
      directional: '#4a4a6a',
      directionalIntensity: 0.3,
      direction: { x: 0, y: -1, z: 0 },
      castShadows: false,
    },
    fog: {
      color: '#1a1a2a',
      near: 5,
      far: 40,
    },
  },
  audio: {
    bgm: 'bgm_dungeon_mystery',
    bgmVolume: 0.6,
    ambience: 'ambience_cave_drip',
    ambienceVolume: 0.5,
  },
  allowSave: false,
  allowTeleport: false,
  allowEscape: true,
});

/**
 * Inn Interior
 */
export const innInterior = createMapDefinition({
  id: 'inn_interior',
  name: '宿屋',
  nameEn: 'Alefgard Inn',
  type: MapType.TOWN, // or custom INTERIOR type if added
  description: '旅の疲れを癒やす宿屋。暖かい暖炉がある。',
  model: {
    path: 'models/environment/inn_interior.glb', // Placeholder if not exist, will fallback
    scale: 1,
  },
  spawnPoints: [
    { id: 'default', position: { x: 0, y: 0, z: -5 }, rotation: 0 },
    { id: 'from_town', position: { x: 0, y: 0, z: -5 }, rotation: 0, fromMapId: 'town_start' },
  ],
  connections: {
    to_town: {
      targetMapId: 'town_start',
      entryPoint: { x: 0, y: 0, z: -8 }, // Exit point inside
      spawnPointId: 'from_inn',
      transitionType: 'door',
    },
  },
  npcIds: ['innkeeper_martha'],
  environment: {
    lighting: {
      ambient: '#ffaa44',
      ambientIntensity: 0.8,
    },
  },
});

/**
 * Elder's House Interior
 */
export const elderHouseInterior = createMapDefinition({
  id: 'elder_house_interior',
  name: '長老の家',
  nameEn: 'Elder\'s House',
  type: MapType.TOWN,
  description: '村の長老、トーマスの家。古い書物が並んでいる。',
  model: {
    path: 'models/environment/elder_house_interior.glb',
    scale: 1,
  },
  spawnPoints: [
    { id: 'default', position: { x: 0, y: 0, z: -5 }, rotation: 0 },
    { id: 'from_town', position: { x: 0, y: 0, z: -5 }, rotation: 0, fromMapId: 'town_start' },
  ],
  connections: {
    to_town: {
      targetMapId: 'town_start',
      entryPoint: { x: 0, y: 0, z: -8 },
      spawnPointId: 'from_elder_house',
      transitionType: 'door',
    },
  },
  npcIds: ['elder_thomas'],
});

// Export all starting area maps
export const startingAreaMaps = {
  town_start: townStart,
  field_start: fieldStart,
  cave_beginner: caveBeginner,
  inn_interior: innInterior,
  elder_house_interior: elderHouseInterior,
};

// Export map by ID lookup
export const getMapById = (id) => startingAreaMaps[id] ?? null;
