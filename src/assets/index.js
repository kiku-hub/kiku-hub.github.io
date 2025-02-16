import menu from "./icons/menu.svg";
import close from "./icons/close.svg";
import logo from "./images/orcx-logo.png";

// 画像ファイル - JPEG/PNG
import comingsoon from "./images/comingsoon.jpg";
import ITsolution from "./images/ITsolution.jpeg";
import CompanyServices from "./images/CompanyServices.jpeg";
import Teameng from "./images/Teameng.jpeg";
import Datacenter from "./images/Datacenter.jpeg";
import herobg from "./images/herobg.png";

// 画像ファイル - WebP
import comingsoonWebP from "./images/comingsoon.webp";
import ITsolutionWebP from "./images/ITsolution.webp";
import CompanyServicesWebP from "./images/CompanyServices.webp";
import TeamengWebP from "./images/Teameng.webp";
import DatacenterWebP from "./images/Datacenter.webp";
import herobgWebP from "./images/herobg.webp";

import css from "./tech/css.png";
import docker from "./tech/docker.png";
import figma from "./tech/figma.png";
import git from "./tech/git.png";
import html from "./tech/html.png";
import javascript from "./tech/javascript.png";
import mongodb from "./tech/mongodb.png";
import nodejs from "./tech/nodejs.png";
import reactjs from "./tech/reactjs.png";
import redux from "./tech/redux.png";
import tailwind from "./tech/tailwind.png";
import typescript from "./tech/typescript.png";
import nextjs from "./tech/nextjs.png";

// 画像オブジェクトの作成（WebPフォールバック付き）
const images = {
  logo,
  comingsoon: {
    src: comingsoon,
    webp: comingsoonWebP,
  },
  ITsolution: {
    src: ITsolution,
    webp: ITsolutionWebP,
  },
  CompanyServices: {
    src: CompanyServices,
    webp: CompanyServicesWebP,
  },
  Teameng: {
    src: Teameng,
    webp: TeamengWebP,
  },
  Datacenter: {
    src: Datacenter,
    webp: DatacenterWebP,
  },
  herobg: {
    src: herobg,
    webp: herobgWebP,
  }
};

export {
  menu,
  close,
  logo,
  css,
  docker,
  figma,
  git,
  html,
  javascript,
  mongodb,
  nodejs,
  reactjs,
  redux,
  tailwind,
  typescript,
  nextjs,
  images
};
