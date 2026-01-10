# データスキーマガイド

## 概要

このドキュメントでは、ゲームデータの定義方法とスキーマについて説明します。
すべてのゲームデータは `src/data/` 以下で管理され、一貫したパターンで定義されています。

---

## ディレクトリ構造

```
src/data/
├── schemas/              # 型定義・スキーマ
│   ├── types.js         # 基本型・Enum定義
│   ├── character.schema.js
│   ├── enemy.schema.js
│   ├── item.schema.js
│   ├── npc.schema.js
│   ├── map.schema.js
│   ├── quest.schema.js
│   ├── dialog.schema.js
│   └── index.js
├── npcs/                # NPCデータ
│   ├── townspeople.js   # 村人NPC
│   └── index.js
├── enemies/             # 敵データ
│   ├── slimes.js        # スライム系
│   └── index.js
├── items/               # アイテムデータ
│   ├── consumables.js   # 消耗品
│   ├── weapons.js       # 武器
│   ├── armor.js         # 防具
│   └── index.js
├── maps/                # マップデータ
│   ├── starting_area.js
│   └── index.js
├── quests/              # クエストデータ
│   ├── main_quests.js
│   └── index.js
├── dialogs/             # 会話データ
│   ├── npc_dialogs.js
│   └── index.js
└── index.js             # 統合エクスポート
```

---

## 基本型・Enum (`schemas/types.js`)

### 属性タイプ

```javascript
export const ElementType = {
  NONE: 'none',
  FIRE: 'fire',
  ICE: 'ice',
  THUNDER: 'thunder',
  WIND: 'wind',
  EARTH: 'earth',
  LIGHT: 'light',
  DARK: 'dark',
}
```

### 職業タイプ

```javascript
export const JobType = {
  HERO: 'hero',
  WARRIOR: 'warrior',
  MAGE: 'mage',
  PRIEST: 'priest',
  MARTIAL_ARTIST: 'martial_artist',
  THIEF: 'thief',
  DANCER: 'dancer',
  SAGE: 'sage',
}
```

### アイテムカテゴリ

```javascript
export const ItemCategory = {
  CONSUMABLE: 'consumable',
  WEAPON: 'weapon',
  ARMOR: 'armor',
  SHIELD: 'shield',
  HELMET: 'helmet',
  ACCESSORY: 'accessory',
  KEY_ITEM: 'key_item',
  MATERIAL: 'material',
}
```

### NPCタイプ

```javascript
export const NPCType = {
  VILLAGER: 'villager',
  MERCHANT: 'merchant',
  INNKEEPER: 'innkeeper',
  GUARD: 'guard',
  QUEST_GIVER: 'quest_giver',
  SAGE: 'sage',
  KING: 'king',
}
```

---

## スキーマ定義

### アイテムスキーマ (`item.schema.js`)

```javascript
/**
 * @typedef {Object} ItemDefinition
 * @property {string} id - 一意のID
 * @property {Object} name - 名前（多言語）
 * @property {string} name.ja - 日本語名
 * @property {string} name.en - 英語名
 * @property {Object} description - 説明
 * @property {string} category - ItemCategory
 * @property {number} price - 購入価格
 * @property {number} sellPrice - 売却価格
 * @property {Object} effect - 効果
 * @property {string} modelPath - GLTFモデルパス
 * @property {string} iconPath - アイコン画像パス
 */

export function createItemDefinition(config) {
  return {
    id: config.id,
    name: {
      ja: config.name?.ja || config.name || '',
      en: config.name?.en || config.id,
    },
    description: {
      ja: config.description?.ja || config.description || '',
      en: config.description?.en || '',
    },
    category: config.category || ItemCategory.CONSUMABLE,
    price: config.price || 0,
    sellPrice: config.sellPrice || Math.floor((config.price || 0) / 2),
    effect: config.effect || {},
    modelPath: config.modelPath || null,
    iconPath: config.iconPath || null,
    stackable: config.stackable !== false,
    maxStack: config.maxStack || 99,
  }
}
```

