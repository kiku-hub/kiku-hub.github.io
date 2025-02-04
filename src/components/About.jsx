import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { aboutContent } from "../constants";

const getIcon = (title) => {
  switch (title) {
    case 'Mission':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <circle cx="12" cy="12" r="8" className="stroke-white fill-white/20" />
          <circle cx="12" cy="12" r="6" className="stroke-white fill-white/20" />
          <circle cx="12" cy="12" r="4" className="stroke-white fill-white/20" />
          <circle cx="12" cy="12" r="2" className="stroke-white fill-white" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4l0 16" className="stroke-white" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12l-16 0" className="stroke-white" />
        </svg>
      );
    case 'Vision':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path d="M12 5.5C7 5.5 2.73 8.61 1 13c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" className="stroke-white fill-white/20" />
          <circle cx="12" cy="13" r="3.5" className="stroke-white fill-white" />
        </svg>
      );
    case 'Value':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} className="w-10 h-10">
          <path d="M12 3L4 11l8 8 8-8-8-8z M12 3L4 11h16L12 3z M12 3v16 M4 11h16" className="stroke-white" fill="none" />
        </svg>
      );
    default:
      return null;
  }
};

const ServiceCard = ({ index, title, icon, description, subDescription, points }) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className='w-full'
    >
      <motion.div
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className='bg-[#1d1836] hover:bg-[#232631] hover:border-[#4a4a8f] border-2 border-transparent transition-all duration-300 p-7 rounded-2xl w-full h-full flex flex-col'
      >
        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative"
          >
            <div className="w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0093E9] to-[#80D0C7] rounded-full opacity-20 blur-xl" />
              <div className="absolute inset-2 bg-gradient-to-br from-[#0093E9]/40 to-[#80D0C7]/40 rounded-full backdrop-blur-sm" />
              <div className="absolute inset-0 rounded-full border-2 border-[#bfdbfe]/20 animate-pulse" />
              <motion.div
                initial={{ y: 0 }}
                animate={{ 
                  y: [-2, 2, -2],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ 
                  y: -5, 
                  scale: 1.05,
                  transition: { 
                    type: "spring",
                    stiffness: 300,
                    damping: 15 
                  }
                }}
                className="relative z-10 p-4 rounded-full bg-gradient-to-br from-[#003973]/50 to-[#0093E9]/50 backdrop-blur-sm
                          transform transition-all duration-300 group"
              >
                <div className="text-[#bfdbfe] group-hover:text-white transition-colors duration-300
                            transform group-hover:scale-110 transition-transform">
                  {getIcon(title)}
                </div>
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
                            bg-gradient-to-r from-[#0093E9]/20 to-[#80D0C7]/20 blur-sm transition-opacity duration-300" />
              </motion.div>
            </div>
          </motion.div>
          
          <div className="flex flex-col items-center text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
            >
              <h3 className='text-white text-[32px] font-bold tracking-wider leading-tight mb-6'>
                {title}
              </h3>
            </motion.div>
            <motion.div className="w-full flex justify-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.4 }}
                className='text-[#bfdbfe] text-[32px] leading-relaxed font-semibold whitespace-nowrap'
              >
                {description}
              </motion.p>
            </motion.div>
            <motion.div className="w-full flex justify-center mt-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.45 }}
                className='text-white text-[15px] leading-relaxed italic'
              >
                {subDescription}
              </motion.p>
            </motion.div>
          </div>

          {points && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.5 }}
              className="space-y-4 w-full max-w-3xl"
            >
              {points.map((point, pointIndex) => (
                <motion.div
                  key={pointIndex}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + pointIndex * 0.1 }}
                  className="flex items-start gap-3 group bg-[#004483]/30 p-4 rounded-lg transition-colors duration-300"
                >
                  <motion.span
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    className="text-[#0093E9] mt-1 text-lg font-bold"
                  >
                    ▹
                  </motion.span>
                  <div className="flex flex-col gap-1">
                    <p className="text-white-100 text-[15px] tracking-wider leading-relaxed">
                      {point.ja || point}
                    </p>
                    {point.en && (
                      <p className="text-secondary text-[13px] tracking-wider italic leading-relaxed">
                        {point.en}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{aboutContent.title}</p>
        <h2 className={styles.sectionHeadText}>{aboutContent.subtitle}.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-white text-[17px] max-w-3xl leading-[30px]'
      >
        {aboutContent.description}
      </motion.p>

      <div className='mt-20 flex flex-wrap gap-10'>
        {aboutContent.cards.map((card, index) => (
          <ServiceCard key={card.title} index={index} {...card} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
