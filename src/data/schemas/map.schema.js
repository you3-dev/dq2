/**
 * ============================================================================
 * Map Schema - Areas, Dungeons, Towns
 * ============================================================================
 */

import { MapType, WeatherType, createVector3 } from './types.js';

/**
 * @typedef {Object} MapConnection
 * @property {string} targetMapId - Destination map ID
 * @property {import('./types.js').Vector3} entryPoint - Position to spawn at
 * @property {number} [entryRotation] - Y rotation on entry (degrees)
 * @property {string} [transitionType] - Transition effect type
 * @property {Object} [conditions] - Access conditions
 * @property {string} [conditions.requiredItem] - Item needed to pass
 * @property {string} [conditions.requiredQuest] - Quest state needed
 * @property {string} [conditions.requiredFlag] - Game flag needed
 */

/**
 * @typedef {Object} MapTrigger
 * @property {string} id - Trigger identifier
 * @property {string} type - 'event' | 'teleport' | 'battle' | 'dialog' | 'chest'
 * @property {import('./types.js').Vector3} position - Trigger position
 * @property {import('./types.js').Vector3} size - Trigger box size
 * @property {boolean} [oneTime] - Trigger only fires once
 * @property {string} [eventId] - Event to trigger
 * @property {string} [targetMapId] - For teleport triggers
 * @property {string[]} [enemyIds] - For forced battle triggers
 * @property {string} [dialogId] - For dialog triggers
 * @property {string} [itemId] - For chest triggers
 * @property {Object} [conditions] - Activation conditions
 */

/**
 * @typedef {Object} MapSpawnPoint
 * @property {string} id - Spawn point identifier
 * @property {import('./types.js').Vector3} position - Spawn position
 * @property {number} [rotation] - Spawn rotation (degrees)
 * @property {string} [fromMapId] - Only use when coming from this map
 */

/**
 * @typedef {Object} MapEnemyEncounter
 * @property {string} enemyId - Enemy ID
 * @property {number} weight - Spawn weight (higher = more common)
 * @property {number} minCount - Minimum in group
 * @property {number} maxCount - Maximum in group
 * @property {Object} [zone] - Restrict to specific area
 * @property {import('./types.js').Vector3} [zone.min] - Zone minimum corner
 * @property {import('./types.js').Vector3} [zone.max] - Zone maximum corner
 */

/**
 * @typedef {Object} MapEnvironment
 * @property {string} skybox - Skybox texture/type
 * @property {Object} lighting - Lighting configuration
 * @property {string} lighting.ambient - Ambient light color
 * @property {number} lighting.ambientIntensity - Ambient intensity (0-1)
 * @property {string} lighting.directional - Directional light color
 * @property {number} lighting.directionalIntensity - Directional intensity
 * @property {import('./types.js').Vector3} lighting.direction - Light direction
 * @property {boolean} [lighting.castShadows] - Enable shadows
 * @property {Object} [fog] - Fog settings
 * @property {string} fog.color - Fog color
 * @property {number} fog.near - Fog start distance
 * @property {number} fog.far - Fog end distance
 * @property {keyof typeof WeatherType} [weather] - Weather effect
 * @property {string} [postProcessing] - Post-processing preset
 */

/**
 * @typedef {Object} MapAudio
 * @property {string} bgm - Background music track ID
 * @property {number} [bgmVolume] - BGM volume (0-1)
 * @property {string} [ambience] - Ambient sound track ID
 * @property {number} [ambienceVolume] - Ambience volume
 */