### 敵スキーマ (`enemy.schema.js`)

```javascript
/**
 * @typedef {Object} EnemyDefinition
 * @property {string} id - 一意のID
 * @property {Object} name - 名前
 * @property {Object} stats - ステータス
 * @property {Object} rewards - 報酬
 * @property {Array} drops - ドロップアイテム
 * @property {Array} skills - 使用スキル
 * @property {Object} ai - AI行動パターン
 */

export function createEnemyDefinition(config) {
  return {
    id: config.id,
    name: {
      ja: config.name?.ja || config.name || '',
      en: config.name?.en || config.id,
    },
    stats: {
      hp: config.stats?.hp || 10,
      mp: config.stats?.mp || 0,
      attack: config.stats?.attack || 5,
      defense: config.stats?.defense || 3,
      speed: config.stats?.speed || 5,
      ...config.stats,
    },
    element: config.element || ElementType.NONE,
    resistances: config.resistances || {},
    weaknesses: config.weaknesses || {},
    rewards: {
      exp: config.rewards?.exp || 1,
      gold: config.rewards?.gold || 1,
    },
    drops: config.drops || [],
    skills: config.skills || [],
    ai: config.ai || { pattern: 'random' },
    modelPath: config.modelPath || null,
    scale: config.scale || 1,
  }
}
```

### NPCスキーマ (`npc.schema.js`)

```javascript
/**
 * @typedef {Object} NPCDefinition
 * @property {string} id - 一意のID
 * @property {Object} name - 名前
 * @property {string} type - NPCType
 * @property {string} mapId - 配置マップID
 * @property {Object} position - 位置
 * @property {string} dialogId - 会話データID
 * @property {Object} schedule - 時間別スケジュール
 * @property {Object} shop - ショップデータ（商人の場合）
 */

export function createNPCDefinition(config) {
  return {
    id: config.id,
    name: {
      ja: config.name?.ja || config.name || '',
      en: config.name?.en || config.id,
    },
    type: config.type || NPCType.VILLAGER,
    mapId: config.mapId,
    position: config.position || { x: 0, y: 0, z: 0 },
    rotation: config.rotation || 0,
    dialogId: config.dialogId || null,
    schedule: config.schedule || null,
    shop: config.shop || null,
    inn: config.inn || null,
    modelPath: config.modelPath || null,
    animations: config.animations || {},
  }
}
```

### マップスキーマ (`map.schema.js`)

```javascript
/**
 * @typedef {Object} MapDefinition
 * @property {string} id - 一意のID
 * @property {Object} name - 名前
 * @property {string} type - マップタイプ
 * @property {Object} size - サイズ
 * @property {Array} connections - 接続マップ
 * @property {Array} npcs - 配置NPC
 * @property {Array} triggers - イベントトリガー
 * @property {Object} encounter - エンカウント設定
 */

export function createMapDefinition(config) {
  return {
    id: config.id,
    name: {
      ja: config.name?.ja || config.name || '',
      en: config.name?.en || config.id,
    },
    type: config.type || 'field',
    size: config.size || { width: 100, height: 100 },
    spawnPoint: config.spawnPoint || { x: 0, y: 0, z: 0 },
    connections: config.connections || [],
    npcs: config.npcs || [],
    objects: config.objects || [],
    triggers: config.triggers || [],
    encounter: config.encounter || null,
    bgm: config.bgm || null,
    ambience: config.ambience || null,
    modelPath: config.modelPath || null,
  }
}
```

---

## データファイルの書き方

### アイテムデータ例 (`items/consumables.js`)

