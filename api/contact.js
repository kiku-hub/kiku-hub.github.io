import { Resend } from 'resend';
import ContactEmail from '../src/emails/ContactEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      type,
      company,
      name,
      nameKana,
      phone,
      email,
      message
    } = req.body;

    // 必須フィールドの検証
    if (!type || !company || !name || !nameKana || !phone || !email || !message) {
      return res.status(400).json({ error: '必須フィールドが不足しています' });
    }

    // メール送信
    const data = await resend.emails.send({
      from: 'ORCX <no-reply@orcx.jp>',
      to: ['info@orcx.jp'], // 受信用メールアドレスを設定
      subject: 'ORCXウェブサイトからのお問い合わせ',
      react: ContactEmail({
        type,
        company,
        name,
        nameKana,
        phone,
        email,
        message,
      }),
      // 自動返信用の設定
      cc: [email],
    });

    return res.status(200).json({ data });
  } catch (error) {
    console.error('メール送信エラー:', error);
    return res.status(500).json({ error: 'メール送信に失敗しました' });
  }
}