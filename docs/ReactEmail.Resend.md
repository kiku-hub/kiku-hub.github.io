# お問い合わせフォームのセットアップ

## 1. メールアドレスの設定

1. 送信専用アドレスの作成
   - `noreply@orcx.co.jp`（自動送信用）
2. メールの設定

   ```js
   // 開発環境
   from: 'onboarding@resend.dev',  // 開発環境用
   to: ['info@orcx.co.jp'],        // 既存の問い合わせ受信用
   replyTo: 'info@orcx.co.jp'      // 返信用

   // 本番環境
   from: 'noreply@orcx.co.jp',     // 自動送信用
   to: ['info@orcx.co.jp'],        // 既存の問い合わせ受信用
   replyTo: 'info@orcx.co.jp'      // 返信用
   ```

## 2. Resendのセットアップ

1. [Resend](https://resend.com)でアカウントを作成
2. APIキーを取得
3. 開発環境では`onboarding@resend.dev`を使用可能

## 3. 環境変数の設定

### 開発環境

`.env.development`に追加：

```
RESEND_API_KEY=re_development_key
CONTACT_TO_EMAIL=info@orcx.co.jp
```

### 本番環境

`.env.production`に追加：

```
RESEND_API_KEY=re_production_key
CONTACT_TO_EMAIL=info@orcx.co.jp
```

## 4. メール設定の使用例

```javascript
// api/contact.js
const toEmail = process.env.CONTACT_TO_EMAIL;
const fromEmail =
  process.env.NODE_ENV === "development"
    ? "onboarding@resend.dev"
    : "noreply@orcx.co.jp";

const data = await resend.emails.send({
  from: fromEmail,
  to: [toEmail],
  reply_to: toEmail, // 返信先も同じアドレス
  subject: `新しいお問い合わせ - ${company}`,
  react: ContactEmail({ ...formData }),
});
```

## 5. 本番環境への移行時

1. `contact@orcx.co.jp`のメールアドレスを作成
2. Resendでドメイン（orcx.co.jp）を追加・検証
3. DNS設定を追加（本番環境移行時に必要）

## 6. テスト手順

1. 開発環境での動作確認
   - フォームの送信テスト
   - `onboarding@resend.dev`からのメール受信確認
2. 本番環境での確認
   - カスタムドメインからのメール送信テスト
   - 返信先アドレスの確認

## Vercelへのデプロイ

1. GitHubにコードをプッシュ
2. Vercelでプロジェクトをインポート
3. フレームワークプリセット: `Vite`
4. ビルドコマンド: `npm run build`
5. 出力ディレクトリ: `dist`
6. "Deploy"をクリック
