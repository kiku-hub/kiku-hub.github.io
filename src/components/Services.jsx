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
  const lastScrollTime = React.useRef(Date.now());
  const scrollVelocity = React.useRef(0);
  const scrollTimeout = React.useRef(null);
  const lastScrollLeft = React.useRef(0);
  const totalCards = 7; // より広い範囲でスクロール可能に

  // ITソリューションを先頭に配置
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

  // 表示用の配列を生成
  const displayServices = React.useMemo(() => {
    const repeated = Array(totalCards).fill(sortedServices).flat();
    return repeated;
  }, [sortedServices]);

  // 初期位置の設定
  React.useEffect(() => {
    if (scrollRef.current && !initialized) {
      const firstCard = scrollRef.current.querySelector('.snap-center');
      if (firstCard) {
        cardWidth.current = firstCard.offsetWidth;
        const middleSet = Math.floor(totalCards / 2);
        const initialScroll = cardWidth.current * (middleSet * sortedServices.length);
        scrollRef.current.scrollLeft = initialScroll;
        lastScrollLeft.current = initialScroll;
        setActiveIndex(0);
        setInitialized(true);
      }
    }
  }, [initialized, sortedServices.length]);

  const calculateMomentum = (currentScroll) => {
    const now = Date.now();
    const dt = Math.max(1, now - lastScrollTime.current);
    const dx = currentScroll - lastScrollLeft.current;
    
    scrollVelocity.current = dx / dt;
    lastScrollTime.current = now;
    lastScrollLeft.current = currentScroll;
  };

  const handleScroll = (e) => {
    if (!scrollRef.current || !initialized) return;
    
    const container = scrollRef.current;
    const currentScroll = container.scrollLeft;
    const setWidth = cardWidth.current * sortedServices.length;
    const middleSet = Math.floor(totalCards / 2);
    const middlePosition = setWidth * middleSet;
    
    calculateMomentum(currentScroll);

    // スクロール位置の正規化
    if (currentScroll < middlePosition - (setWidth * 2)) {
      const offset = setWidth * 2;
      const newScroll = currentScroll + offset;
      requestAnimationFrame(() => {
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = newScroll;
        container.style.scrollBehavior = 'smooth';
      });
      lastScrollLeft.current = newScroll;
    } else if (currentScroll > middlePosition + (setWidth * 2)) {
      const offset = setWidth * 2;
      const newScroll = currentScroll - offset;
      requestAnimationFrame(() => {
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = newScroll;
        container.style.scrollBehavior = 'smooth';
      });
      lastScrollLeft.current = newScroll;
    }

    // アクティブインデックスの更新（強制リセットを防ぐ）
    const currentIndex = Math.round(currentScroll / cardWidth.current);
    const normalizedIndex = currentIndex % sortedServices.length;
    const adjustedIndex = normalizedIndex < 0 ? sortedServices.length + normalizedIndex : normalizedIndex;
    
    if (adjustedIndex !== activeIndex) {
      setActiveIndex(adjustedIndex);
    }

    // スクロール状態の管理
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrolling.current = true;
    scrollTimeout.current = setTimeout(() => {
      scrolling.current = false;
      
      // スクロール終了時の微調整（必要な場合のみ）
      if (Math.abs(scrollVelocity.current) < 0.05) {
        const nearestCard = Math.round(currentScroll / cardWidth.current);
        const targetScroll = nearestCard * cardWidth.current;
        if (Math.abs(currentScroll - targetScroll) > 2) {
          container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
        }
      }
    }, 150);
  };

  const scrollToCard = (index, smooth = true) => {
    if (!scrollRef.current || !initialized || scrolling.current) return;
    
    const currentScroll = scrollRef.current.scrollLeft;
    const currentIndex = Math.round(currentScroll / cardWidth.current);
    const middleSet = Math.floor(totalCards / 2);
    const basePosition = middleSet * sortedServices.length;
    
    // 最短経路を計算
    const targetIndex = basePosition + index;
    const currentNormalizedIndex = currentIndex % sortedServices.length;
    const forwardDistance = (index - currentNormalizedIndex + sortedServices.length) % sortedServices.length;
    const backwardDistance = (currentNormalizedIndex - index + sortedServices.length) % sortedServices.length;
    
    let finalIndex;
    if (forwardDistance <= backwardDistance) {
      finalIndex = currentIndex + forwardDistance;
    } else {
      finalIndex = currentIndex - backwardDistance;
    }
    
    const targetScroll = finalIndex * cardWidth.current;
    
    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: smooth ? 'smooth' : 'auto'
    });
  };

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

  const handleMouseEnter = () => setAutoScroll(false);
  const handleMouseLeave = () => setAutoScroll(true);

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
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex px-[15%] space-x-8 items-center py-4">
              {displayServices.map((service, index) => (
                <div
                  key={`${service.title}-${index}`}
                  className="relative transition-all duration-500 ease-in-out cursor-pointer snap-center"
                  onClick={() => scrollToCard(index % sortedServices.length)}
                >
                  <ServiceCard 
                    index={index} 
                    {...service} 
                    isActive={index % sortedServices.length === activeIndex}
                  />
                </div>
              ))}
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