# お問い合わせフォーム 要件定義書

## 1. システム構成

### 1.1 技術スタック

- フロントエンド: React + Framer Motion
- フォーム管理: react-hook-form
- メール送信: Google Apps Script (GAS)
- スタイリング: Tailwind CSS
- ホスティング: さくらレンタルサーバー
- バックエンド: Google Apps Script

### 1.2 環境変数

```
VITE_GAS_DEPLOYMENT_URL=
```

## 2. 機能要件

### 2.1 入力フォーム項目とバリデーション

1. お問い合わせ種別（必須）

   - セレクトボックス
   - バリデーション: `required: "お問い合わせ種別を選択してください"`
   - 選択肢:
     - 提供サービスについて
     - SES 協業について
     - システム開発の依頼について
     - その他

2. 会社名/組織名（任意）

   - テキスト入力
   - バリデーション: `maxLength: { value: 100, message: "会社名/組織名は100文字以内で入力してください" }`

3. お名前（必須）

   - テキスト入力
   - バリデーション:
     ```javascript
     {
       required: "お名前を入力してください",
       maxLength: {
         value: 50,
         message: "お名前は50文字以内で入力してください"
       }
     }
     ```

4. フリガナ（必須）

   - テキスト入力
   - バリデーション:
     ```javascript
     {
       required: "フリガナを入力してください",
       pattern: {
         value: /^[ァ-ヶー\s]+$/,
         message: "フリガナは全角カタカナで入力してください"
       },
       maxLength: {
         value: 50,
         message: "フリガナは50文字以内で入力してください"
       }
     }
     ```

5. 電話番号（必須）

   - テキスト入力
   - バリデーション:
     ```javascript
     {
       required: "電話番号を入力してください",
       pattern: {
         value: /^0[0-9]{9,10}$/,
         message: "正しい電話番号の形式で入力してください（例：03-1234-5678）"
       }
     }
     ```

6. メールアドレス（必須）

   - テキスト入力
   - バリデーション:
     ```javascript
     {
       required: "メールアドレスを入力してください",
       pattern: {
         value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
         message: "正しいメールアドレスの形式で入力してください"
       },
       maxLength: {
         value: 256,
         message: "メールアドレスは256文字以内で入力してください"
       }
     }
     ```

7. お問い合わせ内容（必須）

   - テキストエリア（6 行）
   - バリデーション:
     ```javascript
     {
       required: "お問い合わせ内容を入力してください",
       minLength: {
         value: 10,
         message: "お問い合わせ内容は10文字以上で入力してください"
       },
       maxLength: {
         value: 1000,
         message: "お問い合わせ内容は1000文字以内で入力してください"
       }
     }
     ```

8. プライバシーポリシー同意（必須）
   - チェックボックス
   - モーダル表示（スクロールで確認必須）
   - バリデーション: `required: "プライバシーポリシーへの同意が必要です"`

## 3. Google Apps Script 実装

### 3.1 GAS エンドポイント設定

```javascript
function doPost(e) {
  // CORSの設定
  const headers = {
    "Access-Control-Allow-Origin": "https://orcx.co.jp",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const data = JSON.parse(e.postData.contents);

    // 管理者通知メール送信
    sendAdminNotification(data);

    // 自動返信メール送信
    sendAutoReply(data);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success" })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}
```

### 3.2 メール送信関数

```javascript
function sendAdminNotification(data) {
  const subject = `【問い合わせ】${getInquiryTypeLabel(data.type)}について`;
  const body = createAdminEmailBody(data);

  MailApp.sendEmail({
    to: "info@orcx.co.jp",
    subject: subject,
    body: body,
  });
}

function sendAutoReply(data) {
  const subject = "【ORCX】お問い合わせありがとうございます";
  const body = createAutoReplyBody(data);

  MailApp.sendEmail({
    to: data.email,
    from: "autoreply@orcx.co.jp",
    subject: subject,
    body: body,
  });
}
```

### 3.3 デプロイメント設定

1. 新規デプロイメント作成
2. アクセス権限: 全員（匿名ユーザーを含む）
3. 実行 API の有効化

## 4. セキュリティ

- CORS によるオリジン制限
- GAS のクォータ制限の考慮
- リクエスト制限の実装
- 入力値のサニタイズ

## 5. エラーハンドリング

- GAS でのエラーログ記録
- フロントエンドでのエラー表示
- タイムアウト処理
- 再試行メカニズム

## 6. 会社情報

```
ORCX株式会社
〒158-0097
東京都世田谷区用賀4-18-7
Email: info@orcx.co.jp
URL: https://www.orcx.co.jp
```
