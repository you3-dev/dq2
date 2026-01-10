# ドキュメント

## 目次

1. [技術スタック](./01-tech-stack.md) - 使用ライブラリ、ディレクトリ構成、アセット情報
2. [実装フェーズ](./02-implementation-phases.md) - 開発ロードマップと進捗
3. [デプロイ](./03-deployment.md) - GitHub Pages / Vercel / Netlify / Cloudflare の設定方法

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

## デプロイ（GitHub Pages）

1. リポジトリを GitHub にプッシュ
2. Settings > Pages > Source: `GitHub Actions` を選択
3. main ブランチにプッシュすると自動デプロイ

公開URL: `https://<username>.github.io/<repo-name>/`
