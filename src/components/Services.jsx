import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import { styles } from "../styles";
import { services } from "../constants";
import { textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { images } from "../assets";
import useMediaQuery from "../hooks/useMediaQuery";

// 定数の整理
const ANIMATION_CONFIG = {
  card: {
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
    },
    transition: {
      duration: 0.3,
    },
  },
  image: {
    hover: {
      scale: 1.1,
    },
    transition: {
      duration: 0.5,
    },
  },
};

// スタイル定数
const STYLES = {
  card: {
    container: "bg-[#1d1836] hover:bg-[#232631] hover:border-[#4a4a8f] border-2 border-transparent transition-all duration-300 p-3 sm:p-4 md:p-5 rounded-2xl w-full flex flex-col shadow-lg hover:shadow-xl h-[500px] sm:h-[540px] md:h-[580px]",
    image: "w-full h-[160px] sm:h-[180px] md:h-[200px] rounded-xl overflow-hidden relative group shadow-lg mb-2 sm:mb-3 md:mb-4",
    imageWrapper: "w-full h-full relative",
    title: "text-white text-[18px] sm:text-[20px] md:text-[24px] font-bold text-center mb-2 sm:mb-3",
    description: "text-secondary text-[13px] sm:text-[14px] md:text-[16px] text-center whitespace-pre-line mb-2 sm:mb-3",
    content: "text-white-100 text-[12px] sm:text-[13px] md:text-[14px] tracking-wider whitespace-pre-line",
    contentWrapper: "flex-grow flex flex-col",
    list: "space-y-1 sm:space-y-2 flex-grow",
  },
  section: {
    container: "relative w-full min-h-[100vh] sm:h-screen mx-auto overflow-hidden",
    wrapper: "absolute inset-0 flex flex-col items-center py-4 sm:py-0",
    header: "w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mb-2 sm:mb-4",
    title: "text-[14px] sm:text-base",
    subtitle: "text-[20px] sm:text-[40px] font-black text-white tracking-wider",
    description: "text-[14px] sm:text-[16px] text-secondary mt-2 sm:mt-4",
    card: "w-[min(100%,400px)] aspect-[3/4] mx-auto flex-shrink-0",
  },
  mobileTab: {
    container: "w-full max-w-7xl mx-auto px-4",
    tab: "flex overflow-x-auto pb-2 no-scrollbar space-x-2 mb-4",
    tabButton: "px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium",
    tabButtonActive: "bg-[#4a4a8f] text-white",
    tabButtonInactive: "bg-[#1d1836] text-secondary hover:bg-[#232631]",
    content: "bg-[#1d1836] p-4 rounded-2xl shadow-lg min-h-[400px]",
  }
};

// プレースホルダー表示用のコンポーネント
const renderPlaceholder = () => (
  <div className="absolute inset-0 animate-pulse bg-[#232631] rounded-xl">
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-secondary opacity-60 text-lg">Loading...</span>
    </div>
  </div>
);

// 画像表示用のコンポーネント
const renderImage = (props) => {
  const { src, alt, webpSrc } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className={STYLES.card.imageWrapper}>
      {(!isLoaded || isError) && renderPlaceholder()}
      <picture>
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <motion.img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          whileHover={ANIMATION_CONFIG.image.hover}
          transition={ANIMATION_CONFIG.image.transition}
        />
      </picture>
    </div>
  );
};

// サービスに関する処理をまとめたカスタムフック
const useServices = () => {
  return {
    getTitle: (service) => service.title,
    getDescription: (service) => service.description,
    getContent: (service) => service.content,
    getPoints: (service) => service.points || [],
    getServiceImage: (title) => {
      const key = title.toLowerCase().replace(/\s+/g, '_');
      const defaultImage = {
        src: images.comingsoon.src,
        webp: images.comingsoon.webp,
        alt: title,
      };

      return images[key] || defaultImage;
    },
  };
};

const Services = () => {
  const serviceUtils = useServices();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="services" className={STYLES.section.container}>
      <div className={STYLES.section.wrapper}>
        <div className={STYLES.section.header}>
          <motion.div variants={textVariant()}>
            <p className={`${STYLES.section.title} ${styles.sectionSubText}`}>
              Our Services
            </p>
            <h2 className={`${STYLES.section.subtitle} ${styles.sectionHeadText}`}>
              サービス一覧
            </h2>
            <p className={STYLES.section.description}>
              次世代のテクノロジーでビジネスの課題を解決します
            </p>
          </motion.div>
        </div>

        {isMobile ? (
          // モバイル向けタブインターフェース
          <div className={STYLES.mobileTab.container}>
            <div className={STYLES.mobileTab.tab}>
              {services.map((service, index) => (
                <button
                  key={index}
                  className={`${STYLES.mobileTab.tabButton} ${
                    activeTab === index 
                      ? STYLES.mobileTab.tabButtonActive 
                      : STYLES.mobileTab.tabButtonInactive
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {serviceUtils.getTitle(service)}
                </button>
              ))}
            </div>
            <div className={STYLES.mobileTab.content}>
              <h3 className={STYLES.card.title}>
                {serviceUtils.getTitle(services[activeTab])}
              </h3>
              <div className={STYLES.card.image}>
                {renderImage({
                  src: serviceUtils.getServiceImage(services[activeTab].title).src,
                  webpSrc: serviceUtils.getServiceImage(services[activeTab].title).webp,
                  alt: services[activeTab].title,
                })}
              </div>
              <p className={STYLES.card.description}>
                {serviceUtils.getDescription(services[activeTab])}
              </p>
              <div className={STYLES.card.contentWrapper}>
                <p className={STYLES.card.content}>
                  {serviceUtils.getContent(services[activeTab])}
                </p>
                <ul className={STYLES.card.list}>
                  {serviceUtils.getPoints(services[activeTab]).map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-[#00a8ff] mr-2">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // デスクトップ向けSwiperカルーセル
          <div className="w-full h-[70vh] flex items-center justify-center px-5 sm:px-0">
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={"auto"}
              coverflowEffect={{
                rotate: 10,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: true,
              }}
              navigation={true}
              modules={[EffectCoverflow, Autoplay, Navigation]}
              className="w-full mySwiper"
            >
              {services.map((service, index) => {
                const { src, webp: webpSrc } = serviceUtils.getServiceImage(service.title);
                return (
                  <SwiperSlide key={service.title} className={STYLES.section.card}>
                    <motion.div
                      className={STYLES.card.container}
                      whileHover={ANIMATION_CONFIG.card.hover}
                      transition={ANIMATION_CONFIG.card.transition}
                    >
                      <div className={STYLES.card.image}>
                        {renderImage({
                          src,
                          webpSrc,
                          alt: service.title,
                        })}
                      </div>
                      <h3 className={STYLES.card.title}>
                        {serviceUtils.getTitle(service)}
                      </h3>
                      <p className={STYLES.card.description}>
                        {serviceUtils.getDescription(service)}
                      </p>
                      <div className={STYLES.card.contentWrapper}>
                        <p className={STYLES.card.content}>
                          {serviceUtils.getContent(service)}
                        </p>
                        <ul className={STYLES.card.list}>
                          {serviceUtils.getPoints(service).map((point, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-[#00a8ff] mr-2">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionWrapper(Services, "services");