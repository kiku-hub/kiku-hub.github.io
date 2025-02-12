# Resend と React Email によるメール送信セットアップ

## 前提条件
- Node.js (v18 以降)
- npm または yarn
- Resend API キー

## 注意事項（Resendのテスト制限）
Resendのテスト環境では、以下の制限があります：
- テストメールは、Resendアカウントに登録されているメールアドレスにのみ送信可能
- 他のメールアドレスに送信するには、カスタムドメインの検証が必要

## インストール

1. 必要な依存関係をインストール:
```bash
npm install resend @react-email/components @react-email/tailwind
```

## 設定

1. Resend API キーを `.env` ファイルに設定:
```
RESEND_API_KEY=your_resend_api_key_here
```

## メールテンプレートの作成

プロジェクト内に React Email テンプレートを作成します。
例: `components/EmailTemplate.tsx`

## メール送信

サーバーサイドのコードで Resend API を使用してメールを送信:

```typescript
import { Resend } from 'resend';
import { EmailTemplate } from '../components/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(formData, recipient) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [recipient], // テスト中は自分のメールアドレスを使用
      subject: 'お問い合わせフォーム送信',
      react: EmailTemplate(formData),
    });

    if (error) {
      console.error({ error });
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('メール送信に失敗:', error);
    return { success: false, error };
  }
}
```

## ローカルテスト

1. 有効な Resend API キーを確認
2. テストメールの送信先を自分のメールアドレスに設定
3. ローカル開発サーバーを起動
4. メール送信機能をテスト

## トラブルシューティング

- Resend API キーを確認
- テストメールの送信先が Resend アカウントのメールアドレスであることを確認
- カスタムドメインの検証が必要な場合は、Resend ダッシュボードで設定
- ネットワーク接続を確認
- Resend ドキュメントで特定の要件を確認