```javascript
import { createItemDefinition } from '../schemas/item.schema'
import { ItemCategory } from '../schemas/types'

export const consumables = [
  createItemDefinition({
    id: 'herb',
    name: { ja: 'やくそう', en: 'Medicinal Herb' },
    description: { ja: 'HPを30回復する', en: 'Restores 30 HP' },
    category: ItemCategory.CONSUMABLE,
    price: 8,
    effect: {
      type: 'heal',
      target: 'single',
      value: 30,
    },
  }),

  createItemDefinition({
    id: 'antidote',
    name: { ja: 'どくけしそう', en: 'Antidote' },
    description: { ja: '毒を治す', en: 'Cures poison' },
    category: ItemCategory.CONSUMABLE,
    price: 10,
    effect: {
      type: 'cure_status',
      status: 'poison',
    },
  }),
]

export default consumables
```

### 敵データ例 (`enemies/slimes.js`)

```javascript
import { createEnemyDefinition } from '../schemas/enemy.schema'
import { ElementType } from '../schemas/types'

export const slimes = [
  createEnemyDefinition({
    id: 'slime',
    name: { ja: 'スライム', en: 'Slime' },
    stats: {
      hp: 8,
      mp: 0,
      attack: 5,
      defense: 3,
      speed: 4,
    },
    element: ElementType.NONE,
    rewards: { exp: 1, gold: 2 },
    drops: [
      { itemId: 'herb', rate: 0.125 },
    ],
    ai: { pattern: 'random' },
    modelPath: '/models/enemies/slime.glb',
  }),

  createEnemyDefinition({
    id: 'metal_slime',
    name: { ja: 'メタルスライム', en: 'Metal Slime' },
    stats: {
      hp: 4,
      mp: 10,
      attack: 10,
      defense: 255,
      speed: 200,
    },
    rewards: { exp: 1350, gold: 5 },
    ai: {
      pattern: 'flee',
      fleeChance: 0.5,
    },
    modelPath: '/models/enemies/slime_metal.glb',
  }),
]

export default slimes
```

---

## データの使用方法

### インポート

```javascript
// 統合インポート
import { GameData, getItemById, getEnemyById, getNPCById } from '@/data'

// 個別インポート
import { consumables } from '@/data/items/consumables'
import { slimes } from '@/data/enemies/slimes'
```

### ID検索

```javascript
// アイテム取得
const herb = getItemById('herb')
console.log(herb.name.ja) // 'やくそう'

// 敵取得
const slime = getEnemyById('slime')
console.log(slime.stats.hp) // 8

// NPC取得
const elder = getNPCById('elder')
console.log(elder.name.ja) // '長老'
```

### マップ別NPC一覧

```javascript
const townNPCs = GameData.npc.getByMap('town_start')
// => [{ id: 'elder', ... }, { id: 'merchant_weapon', ... }, ...]
```

### カテゴリ別アイテム一覧

```javascript
const weapons = GameData.item.getByCategory(ItemCategory.WEAPON)
// => [{ id: 'wooden_stick', ... }, { id: 'copper_sword', ... }, ...]
```

---

## 新しいデータの追加手順

### 1. 適切なフォルダにファイルを作成

```javascript
// src/data/enemies/dragons.js
import { createEnemyDefinition } from '../schemas/enemy.schema'

export const dragons = [
  createEnemyDefinition({
    id: 'dragon',
    name: { ja: 'ドラゴン', en: 'Dragon' },
    // ...
  }),
]

export default dragons
```

### 2. インデックスファイルに追加

```javascript
// src/data/enemies/index.js
export * from './slimes'
export * from './dragons'  // 追加

import { slimes } from './slimes'
import { dragons } from './dragons'  // 追加

export const allEnemies = [
  ...slimes,
  ...dragons,  // 追加
]
```

### 3. 自動的にゲームで使用可能に

```javascript
const dragon = getEnemyById('dragon')
```

---

## ベストプラクティス

1. **ID命名規則**: 小文字スネークケース（`iron_sword`, `metal_slime`）
2. **多言語対応**: `name`と`description`は常に `{ ja, en }` オブジェクトで
3. **モデルパス**: `/models/` から始まる絶対パス
4. **ファクトリ関数使用**: 必ず `createXXXDefinition()` を使用してデータ作成
5. **カテゴリ分け**: 意味のあるファイル単位で分割（敵系統、アイテム種別など）
