# デプロイ環境ガイド

このプロジェクトはビルド後に静的ファイル（HTML, JS, CSS）のみで動作するため、
様々な無料ホスティングサービスで公開可能です。

---

## GitHub Pages（推奨）

### 特徴
- GitHubリポジトリと直接連携
- 無料（publicリポジトリ）
- GitHub Actionsで自動デプロイ

### 設定手順

1. **リポジトリをGitHubにプッシュ**

2. **GitHub Pagesを有効化**
   - リポジトリの `Settings` > `Pages` に移動
   - Source: `GitHub Actions` を選択

3. **mainブランチにプッシュ**
   - `.github/workflows/deploy.yml` が自動実行される
   - ビルド → デプロイが自動で行われる

4. **公開URL**
   ```
   https://<username>.github.io/<repository-name>/
   ```

### ワークフロー設定

`.github/workflows/deploy.yml` で以下を実行:
1. Node.js 20でセットアップ
2. `npm ci` で依存関係インストール
3. `npm run build` でビルド
4. `dist/` フォルダをGitHub Pagesにデプロイ

### 注意事項
- mainブランチへのプッシュでデプロイされる
- ビルド時に自動でベースパスが設定される（`vite.config.js`）

---

## Vercel

### 特徴
- 最も簡単なセットアップ
- GitHubと連携で自動デプロイ
- プレビュー環境も自動生成
- 無料プランで十分

### 設定手順

1. [vercel.com](https://vercel.com) にGitHubアカウントでログイン
2. `Add New Project` をクリック
3. GitHubリポジトリを選択
4. フレームワークは自動検出（Vite）
5. `Deploy` をクリック

### 公開URL
```
https://<project-name>.vercel.app
```

### カスタムドメイン
Settings > Domains から無料で設定可能

---

## Netlify

### 特徴
- ドラッグ&ドロップでもデプロイ可能
- GitHubとも連携可能
- フォーム機能など追加機能あり

### 設定手順（GitHub連携）

1. [netlify.com](https://www.netlify.com) にログイン
2. `Add new site` > `Import an existing project`
3. GitHubを選択、リポジトリを選ぶ
4. Build command: `npm run build`
5. Publish directory: `dist`
6. `Deploy site` をクリック

### 設定手順（手動デプロイ）

1. ローカルで `npm run build` を実行
2. Netlifyダッシュボードに `dist` フォルダをドラッグ&ドロップ

### 公開URL
```
https://<random-name>.netlify.app
```

---

## Cloudflare Pages

### 特徴
- 高速なCDN
- 無制限の帯域幅
- 無料SSL

### 設定手順

1. [pages.cloudflare.com](https://pages.cloudflare.com) にログイン
2. `Create a project` > `Connect to Git`
3. GitHubリポジトリを選択
4. Framework preset: `Vite`
5. Build command: `npm run build`
6. Build output directory: `dist`
7. `Save and Deploy`

### 公開URL
```
https://<project-name>.pages.dev
```

---

## 比較表

| サービス | セットアップ難易度 | 自動デプロイ | カスタムドメイン | 特徴 |
|---------|-----------------|------------|----------------|------|
| **GitHub Pages** | 中 | ○ | ○ | GitHubと一体 |
| **Vercel** | 低 | ○ | ○ | 最も簡単 |
| **Netlify** | 低 | ○ | ○ | ドラッグ&ドロップ可 |
| **Cloudflare** | 中 | ○ | ○ | 高速CDN |

---

## ローカルでのビルド確認

デプロイ前にローカルで動作確認:

```bash
# ビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

ブラウザで `http://localhost:4173` にアクセスして確認。

---

## トラブルシューティング

### 画面が真っ白になる
- ベースパスの設定を確認
- ブラウザのコンソールでエラーを確認

### アセットが読み込めない
- パスが正しいか確認（相対パス vs 絶対パス）
- GitHub Pagesの場合、ベースパスがリポジトリ名になっているか確認

### WebGLエラー
- 古いブラウザやモバイルデバイスでは動作しない場合あり
- 対応ブラウザ: Chrome, Firefox, Safari, Edge（最新版）
