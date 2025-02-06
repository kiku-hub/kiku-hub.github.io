import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { aboutContent } from "../constants";
import ThreePyramid from "./canvas/ThreePyramid";

const MVVDescription = ({ index, title, japaneseTitle, description }) => {
  return (
    <motion.div
      variants={fadeIn("left", "spring", index * 0.5, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="flex flex-col mb-12 last:mb-0"
    >
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-3xl font-bold text-white">{title}</span>
        </div>
      </div>
      <div className="ml-14">
        <div className="text-white/90 text-lg font-medium mb-2">
          {japaneseTitle}
        </div>
        <p className="text-white/80 text-sm max-w-md leading-relaxed">
          {description}
        </p>
      </div>
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
        className='mt-4 text-white text-[17px] max-w-3xl leading-[30px] mb-20'
      >
        {aboutContent.description}
      </motion.p>

      <div className="flex flex-col md:flex-row gap-20 items-center justify-center">
        {/* Three.jsピラミッド */}
        <div className="relative w-full md:w-1/2">
          <ThreePyramid />
        </div>

        {/* 説明部分 */}
        <div className="w-full md:w-1/2">
          {aboutContent.cards.map((card, index) => (
            <MVVDescription
              key={card.title}
              index={index}
              title={card.title}
              japaneseTitle={card.japaneseTitle || card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
