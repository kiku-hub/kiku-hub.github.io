import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { aboutContent } from "../constants";
import ThreePyramid from "./canvas/ThreePyramid";

const MVVDescription = ({ title, description, icon, isVisible }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col mb-12 last:mb-0"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{icon}</span>
              <span className="text-3xl font-bold text-white">{title}</span>
            </div>
          </div>
          <div className="ml-14">
            <p className="text-white/80 text-sm max-w-md leading-relaxed">
              {description}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const About = () => {
  const [visibleLayers, setVisibleLayers] = useState(['value']);
  
  useEffect(() => {
    // Value → Vision → Mission の順で表示
    const sequence = [
      ['value'],
      ['value', 'vision'],
      ['value', 'vision', 'mission']
    ];
    
    let currentIndex = 0;
    
    const timer = setInterval(() => {
      currentIndex++;
      if (currentIndex < sequence.length) {
        setVisibleLayers(sequence[currentIndex]);
      } else {
        clearInterval(timer);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // カードを逆順にして、Valueを最初に表示
  const orderedCards = [...aboutContent.cards].reverse();

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{aboutContent.title}</p>
        <h2 className={styles.sectionHeadText}>{aboutContent.subtitle}</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-white text-[17px] max-w-3xl leading-[30px] mb-20'
      >
        {aboutContent.description}
      </motion.p>

      <div className="flex flex-col md:flex-row gap-20 items-center justify-center">
        {/* Three.jsピラミッド */}
        <div className="relative w-full md:w-1/2">
          <ThreePyramid visibleLayers={visibleLayers} />
        </div>

        {/* 説明部分 */}
        <div className="w-full md:w-1/2">
          {orderedCards.map((card) => (
            <MVVDescription
              key={card.id}
              title={card.title}
              description={card.description}
              icon={card.icon}
              isVisible={visibleLayers.includes(card.id.toLowerCase())}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
