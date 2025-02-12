import { Resend } from 'resend';
import EmailTemplate from '../components/EmailTemplate';

// Ensure the API key is set in your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactFormEmail(data: EmailData, to?: string) {
  try {
    console.log('メール送信を開始します。');
    console.log('送信元:', 'onboarding@resend.dev');
    console.log('送信先:', to || 'k.kikuchi@orcx.co.jp');
    console.log('送信データ:', data);

    const { data: resendData, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [to || 'k.kikuchi@orcx.co.jp'],
      subject: 'お問い合わせフォーム送信',
      react: EmailTemplate(data),
    });

    if (error) {
      console.error('メール送信エラー:', error);
      return { success: false, error };
    }

    console.log('メール送信成功:', resendData);
    return { success: true, data: resendData };
  } catch (error) {
    console.error('メール送信中に予期せぬエラーが発生:', error);
    return { success: false, error };
  }
}

// テスト用関数（ローカル開発用）
export async function testEmailSending(to?: string) {
  const testData: EmailData = {
    name: 'テスト ユーザー',
    email: 'test@example.com',
    message: 'これはテストメッセージです。メール送信機能の確認を行っています。',
  };

  console.log('テストメールを送信しています...');
  const result = await sendContactFormEmail(testData, to);
  console.log('メール送信テスト完了。結果:', result);
  return result;
}

// 直接テストする場合はコメントを外してください
// testEmailSending();
