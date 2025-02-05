import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import ITsolution from "../assets/ITsolution.jpeg";
import CompanyServices from "../assets/CompanyServices.jpeg";
import Teameng from "../assets/Teameng.jpeg";
import Datacenter from "../assets/Datacenter.jpeg";

const ServiceCard = ({ index, title, description, points, icon, image, isActive }) => {
  return (
    <div className={`min-w-[300px] md:min-w-[400px] lg:min-w-[500px] snap-center transition-all duration-500 ${
      isActive ? 'scale-110 z-10' : 'scale-90 opacity-70'
    }`}>
      <motion.div
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        }}
        animate={{
          scale: isActive ? 1 : 0.85,
          opacity: isActive ? 1 : 0.7,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-[#1d1836] hover:bg-[#232631] hover:border-[#4a4a8f] border-2 border-transparent transition-all duration-300 p-7 rounded-2xl w-full h-full flex flex-col shadow-lg hover:shadow-xl mx-4"
        style={{
          zIndex: isActive ? 10 : 1,
        }}
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
    </div>
  );
};

const Services = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollRef = React.useRef(null);
  const [autoScroll, setAutoScroll] = React.useState(true);
  const cardWidth = React.useRef(0);
  const [initialized, setInitialized] = React.useState(false);
  const scrolling = React.useRef(false);
  const scrollTimeout = React.useRef(null);

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

  React.useLayoutEffect(() => {
    if (!initialized && scrollRef.current) {
      const firstCard = scrollRef.current.querySelector('.snap-center');
      if (firstCard) {
        cardWidth.current = firstCard.offsetWidth;
        setActiveIndex(0);
        setInitialized(true);
        scrollRef.current.scrollLeft = 0;
      }
    }
  }, [initialized]);

  const handleScroll = (e) => {
    if (!scrollRef.current || !initialized) return;
    
    const container = scrollRef.current;
    const currentScroll = container.scrollLeft;
    const currentIndex = Math.round(currentScroll / cardWidth.current);
    
    if (currentIndex !== activeIndex && currentIndex >= 0 && currentIndex < sortedServices.length) {
      setActiveIndex(currentIndex);
    }

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrolling.current = true;
    scrollTimeout.current = setTimeout(() => {
      scrolling.current = false;
    }, 150);
  };

  const scrollToCard = (index) => {
    if (!scrollRef.current || !initialized || scrolling.current) return;
    if (index < 0 || index >= sortedServices.length) return;

    const targetScroll = index * cardWidth.current;
    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  const handleMouseEnter = () => setAutoScroll(false);
  const handleMouseLeave = () => setAutoScroll(true);

  React.useEffect(() => {
    let intervalId;
    if (autoScroll && initialized && !scrolling.current) {
      intervalId = setInterval(() => {
        const nextIndex = (activeIndex + 1) % sortedServices.length;
        scrollToCard(nextIndex);
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [activeIndex, autoScroll, initialized, sortedServices.length]);

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
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="flex overflow-x-scroll snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              paddingLeft: 'calc(50% - 250px)',
              paddingRight: 'calc(50% - 250px)'
            }}
          >
            <div className="flex space-x-8 items-center py-4">
              {sortedServices.map((service, index) => {
                const isActive = index === activeIndex;
                const isPrev = index === activeIndex - 1;
                const isNext = index === activeIndex + 1;
                const isClickable = isPrev || isNext;
                
                return (
                  <motion.div
                    key={service.title}
                    className={`relative snap-center group ${isClickable ? 'cursor-pointer' : ''}`}
                    animate={{
                      scale: isActive ? 1.05 : 0.95,
                      opacity: isActive ? 1 : 0.8,
                      filter: isActive ? 'brightness(1)' : 'brightness(0.9)',
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      zIndex: isActive ? 10 : 1
                    }}
                    whileHover={isClickable ? {
                      scale: 1.05,
                      opacity: 1,
                      filter: 'brightness(1.1)',
                      transition: { duration: 0.2 }
                    } : undefined}
                    onClick={() => isClickable && scrollToCard(index)}
                  >
                    {isClickable && (
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center ${
                            isPrev ? 'mr-auto ml-4' : 'ml-auto mr-4'
                          }`}>
                            <motion.span
                              className="text-white text-2xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              {isPrev ? '←' : '→'}
                            </motion.span>
                          </div>
                        </div>
                      </div>
                    )}
                    <ServiceCard 
                      index={index} 
                      {...service} 
                      isActive={isActive}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-gradient-to-r from-primary to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-gradient-to-l from-primary to-transparent pointer-events-none" />
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {sortedServices.map((_, index) => (
            <div
              key={index}
              onClick={() => scrollToCard(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(Services, "services");