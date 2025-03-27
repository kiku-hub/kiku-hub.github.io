import {
  images,
  logo
} from "../assets";

const navLinks = [
  {
    id: "products",
    title: "Products",
  },
  {
    id: "services",
    title: "Services",
  },
  {
    id: "about",
    title: "About Us",
  },
  {
    id: "news",
    title: "News",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "ITソリューション事業",
    description: "本質的価値を創造する、\n真のテクノロジーパートナーへ。",
    points: [
      "\nお客様のプロジェクトを成功へと導くため、最適な人材のマッチングをご提案いたします。\n\nプロジェクトの背景や必要なスキル、業務内容、期間などについてお話をお伺いし、課題を把握した上で、ぴったりの人材を迅速にご紹介。\n\nプロジェクトの円滑な進行と成功に向けて、サポートいたします。",
    ],
    image: images.ITsolution.src,
    webp: images.ITsolution.webp,
  },
  {
    title: "自社サービス事業",
    description: "テクノロジーで、\n仕事をもっとシンプルに。",
    points: [
      "\n私たちのプロダクトは、最新のAI技術とクラウド基盤を活用し、実際の現場の声を反映しながら進化し続けています。\n\n「使いやすさ」と「本質的な課題解決」を追求し、新しい働き方の実現を目指しています。",
    ],
  },
  {
    title: "システム受託開発事業",
    description: "確かな技術力で、\nビジネスの未来を創造します。",
    points: [
      "\nお客様の課題を最新技術で解決に導きます。\n\n要件定義から設計、開発、運用保守まで、プロジェクトのライフサイクル全体をワンストップでサポート。\n\n卓越した品質と迅速な開発で、お客様のビジネスの持続的な成長と競争優位性の確立に貢献します。",
    ],
  },
  {
    title: "AI サーバー構築事業",
    description: "最先端 GPU インフラで、\nAI 活用を加速します。",
    points: [
      "\nNVIDIA 最新 GPU を搭載したハイパフォーマンスな AI 基盤を、オンプレミスからクラウドまで柔軟に構築。\n\n企業規模や用途に最適化された構成の提案から、24時間365日の安定運用、高度なセキュリティ対策まで、包括的なサポートを提供いたします。",
      "\n※サービス開始日は未定となっております。",
    ],
  },
];

const projects = [
  {
    name: "Arch",
    subtitle: "SES業界に特化した統合プラットフォーム",
    description:
      `Arch（アーチ）は、SESビジネスに関わるすべての人と企業を繋ぐ次世代プラットフォームです。\n私たちのArchは、SES業界に新たな構造体を築き、より効率的なビジネスモデルを実現します。\nSES 2.0の時代に向けて、人材と企業の最適なマッチング、業務効率化、データ driven な意思決定をワンストップで提供。\n伝統的なSESビジネスを、テクノロジーの力で新次元へと進化させます。`,
    image: images.comingsoon.src,
    webp: images.comingsoon.webp,
  },
];

const aboutContent = {
  title: "私たちについて",
  subtitle: "About Us.",
  cards: [
    {
      id: "value",
      title: "Value",
      icon: "💫",
      description: "本質を追求する技術と革新的思考で、より良い未来を創造する",
      subDescription: "Pursue excellence through technology and innovative thinking to create a better future.",
      points: [
        {
          ja: "常識を疑い、多角的な視点からベストな答えを探る",
          en: "Question assumptions and seek optimal solutions from multiple angles"
        },
        {
          ja: "建設的なフィードバックを重視し、より良い解決を生む",
          en: "Emphasize constructive feedback to generate better solutions"
        },
        {
          ja: "本質的な価値を創造する技術を追求し、最高品質を約束する",
          en: "Advance technology that creates core value while upholding the highest standards"
        },
        {
          ja: "誠実さと一貫性を保ち、責任ある行動を徹底",
          en: "Maintain consistency and sincerity while ensuring responsible actions"
        },
        {
          ja: "独自の視点を持ち寄り、相乗効果を重視する",
          en: "Bring unique perspectives together to create synergistic effects"
        }
      ]
    },
    {
      id: "vision",
      title: "Vision",
      icon: "👁️",
      description: "固定観念を覆し、本質を見据えた新たな可能性を広げる",
      subDescription: "Transform conventional wisdom and expand new possibilities by focusing on the essence.",
    },
    {
      id: "mission",
      title: "Mission",
      icon: "🎯",
      description: "先端技術と革新的な思考を融合し、実用的な価値を社会に届ける",
      subDescription: "Integrate cutting-edge technology with critical thinking to deliver innovative and valuable outcomes for people.",
    }
  ]
};

const companyInfo = {
  title: "会社概要",
  subtitle: "Company Profile",
  details: [
    {
      label: "会社名",
      value: "ORCX株式会社",
      icon: "building"
    },
    {
      label: "代表者",
      value: "吉田 翔一朗",
      icon: "user"
    },
    {
      label: "事業内容",
      value: "ITソリューション・自社サービス・システム受託開発・AIサーバー構築",
      icon: "service"
    },
    {
      label: "所在地",
      value: "東京都世田谷区",
      icon: "location"
    },
    {
      label: "設立",
      value: "2025年4月1日",
      icon: "calendar"
    },
    {
      label: "資本金",
      value: "300万円",
      icon: "money"
    },
    {
      label: "メール",
      value: "info@orcx.co.jp",
      icon: "email"
    },
  ]
};

const newsContent = {
  title: "ニュース",
  subtitle: "Tech News.",
};

const news = [
  {
    title: "ORCX株式会社設立",
    category: "会社名の由来",
    icon: logo,
    iconBg: "#ffffff",
    date: "2025年4月1日",
    description: [
      "ORCX株式会社の会社名の由来は、地球上で最も成功した捕食者の一つであるシャチ（ORCA）と無限の可能性を象徴する（X）の組み合わせです。\n\n" +
      "シャチの持つ優れた組織力と、宇宙のような無限の可能性。この2つの要素には、組織の力で価値ある未来を創造し続けるという私たちの理念が込められています。"
    ],
  },
];

const contactContent = {
  title: "お問い合わせ",
  subtitle: "Contact.",
  form: {
    type: {
      label: "お問い合わせ種別",
      placeholder: "お問い合わせ種別を選択してください",
      options: [
        { value: "service", label: "提供サービスについて" },
        { value: "ses", label: "SES協業について" },
        { value: "development", label: "システム開発の依頼について" },
        { value: "other", label: "その他" }
      ]
    },
    company: {
      label: "会社名/組織名",
      placeholder: "会社名/組織名をご入力ください"
    },
    name: {
      label: "お名前",
      placeholder: "お名前をご入力ください"
    },
    nameKana: {
      label: "フリガナ",
      placeholder: "フリガナをご入力ください"
    },
    phone: {
      label: "電話番号",
      placeholder: "電話番号をご入力ください"
    },
    email: {
      label: "メールアドレス",
      placeholder: "メールアドレスをご入力ください"
    },
    message: {
      label: "お問い合わせ内容",
      placeholder: "お問い合わせ内容をご入力ください"
    },
    privacy: {
      label: "プライバシーポリシーに同意する",
      link: "プライバシーポリシー",
      url: "/privacy-policy"
    },
    button: {
      sending: "送信中...",
      default: "送信"
    }
  },
  alerts: {
    success: "お問い合わせありがとうございます。内容を確認次第、ご連絡させていただきます。",
    error: "エラーが発生しました。お手数ですが、再度お試しください。"
  }
};

export {
  navLinks,
  services,
  projects,
  aboutContent,
  companyInfo,
  newsContent,
  news,
  contactContent,
};
