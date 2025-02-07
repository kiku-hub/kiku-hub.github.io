import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { aboutContent } from "../constants";
import ThreePyramid from "./canvas/ThreePyramid";

const MVVDescription = ({ title, description, isVisible }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.7,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
          }}
          className="bg-[#1d1836] hover:bg-[#232631] hover:border-[#4a4a8f] border-2 border-transparent transition-all duration-300 p-6 rounded-2xl mb-4 last:mb-0 flex flex-col shadow-lg hover:shadow-xl"
        >
          <motion.div
            className="relative mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white text-[24px] font-bold bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent">
              {title}
            </h3>
          </motion.div>
          
          <motion.div 
            className="space-y-4 flex-grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-white text-[16px] tracking-wide leading-relaxed font-medium">
              {description}
            </p>
            {aboutContent.cards.find(card => card.id.toLowerCase() === title.toLowerCase())?.subDescription && (
              <p className="text-white/40 text-[13px] tracking-wide italic leading-relaxed pl-4 border-l border-[#4a4a8f]/30">
                {aboutContent.cards.find(card => card.id.toLowerCase() === title.toLowerCase()).subDescription}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const About = () => {
  const [visibleLayers, setVisibleLayers] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          startAnimation();
        } else {
          setIsInView(false);
          setVisibleLayers([]);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '-10% 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const startAnimation = () => {
    if (animationRef.current) {
      Object.values(animationRef.current).forEach(timer => clearTimeout(timer));
    }

    setVisibleLayers([]);

    const sequence = [
      ['value'],
      ['value', 'vision'],
      ['value', 'vision', 'mission']
    ];

    animationRef.current = {
      timer1: setTimeout(() => {
        setVisibleLayers(sequence[0]);
      }, 500),

      timer2: setTimeout(() => {
        setVisibleLayers(sequence[1]);
      }, 2500),

      timer3: setTimeout(() => {
        setVisibleLayers(sequence[2]);
      }, 4500)
    };
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        Object.values(animationRef.current).forEach(timer => clearTimeout(timer));
      }
    };
  }, []);

  const orderedCards = aboutContent.cards.slice().reverse();

  return (
    <div ref={sectionRef}>
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className={`${styles.sectionSubText} bg-gradient-to-r from-white/90 via-white/80 to-white/70 bg-clip-text text-transparent`}>
            {aboutContent.title}
          </p>
          <h2 className={`${styles.sectionHeadText} bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent`}>
            {aboutContent.subtitle}
          </h2>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row gap-20 items-center justify-center">
        <div className="relative w-full md:w-1/2">
          <ThreePyramid visibleLayers={visibleLayers} />
        </div>

        <div className="w-full md:w-1/2">
          {orderedCards.map((card) => (
            <MVVDescription
              key={card.id}
              title={card.title}
              description={card.description}
              isVisible={visibleLayers.includes(card.id.toLowerCase())}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