/**
 * @typedef {Object} MapDefinition
 * @property {string} id - Unique map identifier
 * @property {string} name - Display name (Japanese)
 * @property {string} nameEn - Display name (English)
 * @property {keyof typeof MapType} type - Map type
 * @property {string} description - Map description
 * @property {Object} model - Map 3D model
 * @property {string} model.path - Path to map GLTF model
 * @property {string} [model.collisionPath] - Separate collision mesh path
 * @property {number} [model.scale] - Model scale
 * @property {import('./types.js').Vector3} bounds - Map boundary size
 * @property {MapSpawnPoint[]} spawnPoints - Player spawn points
 * @property {Object.<string, MapConnection>} connections - Map connections by ID
 * @property {MapTrigger[]} triggers - Event triggers
 * @property {string[]} npcIds - NPCs present on this map
 * @property {boolean} [allowRandomEncounters] - Random battles enabled
 * @property {number} [encounterRate] - Steps between encounters (lower = more)
 * @property {MapEnemyEncounter[]} [encounters] - Possible enemy encounters
 * @property {MapEnvironment} environment - Environmental settings
 * @property {MapAudio} audio - Audio settings
 * @property {boolean} [allowSave] - Can save on this map
 * @property {boolean} [allowTeleport] - Can use teleport spells
 * @property {boolean} [allowEscape] - Can escape from battles
 * @property {Object} [minimap] - Minimap configuration
 * @property {string} [minimap.image] - Minimap image path
 * @property {import('./types.js').Vector3} [minimap.offset] - Minimap offset
 * @property {number} [minimap.scale] - Minimap scale
 */

/**
 * Creates a new map definition
 * @param {Partial<MapDefinition>} config
 * @returns {MapDefinition}
 */
export const createMapDefinition = (config) => ({
  id: config.id ?? 'unknown_map',
  name: config.name ?? '???',
  nameEn: config.nameEn ?? '???',
  type: config.type ?? MapType.FIELD,
  description: config.description ?? '',
  model: {
    path: config.model?.path ?? 'models/environment/default.glb',
    collisionPath: config.model?.collisionPath ?? null,
    scale: config.model?.scale ?? 1,
  },
  bounds: config.bounds ?? createVector3(100, 50, 100),
  spawnPoints: config.spawnPoints ?? [
    { id: 'default', position: createVector3(0, 0, 0), rotation: 0 },
  ],
  connections: config.connections ?? {},
  triggers: config.triggers ?? [],
  npcIds: config.npcIds ?? [],
  allowRandomEncounters: config.allowRandomEncounters ?? false,
  encounterRate: config.encounterRate ?? 30,
  encounters: config.encounters ?? [],
  environment: {
    skybox: config.environment?.skybox ?? 'day_clear',
    lighting: {
      ambient: '#ffffff',
      ambientIntensity: 0.4,
      directional: '#ffffff',
      directionalIntensity: 1.0,
      direction: createVector3(-1, -1, -1),
      castShadows: true,
      ...config.environment?.lighting,
    },
    fog: config.environment?.fog ?? null,
    weather: config.environment?.weather ?? WeatherType.CLEAR,
    postProcessing: config.environment?.postProcessing ?? null,
  },
  audio: {
    bgm: config.audio?.bgm ?? 'bgm_field',
    bgmVolume: config.audio?.bgmVolume ?? 0.7,
    ambience: config.audio?.ambience ?? null,
    ambienceVolume: config.audio?.ambienceVolume ?? 0.5,
  },
  allowSave: config.allowSave ?? true,
  allowTeleport: config.allowTeleport ?? true,
  allowEscape: config.allowEscape ?? true,
  minimap: config.minimap ?? null,
});

/**
 * Creates a town map definition
 * @param {Partial<MapDefinition>} config
 * @returns {MapDefinition}
 */
export const createTownMap = (config) =>
  createMapDefinition({
    ...config,
    type: MapType.TOWN,
    allowRandomEncounters: false,
    allowSave: true,
  });

/**
 * Creates a dungeon map definition
 * @param {Partial<MapDefinition>} config
 * @returns {MapDefinition}
 */
export const createDungeonMap = (config) =>
  createMapDefinition({
    ...config,
    type: MapType.DUNGEON,
    allowRandomEncounters: true,
    allowSave: false,
    allowTeleport: config.allowTeleport ?? false,
  });
