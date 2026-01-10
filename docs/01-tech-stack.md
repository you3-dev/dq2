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

### 追加ライブラリ（必要に応じて）

| ライブラリ | 用途 |
|-----------|------|
| **@react-three/rapier** | 物理エンジン（衝突判定、重力） |
| **zustand** | 軽量状態管理（ゲーム状態、インベントリ） |
| **howler.js** | BGM・効果音 |
| **leva** | 開発用デバッグUI |

---

## ディレクトリ構成

```
project-root/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Pages デプロイ設定
├── docs/                  # ドキュメント
├── public/
│   ├── models/           # GLTFモデル (.glb)
│   │   ├── characters/
│   │   ├── enemies/
│   │   ├── environment/
│   │   └── items/
│   ├── textures/         # テクスチャ画像
│   └── audio/            # BGM・効果音
├── src/
│   ├── components/
│   │   ├── game/
│   │   │   ├── Player.jsx
│   │   │   ├── Camera.jsx
│   │   │   ├── World.jsx
│   │   │   ├── NPC.jsx
│   │   │   └── Enemy.jsx
│   │   └── ui/
│   │       ├── HUD.jsx
│   │       ├── Dialog.jsx
│   │       ├── Menu.jsx
│   │       └── VirtualJoystick.jsx
│   ├── hooks/
│   │   ├── usePlayerControls.js
│   │   ├── useCamera.js
│   │   └── useGameState.js
│   ├── stores/
│   │   └── gameStore.js      # zustand store
│   ├── utils/
│   │   ├── collision.js
│   │   └── animation.js
│   ├── constants/
│   │   └── config.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## GLTFモデル関連

### ローダー設定

```javascript
// GLTFLoader + DRACOLoader（圧縮モデル対応）
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

// プリロード
useGLTF.preload('/models/characters/hero.glb')
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

### 環境・建物

| サイト | URL | 特徴 |
|--------|-----|------|
| **Quaternius** | https://quaternius.com | ファンタジー建物、自然物 |
| **Poly Pizza** | https://poly.pizza | シンプルローポリ |
| **Kenney** | https://kenney.nl | 建物、道、小物 |

### 推奨パック（Quaternius）

- **Ultimate Animated Character Pack** - キャラクター
- **Ultimate Fantasy Pack** - ファンタジー環境
- **Ultimate Monsters Pack** - モンスター

---

## カメラ設定（ドラクエ風）

```javascript
// 推奨パラメータ
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
- [Mixamo 使い方ガイド](https://helpx.adobe.com/creative-cloud/help/mixamo.html)

---

## 注意事項

- GLTFモデルのライセンスは各自確認すること
- Mixamoはアカウント作成が必要（無料）
- モバイルではWebGLの制限があるため、シーン内オブジェクト数に注意
- iOS Safariではオーディオの自動再生に制限あり
