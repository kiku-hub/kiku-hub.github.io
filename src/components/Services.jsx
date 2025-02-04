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
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="min-w-[300px] md:min-w-[400px] lg:min-w-[500px] snap-center"
    >
      <motion.div
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        }}
        animate={{
          scale: isActive ? 1 : 0.7,
          opacity: isActive ? 1 : 0.5,
          filter: isActive ? 'blur(0px)' : 'blur(1px)',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-[#1d1836] hover:bg-[#232631] hover:border-[#4a4a8f] border-2 border-transparent transition-all duration-300 p-7 rounded-2xl w-full h-full flex flex-col shadow-lg hover:shadow-xl mx-4"
        style={{
          zIndex: isActive ? 10 : 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="w-full h-[200px] from-[#1d1836] to-[#232631] rounded-xl overflow-hidden relative group shadow-lg mb-8"
        >
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
              <motion.div
                initial={{ y: 0 }}
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex items-center justify-center"
              >
                <div className="text-7xl text-white/90 drop-shadow-lg transform transition-transform group-hover:scale-110 duration-300">
                  🚀
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.3 }}
          className="mb-6"
        >
          <h3 className="text-white text-[24px] font-bold text-center">
            {title}
          </h3>
        </motion.div>

        <div className="space-y-6 flex-grow">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.4 }}
            className="text-secondary text-[14px] text-center"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.5 }}
            className="space-y-4"
          >
            <ul className="list-disc ml-5">
              {points.map((point, pointIndex) => (
                <li key={pointIndex} className="text-white-100 text-[14px] pl-1 tracking-wider">
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Services = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollRef = React.useRef(null);
  const [autoScroll, setAutoScroll] = React.useState(true);

  const servicesWithImages = services.map(service => ({
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

  // 無限スクロール用に配列を3倍に複製
  const infiniteServices = [
    ...servicesWithImages,
    ...servicesWithImages,
    ...servicesWithImages
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      
      // 中央のセットにいる場合のインデックスを計算
      const normalizedIndex = newIndex % servicesWithImages.length;
      setActiveIndex(normalizedIndex);

      // 端に到達した場合、中央のセットにジャンプ
      if (scrollLeft < cardWidth) {
        // 左端に到達した場合
        scrollRef.current.scrollLeft = cardWidth * servicesWithImages.length;
      } else if (scrollLeft > cardWidth * (infiniteServices.length - servicesWithImages.length - 1)) {
        // 右端に到達した場合
        scrollRef.current.scrollLeft = cardWidth * servicesWithImages.length;
      }
    }
  };

  // 自動スクロール
  React.useEffect(() => {
    let intervalId;
    if (autoScroll && scrollRef.current) {
      intervalId = setInterval(() => {
        const nextIndex = (activeIndex + 1) % servicesWithImages.length;
        const cardWidth = scrollRef.current.offsetWidth;
        const targetScroll = (servicesWithImages.length + nextIndex) * cardWidth;
        
        scrollRef.current.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }, 3000); // 3秒ごとにスクロール
    }
    return () => clearInterval(intervalId);
  }, [activeIndex, autoScroll, servicesWithImages.length]);

  // マウスイベントで自動スクロールを制御
  const handleMouseEnter = () => setAutoScroll(false);
  const handleMouseLeave = () => setAutoScroll(true);

  return (
    <section className={`relative w-full h-screen mx-auto bg-gradient-to-b from-transparent to-[#0a0a0a] overflow-hidden`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <motion.div
        className="absolute inset-0 from-[#00a8ff]/5 via-transparent to-transparent"
        animate={{
          opacity: [0.3, 1, 0.3],
          filter: ["blur(4px)", "blur(2px)", "blur(4px)"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <div className="w-full max-w-7xl mx-auto px-8 mb-20">
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

          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            className="mt-4 text-secondary text-[18px] max-w-3xl mx-auto text-center leading-[30px]"
          >
            私たちは、最新のテクノロジーと専門知識を活用して、
            お客様のビジネスの成長と成功をサポートします。
          </motion.p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="flex overflow-x-scroll snap-x snap-mandatory hide-scrollbar scroll-smooth"
          >
            <div className="flex px-[10%] space-x-4 items-center">
              {infiniteServices.map((service, index) => (
                <div
                  key={`${service.title}-${index}`}
                  className="relative transition-all duration-500 ease-in-out"
                >
                  <ServiceCard 
                    index={index} 
                    {...service} 
                    isActive={index % servicesWithImages.length === activeIndex}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute left-0 top-0 bottom-0 w-[10%] bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-[10%] bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {servicesWithImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
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