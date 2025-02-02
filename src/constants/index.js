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

export const navLinks = [
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

export const services = [
  {
    title: "システムエンジニアリングサービス",
    description: "独自開発のスキルマッチング AI を活用し、最適な人材配置を実現します。",
    points: [
      "高精度なスキル評価システム",
      "エンジニアの技術力を客観的に可視化",
      "取引先 50 社以上との安定的な取引関係",
      "エンジニア 10 名以上の技術パートナー体制",
      "月 1 回のキャリア面談実施",
      "技術・心理面での充実したサポート体制",
    ],
  },
  {
    title: "SES プラットフォーム Arch",
    description: "SES 企業とエンジニアを結ぶ、次世代型プラットフォームを提供します。",
    points: [
      "独自 AI 技術による高精度マッチング",
      "スキルの定量的評価・可視化",
      "効率的な選考プロセス",
      "データ分析による継続的な精度向上",
      "クラウドベースで全国規模に対応",
    ],
  },
  {
    title: "受託開発",
    description: "最新技術を活用した高品質なシステム開発を提供します。",
    points: [
      "Web システム開発",
      "クラウドシステム構築",
      "AI アルゴリズム実装",
      "アジャイル開発手法の採用",
      "要件定義から運用保守まで一貫支援",
    ],
  },
  {
    title: "AI サーバー構築サービス",
    description: "NVIDIA 最新 GPU を活用した高性能環境の構築をサポートします。",
    points: [
      "オンプレミス・クラウド環境対応",
      "負荷・用途に応じた最適構成の提案",
      "24/7 の安定運用サポート",
      "セキュリティ対策の実装",
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

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
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

export { technologies, experiences, testimonials, projects };
