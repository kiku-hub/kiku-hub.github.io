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
      className="bg-[#1d1836] hover:bg-[#232631] hover:border-[#4a4a8f] border-2 border-transparent transition-all duration-300 p-7 rounded-2xl w-full h-full flex flex-col shadow-lg hover:shadow-xl"
    >
      <div className="w-full h-[200px] rounded-xl overflow-hidden relative group shadow-lg mb-8">
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

      <div className="mb-6">
        <h3 className="text-white text-[24px] font-bold text-center">
          {title}
        </h3>
      </div>

      <div className="space-y-6 flex-grow">
        <p className="text-secondary text-[14px] text-center">
          {description}
        </p>

        <div className="space-y-4">
          <ul className="list-disc ml-5">
            {points.map((point, pointIndex) => (
              <li key={pointIndex} className="text-white-100 text-[14px] pl-1 tracking-wider">
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
    return [itSolution, ...otherServices].map(service => ({
      ...service,
      image: service.title.includes('ITソリューション') 
        ? ITsolution 
        : service.title.includes('自社サービス') 
          ? CompanyServices 
          : service.title.includes('システム受託開発')
            ? Teameng
            : service.title.includes('AI サーバー')
              ? Datacenter
              : null
    }));
  }, []);

  // 3セット分のサービスを作成して無限スクロールを実現
  const tripleServices = [...sortedServices, ...sortedServices, ...sortedServices];

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center" style={{ paddingTop: '2vh' }}>
        <div className="w-full max-w-7xl mx-auto px-8 mb-4">
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

        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-[15%] h-full bg-gradient-to-r from-primary to-transparent pointer-events-none" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-[15%] h-full bg-gradient-to-l from-primary to-transparent pointer-events-none" />
          
          <Swiper
            modules={[Autoplay, EffectCoverflow, Navigation]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={3}
            speed={5000}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            autoplay={{
              delay: 0,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
              reverseDirection: true,
            }}
            navigation={true}
            className="services-swiper"
          >
            {tripleServices.map((service, index) => (
              <SwiperSlide
                key={`${service.title}-${index}`}
                className="!w-[500px] flex items-center justify-center"
              >
                <div className="p-4 transform transition-transform duration-300 hover:scale-105">
                  <ServiceCard {...service} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(Services, "services");