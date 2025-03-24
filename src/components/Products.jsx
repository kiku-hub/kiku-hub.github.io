import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { images } from "../assets";
import { useMediaQuery } from "../hooks";

const ProjectCard = ({
  index,
  name,
  subtitle,
  description,
  image,
  source_code_link,
}) => {
  // 画像オブジェクトの取得（文字列の場合はcomingsoonを使用）
  const imageObj = typeof image === 'string' ? images.comingsoon : image;
  // モバイルデバイスかどうかを検出
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <motion.div 
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className='w-full'>
      <motion.div
        whileHover={!isMobile ? {
          scale: 1.02,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        } : undefined}
        transition={{
          duration: 0.3,
        }}
        className={`bg-[#1d1836] ${isMobile ? 'border-2 border-[#4a4a8f]' : 'hover:bg-[#232631] hover:border-[#4a4a8f] border-2 border-transparent'} transition-all duration-300 p-5 rounded-2xl w-full ${isMobile ? 'mx-auto' : 'sm:w-[550px] md:w-[650px] lg:w-[800px] mx-auto'} shadow-lg ${!isMobile && 'hover:shadow-xl'}`}
      >
        <motion.div
          variants={fadeIn("", "", index * 0.2, 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "100px" }}
          className='w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] bg-gradient-to-br from-[#1d1836] to-[#232631] rounded-xl overflow-hidden relative group shadow-lg mb-8'
        >
          <picture>
            {imageObj.webp && <source srcSet={imageObj.webp} type="image/webp" />}
            <img
              src={imageObj.src}
              alt={`${name} - ${subtitle}`}
              className='w-full h-full object-cover rounded-2xl transition-all duration-500 group-hover:scale-110'
              loading="lazy"
              width="800"
              height="450"
              decoding="async"
              fetchpriority="low"
              onLoad={(e) => {
                e.target.classList.remove('opacity-0');
              }}
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10" />
        </motion.div>

        <div className="text-white text-[20px] font-bold mb-3 text-center">
          {name}
        </div>
        <div className="text-secondary text-[16px] mb-4 text-center">
          {subtitle}
        </div>
        <p className="text-white-100 text-[14px] leading-relaxed tracking-wider whitespace-pre-line">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
};

const Products = () => {
  // モバイルデバイスかどうかを検出
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <section className={`relative w-full h-screen mx-auto bg-gradient-to-b from-transparent to-[#0a0a0a]`}>
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

      <div className={`absolute inset-0 ${isMobile ? 'top-[42%]' : 'top-[40%]'} -translate-y-1/2 max-w-7xl mx-auto ${styles.paddingX} flex flex-col items-center justify-center`}>
        <motion.div 
          variants={textVariant()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-2"
        >
          <p className={styles.sectionSubText}>製品</p>
          <h2 className={styles.sectionHeadText}>Products.</h2>
        </motion.div>

        <div className='mt-2 flex flex-wrap gap-7 justify-center'>
          {projects.map((project, index) => (
            <ProjectCard key={`project-${index}`} index={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(Products, "products");
