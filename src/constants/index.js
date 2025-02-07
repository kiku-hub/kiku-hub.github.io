import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  comingsoon,
  threejs,
} from "../assets";

const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "services",
    title: "Services",
  },
  {
    id: "work",
    title: "Work",
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

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "React.js Developer",
    company_name: "Starbucks",
    icon: starbucks,
    iconBg: "#383E56",
    date: "March 2020 - April 2021",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "React Native Developer",
    company_name: "Tesla",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "Jan 2021 - Feb 2022",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Web Developer",
    company_name: "Shopify",
    icon: shopify,
    iconBg: "#383E56",
    date: "Jan 2022 - Jan 2023",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Full stack Developer",
    company_name: "Meta",
    icon: meta,
    iconBg: "#E6DEDD",
    date: "Jan 2023 - Present",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
];

const projects = [
  {
    name: "Arch",
    subtitle: "SES業界に特化した統合プラットフォーム",
    description:
      `Arch（アーチ）は、SESビジネスに関わるすべての人と企業を繋ぐ次世代プラットフォームです。\n建築において、アーチは空間に強度と美しさをもたらす重要な構造体です。\n私たちのArchは、SES業界に新たな構造体を築き、より強く、より効率的なビジネスモデルを実現します。\nSES 2.0の時代に向けて、人材と企業の最適なマッチング、業務効率化、データ driven な意思決定をワンストップで提供。\n伝統的なSESビジネスを、テクノロジーの力で新次元へと進化させます。`,
    tags: [
      {
        name: "innovation",
        color: "blue-text-gradient",
      },
      {
        name: "technology",
        color: "green-text-gradient",
      },
      {
        name: "development",
        color: "pink-text-gradient",
      },
    ],
    image: comingsoon,
    source_code_link: "#",
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
      value: "ITコンサルティング・システム開発",
      icon: "service"
    },
    {
      label: "所在地",
      value: "東京都世田谷区4-18-7",
      icon: "location"
    },
    {
      label: "設立",
      value: "2025年3月1日",
      icon: "calendar"
    },
    {
      label: "資本金",
      value: "300万円",
      icon: "money"
    },
    {
      label: "従業員数",
      value: "2名（フリーランス含め10名）",
      icon: "users"
    },
    {
      label: "メール",
      value: "contact@orcx.co.jp",
      icon: "email"
    },
    {
      label: "ウェブサイト",
      value: "https://orcx.co.jp",
      icon: "website"
    }
  ]
};

export {
  navLinks,
  services,
  technologies,
  experiences,
  projects,
  aboutContent,
  companyInfo,
};
