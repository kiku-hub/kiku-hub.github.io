import React, { useMemo } from "react";
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
import { ITsolution, CompanyServices, Teameng, Datacenter } from "../assets";

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
    subtitle: "text-[28px] sm:text-[32px] md:text-[36px]",
  },
  swiper: {
    container: "absolute inset-0 flex items-start justify-center",
    wrapper: "relative w-full max-w-[1600px] mx-auto px-2 sm:px-4",
    gradient: {
      left: "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-[10%] sm:w-[15%] h-full bg-gradient-to-r from-primary to-transparent pointer-events-none",
      right: "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-[10%] sm:w-[15%] h-full bg-gradient-to-l from-primary to-transparent pointer-events-none",
    },
    slide: "w-[80vw] sm:!w-[340px] md:!w-[400px] lg:!w-[450px] flex items-center justify-center py-3 sm:py-4 md:py-6 lg:py-8",
  },
};

// Swiperの設定
const SWIPER_CONFIG = {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: "auto",
  speed: 800,
  initialSlide: 2,
  modules: [Autoplay, EffectCoverflow, Navigation],
  navigation: true,
  className: "services-swiper",
  autoplay: {
    delay: 3500,
    pauseOnMouseEnter: true,
    disableOnInteraction: false,
    reverseDirection: false,
  },
  breakpoints: {
    320: { 
      slidesPerView: 1,
      spaceBetween: 20,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
      }
    },
    480: {
      slidesPerView: "auto",
      spaceBetween: -10,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
      }
    },
    640: { 
      slidesPerView: "auto",
      spaceBetween: -20,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
      }
    },
    1024: { 
      slidesPerView: "auto",
      spaceBetween: -30,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
      }
    }
  }
};

// ServiceImageコンポーネント
const ServiceImage = React.memo(({ image, title }) => {
  const renderPlaceholder = () => (
    <div className={STYLES.card.imageWrapper}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-7xl text-white/90 drop-shadow-lg transform transition-transform group-hover:scale-110 duration-300">
          🚀
        </div>
      </div>
    </div>
  );

  const renderImage = () => (
    <div className={STYLES.card.imageWrapper}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10" />
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
    </div>
  );

  return image ? renderImage() : renderPlaceholder();
});

// ServiceCardコンポーネント
const ServiceCard = React.memo(({ title, description, points, image }) => (
  <motion.div
    whileHover={ANIMATION_CONFIG.card.hover}
    className={STYLES.card.container}
  >
    <div className={STYLES.card.image}>
      <ServiceImage image={image} title={title} />
    </div>

    <div className={STYLES.card.contentWrapper}>
      <h3 className={STYLES.card.title}>{title}</h3>
      <p className={STYLES.card.description}>{description}</p>
      <ul className={STYLES.card.list}>
        {points.map((point, index) => (
          <li key={index} className={STYLES.card.content}>
            {point}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
));

// サービスデータのカスタムフック
const useServices = () => {
  return useMemo(() => {
    const imageMap = {
      'ITソリューション': ITsolution,
      '自社サービス': CompanyServices,
      'システム受託開発': Teameng,
      'AI サーバー': Datacenter,
    };

    const getServiceImage = (title) => (
      Object.entries(imageMap).find(([key]) => title.includes(key))?.[1] || null
    );

    const itSolution = services.find(service => service.title.includes('ITソリューション'));
    const otherServices = services.filter(service => !service.title.includes('ITソリューション'));
    
    const sortedServices = [itSolution, ...otherServices].map(service => ({
      ...service,
      image: getServiceImage(service.title)
    }));

    return [...sortedServices, ...sortedServices, ...sortedServices];
  }, []);
};

// Servicesコンポーネント
const Services = () => {
  const services = useServices();

  return (
    <section className={STYLES.section.container}>
      <div className={STYLES.section.wrapper}>
        <div className={STYLES.section.header}>
          <div className="text-center">
            <p className={`${styles.sectionSubText} ${STYLES.section.title}`}>
              事業内容
            </p>
            <h2 className={`${styles.sectionHeadText} ${STYLES.section.subtitle}`}>
              Services.
            </h2>
          </div>
        </div>

        <div className="flex-1 w-full relative flex items-start justify-center -mt-4 sm:-mt-6">
          <div className={STYLES.swiper.container}>
            <div className={STYLES.swiper.wrapper}>
              <div className={STYLES.swiper.gradient.left} />
              <div className={STYLES.swiper.gradient.right} />
              
              <Swiper {...SWIPER_CONFIG}>
                {services.map((service, index) => (
                  <SwiperSlide
                    key={`${service.title}-${index}`}
                    className={STYLES.swiper.slide}
                  >
                    <div className="transform transition-all duration-300 w-full">
                      <ServiceCard {...service} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .services-swiper .swiper-slide {
          transition: all 0.4s ease;
          opacity: 0.4;
          transform: scale(0.85);
          will-change: transform, opacity;
        }
        
        .services-swiper .swiper-slide-active {
          opacity: 1;
          transform: scale(1);
          z-index: 2;
        }

        .services-swiper .swiper-slide-prev,
        .services-swiper .swiper-slide-next {
          opacity: 0.6;
          transform: scale(0.9);
        }

        .services-swiper .swiper-button-next,
        .services-swiper .swiper-button-prev {
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          top: 45%;
          width: 30px;
          height: 30px;
        }

        .services-swiper .swiper-button-next:hover,
        .services-swiper .swiper-button-prev:hover {
          color: white;
          transform: scale(1.1);
        }

        .services-swiper .swiper-button-next:after,
        .services-swiper .swiper-button-prev:after {
          font-size: 1.2rem;
          font-weight: bold;
        }

        @media (min-width: 640px) {
          .services-swiper .swiper-button-next,
          .services-swiper .swiper-button-prev {
            width: 44px;
            height: 44px;
          }

          .services-swiper .swiper-button-next:after,
          .services-swiper .swiper-button-prev:after {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 639px) {
          .services-swiper .swiper-button-next,
          .services-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default SectionWrapper(Services, "services");