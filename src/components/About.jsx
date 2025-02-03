import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { aboutContent } from "../constants";

const ServiceCard = ({ index, title, icon, description, subDescription, points }) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className='w-full'
    >
      <Tilt
        options={{
          max: 25,
          scale: 1,
          speed: 450,
        }}
        className='bg-[#003973] hover:bg-[#004483] transition-colors duration-300 p-7 rounded-2xl w-full shadow-xl'
      >
        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-[#003973] to-[#0093E9] rounded-xl overflow-hidden relative group shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            <motion.div
              initial={{ y: 0 }}
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="text-5xl text-white/90 drop-shadow-lg transform transition-transform group-hover:scale-110 duration-300">
                {icon}
              </div>
            </motion.div>
          </motion.div>
          
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
            >
              <h3 className='text-white text-[32px] font-bold tracking-wider leading-tight mb-6'>
                {title}
              </h3>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.4 }}
              className='text-[#bfdbfe] text-[22px] leading-relaxed font-semibold max-w-2xl'
            >
              {description}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.45 }}
              className='text-secondary/80 text-[15px] leading-relaxed italic mt-4 max-w-2xl'
            >
              {subDescription}
            </motion.p>
          </div>

          {points && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.5 }}
              className="space-y-4 w-full max-w-3xl mt-4"
            >
              {points.map((point, pointIndex) => (
                <motion.div
                  key={pointIndex}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + pointIndex * 0.1 }}
                  className="flex items-start gap-3 group bg-[#004483]/30 p-4 rounded-lg hover:bg-[#004483]/50 transition-colors duration-300"
                >
                  <motion.span
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    className="text-[#0093E9] mt-1 text-lg font-bold"
                  >
                    ▹
                  </motion.span>
                  <div className="flex flex-col gap-1">
                    <p className="text-white-100 text-[15px] tracking-wider group-hover:text-[#80d0c7] transition-colors duration-300 leading-relaxed">
                      {point.ja || point}
                    </p>
                    {point.en && (
                      <p className="text-secondary/80 text-[13px] tracking-wider italic leading-relaxed">
                        {point.en}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </Tilt>
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

      <div className='mt-20 flex flex-col gap-8 max-w-7xl mx-auto'>
        {aboutContent.cards.map((card, index) => (
          <ServiceCard key={card.title} index={index} {...card} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
