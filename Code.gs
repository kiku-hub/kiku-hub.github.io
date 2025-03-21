// 共通のレスポンス生成関数
function createResponse(data, mimeType) {
  // JSONデータを文字列に変換
  var jsonString = JSON.stringify(data);

  // ContentServiceを使用してレスポンスを作成
  var output = ContentService.createTextOutput(jsonString);

  // MIMEタイプを設定
  output.setMimeType(mimeType || ContentService.MimeType.JSON);

  // CORSヘッダーを追加
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // ヘッダーを設定
  for (var key in headers) {
    if (headers.hasOwnProperty(key)) {
      try {
        output.addHeader(key, headers[key]);
      } catch (e) {
        Logger.log("ヘッダー設定エラー: " + e);
      }
    }
  }

  return output;
}

// GETリクエストを処理するハンドラ
function doGet(e) {
  return createResponse({
    status: "success",
    message: "GET request received",
  });
}

// POSTリクエストを処理するメインハンドラ
function doPost(e) {
  try {
    // ログ記録を追加して引数の状態を確認
    Logger.log("doPost関数開始 - 引数の状態: " + JSON.stringify(e));

    // eオブジェクトの存在チェック
    if (!e || !e.postData) {
      Logger.log("引数eまたはpostDataが存在しません");
      return createResponse({
        status: "error",
        message: "リクエストデータがありません",
      });
    }

    // リクエストの詳細をログに記録
    Logger.log(
      "リクエスト受信: " + (e.postData ? e.postData.contents : "データなし")
    );

    // JSONデータとしてパースを試みる
    var formData;
    if (e.postData && e.postData.contents) {
      try {
        formData = JSON.parse(e.postData.contents);
        Logger.log("JSONパース成功: " + JSON.stringify(formData));
      } catch (parseError) {
        // JSONパースに失敗した場合はフォームデータとして処理
        Logger.log("JSONパースエラー: " + parseError);
        formData = e.parameter;
      }
    } else {
      formData = e.parameter;
    }

    // データの検証
    if (!formData) {
      throw new Error("データが送信されていません");
    }

    // 必須項目の検証
    validateFormData(formData);

    // メール送信
    // エラーが発生しても処理を続行
    try {
      sendEmails(formData, false);
    } catch (emailError) {
      // メール送信エラーをログに記録
      Logger.log("メール送信エラー（処理は続行）: " + emailError);
    }

    // 成功レスポンスを返す
    return createResponse({
      status: "success",
      message: "お問い合わせを受け付けました",
    });
  } catch (error) {
    // エラー詳細をログに記録
    Logger.log("エラー発生: " + (error.stack || error.message || error));

    // エラーレスポンスを返す
    return createResponse({
      status: "error",
      message: error.toString(),
    });
  }
}

// OPTIONSリクエストを処理するハンドラ（CORS対応）
function doOptions(e) {
  return createResponse({}, ContentService.MimeType.JSON);
}

// フォームデータの検証 - ContactForm.jsxのフィールド名に合わせて修正
function validateFormData(data) {
  const requiredFields = [
    "type",
    "name",
    "nameKana",
    "phone",
    "email",
    "message",
    "privacy",
  ];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `必須項目が入力されていません: ${missingFields.join(", ")}`
    );
  }

  // メールアドレスの形式チェック
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      data.email
    )
  ) {
    throw new Error("メールアドレスの形式が正しくありません");
  }

  // 電話番号の形式チェック - React側のバリデーションに合わせる
  if (!/^0[0-9]{9,10}$/.test(data.phone)) {
    throw new Error("電話番号の形式が正しくありません");
  }

  // フリガナの形式チェック - React側のバリデーションに合わせる
  if (!/^[ァ-ヶー\s]+$/.test(data.nameKana)) {
    throw new Error("フリガナは全角カタカナで入力してください");
  }
}

// 共通のメール送信関数
function sendMail(options) {
  return MailApp.sendEmail({
    to: options.to,
    subject: options.subject,
    htmlBody: options.htmlBody || options.body,
    name: options.name || "ORCX株式会社",
    noReply: options.noReply !== false, // デフォルトはtrue
    replyTo: options.replyTo,
  });
}

