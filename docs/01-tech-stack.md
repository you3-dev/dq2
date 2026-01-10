# ドラクエ風TPS 3Dゲーム - 技術スタックドキュメント

## プロジェクト概要

ブラウザベース・スマホ対応のドラクエ7/8風TPSビューの3D RPGゲーム。
キャラクター後方斜め上からのカメラ視点で、フィールド探索が可能。

---

## 技術スタック

### コアライブラリ

| ライブラリ | バージョン | 用途 |
|-----------|-----------|------|
| **React** | 18.x | UIフレームワーク |
| **Three.js** | 0.170+ | 3Dレンダリングエンジン |
| **@react-three/fiber** | 8.x | React向けThree.jsラッパー |
| **@react-three/drei** | 9.x | R3F用ヘルパー・コンポーネント集 |

### 追加ライブラリ

| ライブラリ | 用途 |
|-----------|------|
| **zustand** | 軽量状態管理（ゲーム状態、インベントリ） |
| **@react-three/rapier** | 物理エンジン（衝突判定、重力） |
| **howler.js** | BGM・効果音 |

---

## ディレクトリ構成（大規模プロジェクト対応）

```
project-root/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Pages デプロイ設定
├── docs/                     # ドキュメント
│
├── public/                   # 静的アセット
│   ├── models/              # GLTFモデル (.glb)
│   │   ├── characters/      # プレイヤーキャラクター
│   │   ├── npcs/           # NPC
│   │   ├── enemies/        # 敵モンスター
│   │   ├── environment/    # 環境・マップオブジェクト
│   │   ├── items/          # アイテム
│   │   └── effects/        # エフェクト
│   ├── textures/           # テクスチャ画像
│   │   ├── characters/
│   │   ├── environment/
│   │   └── ui/
│   └── audio/              # 音声
│       ├── bgm/            # BGM
│       ├── sfx/            # 効果音
│       └── voice/          # ボイス
│
└── src/
    ├── components/          # Reactコンポーネント
    │   ├── game/           # ゲーム3Dコンポーネント
    │   │   ├── Player.jsx
    │   │   ├── Camera.jsx
    │   │   ├── World.jsx
    │   │   ├── NPC.jsx
    │   │   └── Enemy.jsx
    │   └── ui/             # UI コンポーネント
    │       ├── HUD.jsx
    │       ├── Dialog.jsx
    │       ├── Menu.jsx
    │       └── VirtualJoystick.jsx
    │
    ├── data/               # ゲームデータ定義
    │   ├── schemas/        # 型定義・スキーマ
    │   │   ├── types.js           # 基本型・Enum
    │   │   ├── character.schema.js
    │   │   ├── enemy.schema.js
    │   │   ├── item.schema.js
    │   │   ├── npc.schema.js
    │   │   ├── map.schema.js
    │   │   ├── quest.schema.js
    │   │   ├── dialog.schema.js
    │   │   └── index.js
    │   ├── npcs/           # NPCデータ
    │   ├── enemies/        # 敵データ
    │   ├── items/          # アイテムデータ
    │   ├── maps/           # マップデータ
    │   ├── quests/         # クエストデータ
    │   ├── dialogs/        # 会話データ
    │   └── index.js        # 統合エクスポート
    │
    ├── systems/            # ゲームシステム
    │   ├── battle/         # バトルシステム
    │   ├── quest/          # クエストシステム
    │   ├── dialog/         # 会話システム
    │   ├── inventory/      # インベントリ
    │   ├── save/           # セーブシステム
    │   └── index.js
    │
    ├── scenes/             # シーン管理
    │   ├── TitleScene.jsx
    │   ├── FieldScene.jsx
    │   ├── BattleScene.jsx
    │   └── index.js
    │
    ├── hooks/              # カスタムフック
    │   ├── usePlayerControls.js
    │   ├── useCamera.js
    │   └── useGameState.js
    │
    ├── stores/             # Zustand ストア
    │   └── gameStore.js
    │
    ├── constants/          # 定数
    │   └── config.js
    │
    ├── utils/              # ユーティリティ
    │   ├── collision.js
    │   └── animation.js
    │
    ├── App.jsx
    └── main.jsx
```

