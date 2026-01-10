# ドキュメント

## 目次

1. [技術スタック](./01-tech-stack.md) - 使用ライブラリ、ディレクトリ構成、アセット情報
2. [実装フェーズ](./02-implementation-phases.md) - 開発ロードマップと進捗
3. [デプロイ](./03-deployment.md) - GitHub Pages / Vercel / Netlify / Cloudflare の設定方法
4. [データスキーマ](./04-data-schemas.md) - ゲームデータの定義方法とスキーマ

---

## クイックスタート

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

---

## プロジェクト構造

```
dq2/
├── docs/                 # ドキュメント
├── public/
│   ├── models/          # GLTFモデル
│   ├── textures/        # テクスチャ
│   └── audio/           # 音声ファイル
└── src/
    ├── components/      # Reactコンポーネント
    │   ├── game/       # 3Dゲームコンポーネント
    │   └── ui/         # UIコンポーネント
    ├── data/           # ゲームデータ定義
    │   ├── schemas/    # 型定義・スキーマ
    │   ├── npcs/       # NPCデータ
    │   ├── enemies/    # 敵データ
    │   ├── items/      # アイテムデータ
    │   ├── maps/       # マップデータ
    │   ├── quests/     # クエストデータ
    │   └── dialogs/    # 会話データ
    ├── systems/        # ゲームシステム
    ├── scenes/         # シーン管理
    ├── hooks/          # カスタムフック
    ├── stores/         # Zustand ストア
    └── constants/      # 定数
```

---

## データの追加方法

新しい敵・アイテム・NPCなどを追加する場合は、[データスキーマ](./04-data-schemas.md)を参照してください。

```javascript
// 例: 新しい敵の追加
import { createEnemyDefinition } from '@/data/schemas/enemy.schema'

export const newEnemy = createEnemyDefinition({
  id: 'goblin',
  name: { ja: 'ゴブリン', en: 'Goblin' },
  stats: { hp: 20, attack: 8, defense: 5 },
  // ...
})
```

---

## デプロイ（GitHub Pages）

1. リポジトリを GitHub にプッシュ
2. Settings > Pages > Source: `GitHub Actions` を選択
3. ブランチにプッシュすると自動デプロイ

公開URL: `https://<username>.github.io/<repo-name>/`