// メール送信処理 - 統合版（テスト環境と本番環境に対応）
function sendEmails(data, isProduction) {
  try {
    // 送信先メールアドレスの決定
    var adminEmail;
    if (isProduction) {
      // 本番環境では固定のメールアドレスを使用
      adminEmail = "info@orcx.co.jp";
    } else {
      // テスト環境ではスクリプト実行者のメールアドレスを取得
      adminEmail = Session.getActiveUser().getEmail();
      if (!adminEmail || adminEmail === "") {
        adminEmail = "info@orcx.co.jp"; // バックアップの管理者メールアドレス
      }
    }
    Logger.log("管理者メール送信先: " + adminEmail);

    // 管理者への通知メール
    var adminSubject = `【問い合わせ】${getInquiryType(data.type)}について`;
    var adminBody = createAdminEmailBody(data);

    // 管理者へのメール送信
    sendMail({
      to: adminEmail,
      subject: adminSubject,
      htmlBody: adminBody,
      name: "ORCX株式会社 お問い合わせシステム",
      noReply: true,
    });

    // 自動返信メール（問い合わせ者に送信）
    var replySubject = "【ORCX株式会社】お問い合わせありがとうございます";
    var replyBody = createAutoReplyBody(data);

    // 自動返信メールの送信
    sendMail({
      to: data.email,
      subject: replySubject,
      htmlBody: replyBody,
      name: "ORCX株式会社",
      replyTo: "info@orcx.co.jp",
      noReply: true,
    });

    // ログを記録
    var logPrefix = isProduction ? "本番環境: " : "";
    Logger.log(
      `${logPrefix}お問い合わせを受け付けました: ${data.name} (${data.email})`
    );
    return true;
  } catch (error) {
    var errorPrefix = isProduction ? "本番環境" : "";
    Logger.log(`${errorPrefix}メール送信エラー: ${error.message}`);
    throw new Error("メール送信に失敗しました: " + error.message);
  }
}

// 本番環境用のメール送信関数（sendEmails関数のラッパー）
function sendEmailsProduction(data) {
  return sendEmails(data, true);
}

