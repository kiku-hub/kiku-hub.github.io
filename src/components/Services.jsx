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

const ServiceCard = ({ title, description, points, image }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
      }}
      className="bg-[#1d1836] hover:bg-[#232631] hover:border-[#4a4a8f] border-2 border-transparent transition-all duration-300 p-6 rounded-2xl w-full h-full flex flex-col shadow-lg hover:shadow-xl"
    >
      <div className="w-full h-[200px] rounded-xl overflow-hidden relative group shadow-lg mb-6">
        {image ? (
          <div className="w-full h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10" />
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-7xl text-white/90 drop-shadow-lg transform transition-transform group-hover:scale-110 duration-300">
                🚀
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-white text-[20px] font-bold text-center">
          {title}
        </h3>
      </div>

      <div className="space-y-4 flex-grow">
        <p className="text-secondary text-[13px] text-center">
          {description}
        </p>

        <div className="space-y-3">
          <ul className="list-disc ml-5">
            {points.map((point, pointIndex) => (
              <li key={pointIndex} className="text-white-100 text-[13px] pl-1 tracking-wider">
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
  // サービスデータの整理と画像のマッピング
  const sortedServices = React.useMemo(() => {
    const itSolution = services.find(service => service.title.includes('ITソリューション'));
    const otherServices = services.filter(service => !service.title.includes('ITソリューション'));
    
    const getServiceImage = (title) => {
      if (title.includes('ITソリューション')) return ITsolution;
      if (title.includes('自社サービス')) return CompanyServices;
      if (title.includes('システム受託開発')) return Teameng;
      if (title.includes('AI サーバー')) return Datacenter;
      return null;
    };

    return [itSolution, ...otherServices].map(service => ({
      ...service,
      image: getServiceImage(service.title)
    }));
  }, []);

  // 無限スクロール用の3セット分のサービスデータ
  const tripleServices = [...sortedServices, ...sortedServices, ...sortedServices];

  // Swiperの設定
  const swiperConfig = {
    modules: [Autoplay, EffectCoverflow, Navigation],
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: "auto",
    speed: 800,
    spaceBetween: 0,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
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
    navigation: true,
    className: "services-swiper",
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    }
  };

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center">
        {/* ヘッダーセクション */}
        <div className="w-full max-w-7xl mx-auto px-8 mb-12">
          <motion.div 
            variants={textVariant()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center pt-16"
          >
            <p className={styles.sectionSubText}>事業内容</p>
            <h2 className={styles.sectionHeadText}>Services.</h2>
          </motion.div>
        </div>

        {/* スライダーセクション */}
        <div className="flex-1 w-full relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-[1400px] mx-auto px-4">
              {/* グラデーションオーバーレイ */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-[15%] h-full bg-gradient-to-r from-primary to-transparent pointer-events-none" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-[15%] h-full bg-gradient-to-l from-primary to-transparent pointer-events-none" />
              
              <Swiper {...swiperConfig}>
                {tripleServices.map((service, index) => (
                  <SwiperSlide
                    key={`${service.title}-${index}`}
                    className="!w-[500px] flex items-center justify-center"
                  >
                    <div className="transform transition-transform duration-300 py-12 px-6">
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
        .services-swiper {
          padding: 20px 0;
        }
        .services-swiper .swiper-slide {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.4;
          transform: scale(0.8);
        }
        .services-swiper .swiper-slide-active {
          opacity: 1;
          transform: scale(1);
        }
        .services-swiper .swiper-slide-prev,
        .services-swiper .swiper-slide-next {
          opacity: 0.6;
          transform: scale(0.85);
        }
        .services-swiper .swiper-button-next,
        .services-swiper .swiper-button-prev {
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }
        .services-swiper .swiper-button-next:hover,
        .services-swiper .swiper-button-prev:hover {
          color: white;
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
};

export default SectionWrapper(Services, "services");