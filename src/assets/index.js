import menu from "./icons/menu.svg";
import close from "./icons/close.svg";
import logo from "./images/orcx-logo.png";
import logoWebP from "./images/orcx-logo.webp";

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

// 画像オブジェクトの作成（WebPフォールバック付き）
const images = {
  logo: {
    src: logo,
    webp: logoWebP
  },
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

// UIアイコンとimagesオブジェクトのみをエクスポート
export {
  menu,
  close,
  images,
  logo
};
