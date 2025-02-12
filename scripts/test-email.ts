import 'dotenv/config';
import { testEmailSending } from '../utils/sendEmail.js';

// 環境変数の読み込み

async function runEmailTest() {
  console.log('Resend メール送信テストを開始します。');
  
  // API キーが設定されているか確認
  if (!process.env.RESEND_API_KEY) {
    console.error('エラー: RESEND_API_KEY が設定されていません。');
    process.exit(1);
  }

  try {
    const result = await testEmailSending('k.kikuchi@orcx.co.jp');
    
    if (result.success) {
      console.log('✅ メール送信テストが成功しました。');
      process.exit(0);
    } else {
      console.error('❌ メール送信テストに失敗しました。', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ メール送信中に予期せぬエラーが発生:', error);
    process.exit(1);
  }
}

runEmailTest();
