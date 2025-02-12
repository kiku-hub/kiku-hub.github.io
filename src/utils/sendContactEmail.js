import axios from 'axios';

export const sendContactEmail = async (formData) => {
  try {
    const response = await axios.post('https://api.resend.com/emails', 
      {
        from: 'onboarding@resend.dev',
        to: [formData.email],
        cc: ['k.kikuchi@orcx.co.jp'],
        subject: `【ORCX】お問い合わせを受け付けました: ${formData.type}`,
        html: `
          <h1>お問い合わせ受付のご連絡</h1>
          <p>${formData.name} 様</p>
          <p>この度は、ORCXへお問い合わせいただき、誠にありがとうございます。</p>
          <h2>【お問い合わせ詳細】</h2>
          <p>お問い合わせ種別: ${formData.type}</p>
          <p>会社名/組織名: ${formData.company}</p>
          <p>お名前: ${formData.name} (${formData.nameKana})</p>
          <p>電話番号: ${formData.phone}</p>
          <p>メールアドレス: ${formData.email}</p>
          <p><strong>お問い合わせ内容:</strong><br>${formData.message}</p>
          <p>追って担当者より、ご連絡させていただきます。</p>
        `
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('メール送信エラー:', error);
    throw error;
  }
};
