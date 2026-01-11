# 物理演算・地形・衝突判定の安定実装計画

## 現状の問題点

1.  **キャラクターの埋没**: フィールドマップに起伏があるが、プレイヤーのY座標が固定されているため、地面に埋まって見える。
2.  **@react-three/rapier の不安定性**: 以前の実装で `RigidBody` や `CapsuleCollider` を使用した際、React の ref 処理との相性問題で警告が発生し、最終的にプレイヤーが表示されなくなった。
3.  **すり抜け**: 現在、NPCや建物、噴水などに対する衝突判定がない。

## 提案するアプローチ: 「レイキャスト + シンプルAABB」方式

> [!IMPORTANT]
> 物理エンジン（Rapier）のフル統合は複雑でエラーが発生しやすいため、**軽量かつ安定した代替手法**を採用します。

### コア原則
1.  **物理エンジンに頼らない**: `@react-three/rapier` は使用せず、Three.jsのレイキャストとシンプルなAABB（軸平行境界ボックス）衝突検出を使用する。
2.  **スマホブラウザ対応**: 重い物理演算を避け、計算コストの低い方法を優先する。
3.  **段階的な実装**: 各機能を小さなステップで実装し、各ステップ後にテストを行う。

---

## Phase 1: 地形追従（Terrain Snapping）

**目的**: プレイヤーとNPCが地形の起伏に沿って正しい高さに配置されるようにする。

### 技術的アプローチ
*   Three.js の `Raycaster` を使用して、キャラクターの現在の XZ 座標から下方向にレイを飛ばし、地面との交点を検出する。
*   交点の Y 座標をキャラクター의 Y 座標として設定する。

### 変更対象ファイル
| ファイル | 変更内容 |
|---|---|
| src/components/game/Player.jsx | `useFrame` 内でレイキャストを実行し、Y座標を更新。 |
| src/components/game/FieldMap.jsx | 地面メッシュに `name="ground"` を付与してレイキャスト対象として識別可能にする。 |
| src/components/game/World.jsx | 町の地面にも `name="ground"` を付与。 |

### 実装の詳細 (Player.jsx)
```javascript
// useFrame 内
const raycaster = new THREE.Raycaster()
const origin = new THREE.Vector3(groupRef.current.position.x, 100, groupRef.current.position.z)
raycaster.set(origin, new THREE.Vector3(0, -1, 0))

// シーン内の 'ground' という名前のメッシュを探して交差判定
const groundMeshes = [] // シーンから動的に取得するか、コンテキストで共有
const intersects = raycaster.intersectObjects(groundMeshes)
if (intersects.length > 0) {
  groupRef.current.position.y = intersects[0].point.y
}
```

---

## Phase 2: AABB 衝突検出（すり抜け防止）

**目的**: プレイヤーがNPC、噴水、建物などをすり抜けないようにする。

### 技術的アプローチ
*   各オブジェクト（NPC、噴水、建物など）に対して、**軸平行境界ボックス（AABB）** を定義する。
*   プレイヤーの移動ベクトルを計算し、移動先がAABBと交差する場合、移動を制限する。

### 変更対象ファイル
| ファイル | 変更内容 |
|---|---|
| src/stores/gameStore.js | 衝突オブジェクトのリスト（AABBデータ）を管理するステートを追加。 |
| src/components/game/Player.jsx | `useFrame` 内でAABB衝突チェックを実行。 |
| src/components/game/World.jsx | 各 Prop コンポーネントがロード時に自身のAABBをストアに登録。 |
| src/components/game/NPC.jsx | NPCがロード時に自身のAABBをストアに登録。 |

### 実装の詳細 (概念)
```javascript
// gameStore.js
colliders: [], // { id: string, box3: THREE.Box3 }[]
registerCollider: (id, box3) => set(state => ({ colliders: [...state.colliders, { id, box3 }] })),
unregisterCollider: (id) => set(state => ({ colliders: state.colliders.filter(c => c.id !== id) })),

// Player.jsx useFrame 内
const nextPosition = new THREE.Vector3(...)
const playerAABB = new THREE.Box3().setFromCenterAndSize(nextPosition, new THREE.Vector3(0.8, 1.8, 0.8))

for (const collider of colliders) {
  if (playerAABB.intersectsBox(collider.box3)) {
    // 衝突が発生 → 移動をキャンセルまたは押し戻し
    return
  }
}
groupRef.current.position.copy(nextPosition)
```

---

## Phase 3: 段差の乗り越え（Step Climbing）

**目的**: 低い段差（例：縁石）を自動的に乗り越えられるようにする。

### 技術的アプローチ
*   レイキャストを2つ使用する:
    1.  足元レイ: 現在の足元の高さを検出。
    2.  前方レイ: 進行方向の少し前の地面の高さを検出。
*   前方の地面が足元より少しだけ高い場合（例: 0.5ユニット以内）、プレイヤーのY座標を滑らかに補間して「乗り越え」る。

---

## 検証計画

### 自動テスト（なし）
*   3Dレンダリングの自動テストは複雑なため、手動検証を優先。

### 手動検証チェックリスト
| 項目 | 期待される結果 |
|---|---|
| フィールドでの地形追従 | プレイヤーが丘を登り降りする際、地面に沿って高さが変化する。 |
| 町での地面配置 | プレイヤーがタイル地面に正しく立つ（埋まらない）。 |
| NPC衝突 | プレイヤーがNPCをすり抜けずに止まる。 |
| 噴水衝突 | プレイヤーが噴水の縁で止まる。 |
| 建物衝突 | プレイヤーが建物の壁で止まる。 |
| モバイルブラウザ | スマートフォンのChromeで60FPS近くで動作する。 |

---

## 実装の優先順位

1.  **Phase 1 (地形追従)**: **最優先**。現在の「埋没」問題を解決。
2.  **Phase 2 (AABB衝突)**: 次に優先。すり抜けを防ぐ。
3.  **Phase 3 (段差乗り越え)**: 任意拡張。没入感を高める。

---

## 依存ライブラリの変更

*   **削除**: `@react-three/rapier` （プロジェクトから削除済み）。
*   **追加**: なし。Three.js のコア機能のみを使用。