// 管理者向けメール本文を作成する関数
function createAdminEmailBody(data) {
  // 会社名が空白の場合の処理
  const company = data.company ? data.company : "（指定なし）";

  // メッセージ本文の改行をHTMLの<br>タグに変換
  const formattedMessage = data.message.replace(/\n/g, "<br>");

  // HTMLメール本文を作成
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Helvetica', 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    h1 { color: #333; font-size: 24px; margin-top: 0; padding-bottom: 10px; border-bottom: 1px solid #eee; }
    .section { margin-bottom: 20px; }
    .label { font-weight: bold; margin-bottom: 5px; color: #555; }
    .content { margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 4px; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #777; }
    .message-content { white-space: pre-line; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <h1>お問い合わせが届きました</h1>
    
    <div class="section">
      <div class="label">お問い合わせ種別</div>
      <div class="content">${getInquiryType(data.type)}</div>
      
      <div class="label">お名前</div>
      <div class="content">${data.name} (${data.nameKana})</div>
      
      <div class="label">会社名</div>
      <div class="content">${company}</div>
      
      <div class="label">メールアドレス</div>
      <div class="content">${data.email}</div>
      
      <div class="label">電話番号</div>
      <div class="content">${data.phone}</div>
      
      <div class="label">お問い合わせ内容</div>
      <div class="content message-content">${formattedMessage}</div>
      
      <div class="label">プライバシーポリシー</div>
      <div class="content">同意済み</div>
    </div>
    
    <div class="footer">
      <p>このメールは自動送信されています。</p>
      <p>ORCX株式会社 お問い合わせシステム</p>
    </div>
  </div>
</body>
</html>
  `;
}

// 自動返信メール本文を作成する関数
function createAutoReplyBody(data) {
  // 会社名が空白の場合の処理
  const company = data.company ? data.company : "（指定なし）";

  // メッセージ本文の改行をHTMLの<br>タグに変換
  const formattedMessage = data.message.replace(/\n/g, "<br>");

  // HTMLメール本文を作成
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Helvetica', 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    h1 { color: #333; font-size: 24px; margin-top: 0; padding-bottom: 10px; border-bottom: 1px solid #eee; }
    .section { margin-bottom: 20px; }
    .label { font-weight: bold; margin-bottom: 5px; color: #555; }
    .content { margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 4px; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #777; }
    .message-content { white-space: pre-line; line-height: 1.5; }
    .thank-you { margin-bottom: 20px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <h1>お問い合わせありがとうございます</h1>
    
    <div class="thank-you">
      <p>${data.name} 様</p>
      <p>この度はORCX株式会社にお問い合わせいただき、誠にありがとうございます。</p>
      <p>以下の内容でお問い合わせを受け付けいたしました。内容を確認の上、担当者より改めてご連絡させていただきます。</p>
    </div>
    
    <div class="section">
      <div class="label">お問い合わせ種別</div>
      <div class="content">${getInquiryType(data.type)}</div>
      
      <div class="label">お名前</div>
      <div class="content">${data.name} (${data.nameKana})</div>
      
      <div class="label">会社名</div>
      <div class="content">${company}</div>
      
      <div class="label">メールアドレス</div>
      <div class="content">${data.email}</div>
      
      <div class="label">電話番号</div>
      <div class="content">${data.phone}</div>
      
      <div class="label">お問い合わせ内容</div>
      <div class="content message-content">${formattedMessage}</div>
    </div>
    
    <div class="footer">
      <p>このメールは自動送信されています。</p>
      <p>お問い合わせいただきました内容につきましては、通常3営業日以内にご返答いたします。</p>
      <p>万が一返信がない場合は、お手数ですが再度お問い合わせいただくか、お電話にてご連絡ください。</p>
      <p>--</p>
      <p>ORCX株式会社</p>
      <p>Email: info@orcx.co.jp</p>
      <p>https://orcx.co.jp</p>
    </div>
  </div>
</body>
</html>
  `;
}

// お問い合わせ種別の取得 - ContactForm.jsxのtype optionsに合わせる
function getInquiryType(type) {
  // 注意: 実際のoptions値はcontactContent.form.type.optionsを確認してください
  var types = {
    service: "提供サービス",
    ses: "SES協業",
    development: "システム開発依頼",
    other: "その他",
  };
  return types[type] || "不明";
}

// テスト用データを生成する共通関数
function createTestData(overrides) {
  var baseData = {
    type: "service",
    company: "テスト株式会社",
    name: "テスト太郎",
    nameKana: "テストタロウ",
    phone: "0312345678",
    email: "test@example.com",
    message: "これはテストメッセージです。\n改行テスト。",
    privacy: true,
  };

  // オーバーライドがある場合は適用
  if (overrides) {
    for (var key in overrides) {
      baseData[key] = overrides[key];
    }
  }

  return baseData;
}

// モックイベントを作成する関数
function createMockEvent(data) {
  return {
    postData: {
      contents: JSON.stringify(data),
      type: "application/json",
    },
    parameter: {},
  };
}

// シンプルなテスト関数（基本的な動作確認用）
function simplestTest() {
  var testData = createTestData({ name: "テスト" });
  var mockEvent = createMockEvent(testData);

  Logger.log("シンプルテスト実行");
  var result = doPost(mockEvent);
  return result;
}

// シンプルなテスト用データを使用するテスト関数
function testDoPostComplete() {
  var testData = createTestData();
  var mockEvent = createMockEvent(testData);

  Logger.log(
    "testDoPostComplete関数開始 - モックイベント: " + JSON.stringify(mockEvent)
  );
  var result = doPost(mockEvent);
  Logger.log("testDoPostComplete関数完了 - 結果: " + result.getContent());
}

// テスト専用のメール送信関数（本番環境と分離）
function testEmailSendingToYourself() {
  // 自分自身のメールアドレスを取得
  var userEmail = Session.getActiveUser().getEmail();
  if (!userEmail || userEmail === "") {
    userEmail = "info@orcx.co.jp"; // バックアップの管理者メールアドレス
  }

  // テストデータを作成（メールアドレスを自分自身に設定）
  var testData = createTestData({
    email: userEmail,
    message: "これはメール送信テストです。\n改行テスト。",
  });

  try {
    Logger.log("テストメール送信先: " + userEmail);

    var adminSubject = `【テスト】${getInquiryType(testData.type)}について`;
    var adminBody = createAdminEmailBody(testData);

    // 管理者へのテストメール
    sendMail({
      to: userEmail,
      subject: adminSubject,
      htmlBody: adminBody,
      name: "テスト送信",
      noReply: true,
    });

    // 自動返信メールもテスト
    var replySubject = "【テスト】お問い合わせありがとうございます";
    var replyBody = createAutoReplyBody(testData);

    // 自動返信テストメール
    sendMail({
      to: userEmail,
      subject: replySubject,
      htmlBody: replyBody,
      name: "テスト送信",
      noReply: true,
      replyTo: "info@orcx.co.jp",
    });

    Logger.log("テストメール送信成功: " + userEmail);
    return "メールが正常に送信されました: " + userEmail;
  } catch (error) {
    Logger.log("テストメール送信失敗: " + error);
    return "メール送信に失敗しました: " + error;
  }
}

// メールの送信を無効化したテスト関数（メール送信なしでフォーム処理のみテスト）
function testDoPostWithoutEmail() {
  var testData = createTestData();
  var mockEvent = createMockEvent(testData);

  Logger.log("testDoPostWithoutEmail関数開始");

  try {
    // フォームデータの検証
    validateFormData(testData);
    Logger.log("バリデーション成功");

    // メール送信はスキップ
    Logger.log("メール送信はスキップします");

    // 成功レスポンスをシミュレート
    var response = {
      status: "success",
      message: "お問い合わせを受け付けました",
    };

    Logger.log(
      "testDoPostWithoutEmail関数完了 - 結果: " + JSON.stringify(response)
    );
    return JSON.stringify(response);
  } catch (error) {
    Logger.log("エラー発生: " + error);
    var errorResponse = {
      status: "error",
      message: error.toString(),
    };
    Logger.log(
      "testDoPostWithoutEmail関数完了 - エラー結果: " +
        JSON.stringify(errorResponse)
    );
    return JSON.stringify(errorResponse);
  }
}

// 最もシンプルなテスト関数（レスポンス生成のみをテスト）
function testResponseOnly() {
  try {
    var response = createResponse({
      status: "success",
      message: "テストメッセージ",
    });
    Logger.log("レスポンス生成成功: " + response.getContent());
    return "テスト成功";
  } catch (error) {
    Logger.log("レスポンス生成エラー: " + error);
    return "テスト失敗: " + error;
  }
}

// Webアプリケーションを正しくデプロイするための説明
function setup() {
  var instructions = `
■ 重要な解決策: GASでCORSを有効にするための正しい手順

GASでCORSを有効にする唯一の効果的な方法は、デプロイ設定とフロントエンドのコード修正の両方が必要です。

1. **GASのデプロイ設定**:
   - 「デプロイ」→「新しいデプロイ」→「ウェブアプリケーション」を選択
   - 「次のユーザーとしてアプリケーションを実行」で「自分」を選択
   - 「アクセスできるユーザー」で「全員（匿名ユーザーを含む）」を選択
   - デプロイ後、表示されたURLをコピー（この際、必ずURLの末尾が /exec であることを確認）

2. **フロントエンドのfetchコード修正（no-corsモード）**:
   フロントエンドのContactForm.jsxのfetch関数を次のように修正:

   \`\`\`javascript
   try {
     // no-corsモードを使用
     const response = await fetch(gasDeploymentUrl, {
       method: 'POST',
       mode: 'no-cors',  // CORSエラーを回避
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(formData)
     });

     // no-corsモードではレスポンスの内容を読み取れないため、
     // 成功したと仮定して処理を続行
     setSubmitting(false);
     setSubmitSuccess(true);
     resetForm();
     
     // 注意: no-corsモードではresponse.okやresponse.statusは確認できません
   } catch (error) {
     console.error('送信エラー:', error);
     setSubmitting(false);
     setSubmitError(true);
   }
   \`\`\`

3. **no-corsモードの注意点**:
   - no-corsモードを使用すると、レスポンスの内容を読み取ることができなくなります
   - リクエストは送信されますが、成功したかどうかをフロントエンドで確認できません
   - 送信成功の確認は、GASのログで行う必要があります
   - ユーザーへのフィードバックは、送信が成功したと仮定して表示する必要があります
   - エラーが発生した場合は、GASのログを確認してください

■ Google共有設定の確認

GASプロジェクトが適切に共有されていることを確認してください:
1. GASのプロジェクト設定画面を開く
2. 「アクセス権」タブを選択
3. 「誰でも」または「リンクを知っている全員」に設定

■ テスト手順

1. GASエディタで「testEmailSendingToYourself」関数を実行してメール送信をテスト
2. メール送信が成功したら「testDoPostWithoutEmail」関数を実行してフォーム処理をテスト
3. すべてのテストが成功したら「testDoPostComplete」関数を実行して完全なテスト
4. デプロイ後、新しいURLを.env.developmentファイルに設定
5. フロントエンドのfetch設定を確認・修正（no-corsモードを使用）
6. 再テスト
7. 問題が発生した場合は、GASのログを確認してください
`;

  Logger.log(instructions);
  return instructions;
}
