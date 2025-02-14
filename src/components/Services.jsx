import React from "react";
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
import ITsolution from "../assets/ITsolution.jpeg";
import CompanyServices from "../assets/CompanyServices.jpeg";
import Teameng from "../assets/Teameng.jpeg";
import Datacenter from "../assets/Datacenter.jpeg";

// スタイル定数
const CARD_STYLES = {
  container: "bg-[#1d1836] hover:bg-[#232631] hover:border-[#4a4a8f] border-2 border-transparent transition-all duration-300 p-6 rounded-2xl w-full h-[520px] flex flex-col shadow-lg hover:shadow-xl",
  imageContainer: "w-full h-[180px] rounded-xl overflow-hidden relative group shadow-lg mb-5",
  title: "text-white text-[20px] font-bold text-center",
  description: "text-secondary text-[13px] text-center whitespace-pre-line",
  content: "text-white-100 text-[13px] tracking-wider whitespace-pre-line",
};

// Swiperの基本設定
const BASE_SWIPER_CONFIG = {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: "auto",
  speed: 800,
  spaceBetween: -50,
  initialSlide: 2,
  coverflowEffect: {
    rotate: 5,
    stretch: 20,
    depth: 100,
    modifier: 1,
    slideShadows: false,
  },
  autoplay: {
    delay: 3500,
    pauseOnMouseEnter: true,
    disableOnInteraction: false,
    reverseDirection: false,
  },
};

const ServiceImage = ({ image, title }) => {
  if (!image) {
    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-7xl text-white/90 drop-shadow-lg transform transition-transform group-hover:scale-110 duration-300">
            🚀
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10" />
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
      />
    </div>
  );
};

const ServiceCard = ({ title, description, points, image }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
      }}
      className={CARD_STYLES.container}
    >
      <div className={CARD_STYLES.imageContainer}>
        <ServiceImage image={image} title={title} />
      </div>

      <div className="mb-3">
        <h3 className={CARD_STYLES.title}>{title}</h3>
      </div>

      <div className="space-y-3 flex-grow">
        <p className={CARD_STYLES.description}>{description}</p>
        <div className="space-y-2">
          <ul className="space-y-2">
            {points.map((point, pointIndex) => (
              <li key={pointIndex} className={CARD_STYLES.content}>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const sortedServices = React.useMemo(() => {
    const itSolution = services.find(service => service.title.includes('ITソリューション'));
    const otherServices = services.filter(service => !service.title.includes('ITソリューション'));
    
    const getServiceImage = (title) => {
      const imageMap = {
        'ITソリューション': ITsolution,
        '自社サービス': CompanyServices,
        'システム受託開発': Teameng,
        'AI サーバー': Datacenter,
      };
      
      return Object.entries(imageMap).find(([key]) => title.includes(key))?.[1] || null;
    };

    return [itSolution, ...otherServices].map(service => ({
      ...service,
      image: getServiceImage(service.title)
    }));
  }, []);

  const tripleServices = [...sortedServices, ...sortedServices, ...sortedServices];

  const swiperConfig = {
    ...BASE_SWIPER_CONFIG,
    modules: [Autoplay, EffectCoverflow, Navigation],
    navigation: true,
    className: "services-swiper",
    breakpoints: {
      320: { slidesPerView: "auto", spaceBetween: -20 },
      640: { slidesPerView: "auto", spaceBetween: -30 },
      1024: { slidesPerView: "auto", spaceBetween: -50 },
    }
  };

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center" style={{ paddingTop: '0vh' }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 sm:mb-4">
          <motion.div 
            variants={textVariant()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center"
          >
            <p className={styles.sectionSubText}>事業内容</p>
            <h2 className={styles.sectionHeadText}>Services.</h2>
          </motion.div>
        </div>

        <div className="flex-1 w-full relative flex items-start justify-center -mt-6">
          <div className="absolute inset-0 flex items-start justify-center">
            <div className="relative w-full max-w-[1600px] mx-auto px-2 sm:px-4">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-[15%] h-full bg-gradient-to-r from-primary to-transparent pointer-events-none" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-[15%] h-full bg-gradient-to-l from-primary to-transparent pointer-events-none" />
              
              <Swiper {...swiperConfig}>
                {tripleServices.map((service, index) => (
                  <SwiperSlide
                    key={`${service.title}-${index}`}
                    className="!w-[280px] sm:!w-[380px] md:!w-[420px] lg:!w-[450px] flex items-center justify-center py-4 sm:py-6 md:py-8"
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
          opacity: 0.3;
          transform: scale(0.75);
        }
        
        .services-swiper .swiper-slide-active {
          opacity: 1;
          transform: scale(1);
          z-index: 2;
        }

        .services-swiper .swiper-slide-prev,
        .services-swiper .swiper-slide-next {
          opacity: 0.5;
          transform: scale(0.82);
        }

        .services-swiper .swiper-button-next,
        .services-swiper .swiper-button-prev {
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          top: 45%;
        }

        .services-swiper .swiper-button-next:hover,
        .services-swiper .swiper-button-prev:hover {
          color: white;
          transform: scale(1.1);
        }

        .services-swiper .swiper-button-next:after,
        .services-swiper .swiper-button-prev:after {
          font-size: 1.5rem;
          font-weight: bold;
        }

        @media (max-width: 640px) {
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