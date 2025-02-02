import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { Tilt } from "react-tilt";

const ServiceCard = ({ index, title, description, points, icon }) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="w-full md:w-[48%]"
    >
      <Tilt
        options={{
          max: 25,
          scale: 1,
          speed: 450,
        }}
        className="bg-[#003973] hover:bg-[#004483] transition-colors duration-300 p-7 rounded-2xl w-full h-full flex flex-col shadow-xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.3 }}
          className="mb-8"
        >
          <h3 className="text-white text-[28px] font-bold tracking-wider">{title}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="w-full h-[200px] bg-gradient-to-br from-[#003973] to-[#0093E9] rounded-xl overflow-hidden relative group shadow-lg mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
          <motion.div
            initial={{ y: 0 }}
            whileHover={{ y: -10, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <div className="text-7xl text-white/90 drop-shadow-lg transform transition-transform group-hover:scale-110 duration-300">🚀</div>
          </motion.div>
        </motion.div>

        <div className="space-y-6 flex-grow">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.4 }}
            className="text-secondary text-[16px] leading-relaxed font-medium"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.5 }}
            className="space-y-4"
          >
            {points.map((point, pointIndex) => (
              <motion.div
                key={pointIndex}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + pointIndex * 0.1 }}
                className="flex items-start gap-3 group"
              >
                <motion.span
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  className="text-[#0093E9] mt-1 text-lg font-bold"
                >
                  ▹
                </motion.span>
                <p className="text-white-100 text-[15px] tracking-wider group-hover:text-[#80d0c7] transition-colors duration-300 leading-relaxed">
                  {point}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Services = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>サービス</p>
        <h2 className={`${styles.sectionHeadText}`}>Services.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
        </motion.p>
      </div>

      <div className="mt-20 flex flex-wrap justify-between gap-y-20">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Services, "services"); 