---

## データスキーマ設計

### 基本型 (`src/data/schemas/types.js`)

```javascript
// 属性タイプ
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

// 職業タイプ
export const JobType = {
  HERO: 'hero',
  WARRIOR: 'warrior',
  MAGE: 'mage',
  PRIEST: 'priest',
  // ...
}

// アイテムカテゴリ
export const ItemCategory = {
  CONSUMABLE: 'consumable',
  WEAPON: 'weapon',
  ARMOR: 'armor',
  ACCESSORY: 'accessory',
  KEY_ITEM: 'key_item',
}
```

### データ使用例

```javascript
// データのインポート
import { getItemById, getEnemyById, getMapById, GameData } from '@/data'

// アイテム取得
const herb = getItemById('herb')

// 敵取得
const slime = getEnemyById('slime')

// マップ内のNPC一覧取得
const npcsInTown = GameData.npc.getByMap('town_start')
```

---

## GLTFモデル関連

### ローダー設定

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
```

### React Three Fiberでの読み込み

```javascript
import { useGLTF, useAnimations } from '@react-three/drei'

function Character() {
  const { scene, animations } = useGLTF('/models/characters/hero.glb')
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    actions['walk']?.play()
  }, [actions])

  return <primitive object={scene} />
}

useGLTF.preload('/models/characters/hero.glb')
```

### モデルファイル命名規則

```
/models/
  characters/
    hero.glb              # プレイヤーキャラクター
    hero_animations.glb   # アニメーション別ファイル（オプション）
  npcs/
    elder.glb             # 長老
    merchant_weapon.glb   # 武器屋
  enemies/
    slime.glb
    slime_metal.glb
    dragon_boss.glb
  environment/
    tree_oak.glb
    house_village.glb
    dungeon_entrance.glb
```

---

## 無料アセットソース

### キャラクター・モンスター

| サイト | URL | 特徴 |
|--------|-----|------|
| **Quaternius** | https://quaternius.com | CC0、ローポリRPGアセット |
| **Mixamo** | https://mixamo.com | キャラ＋アニメーション自動適用 |
| **Kenney** | https://kenney.nl/assets | CC0、ゲーム向け |
| **Sketchfab** | https://sketchfab.com | 高品質、要ライセンス確認 |

### 推奨パック（Quaternius）

- **Ultimate Animated Character Pack** - キャラクター
- **Ultimate Fantasy Pack** - ファンタジー環境
- **Ultimate Monsters Pack** - モンスター

---

## カメラ設定（ドラクエ風）

```javascript
const CAMERA_CONFIG = {
  distance: 10,        // キャラからの距離
  height: 6,           // 高さ
  fov: 60,             // 視野角
  lookAtOffset: 1.5,   // 注視点のY軸オフセット
  smoothing: 0.1,      // 追従の滑らかさ
  rotationSpeed: 0.02, // 回転速度
}
```

---

## モバイル対応

### タッチ操作

- **左側エリア**: バーチャルジョイスティック（移動）
- **右側エリア**: スワイプ（カメラ回転）
- **ボタン**: アクション、メニュー

### パフォーマンス考慮

- ローポリモデル使用（10,000ポリゴン以下推奨）
- テクスチャサイズ制限（512x512 or 1024x1024）
- LOD（Level of Detail）実装検討
- オブジェクトプーリング

---

## 参考リンク

- [Three.js 公式ドキュメント](https://threejs.org/docs/)
- [React Three Fiber ドキュメント](https://docs.pmnd.rs/react-three-fiber)
- [Drei ヘルパー一覧](https://github.com/pmndrs/drei)
- [GLTF フォーマット仕様](https://www.khronos.org/gltf/)

---

## 注意事項

- GLTFモデルのライセンスは各自確認すること
- Mixamoはアカウント作成が必要（無料）
- モバイルではWebGLの制限があるため、シーン内オブジェクト数に注意
- iOS Safariではオーディオの自動再生に制限あり
