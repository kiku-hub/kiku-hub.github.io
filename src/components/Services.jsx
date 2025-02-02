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
      className="w-full"
    >
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-[#003973] p-5 rounded-2xl w-full max-w-[1100px] mx-auto"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="lg:w-1/3 aspect-square bg-gradient-to-br from-[#003973] to-[#0093E9] rounded-2xl overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            <motion.div
              initial={{ y: 0 }}
              whileHover={{ y: -10 }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="text-6xl text-white/90">🚀</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent"
            >
              <h3 className="text-white text-[24px] font-bold">{title}</h3>
            </motion.div>
          </motion.div>

          <div className="lg:w-2/3 space-y-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.4 }}
              className="text-secondary text-[16px] leading-relaxed"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.5 }}
              className="space-y-2"
            >
              {points.map((point, pointIndex) => (
                <motion.div
                  key={pointIndex}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + pointIndex * 0.1 }}
                  className="flex items-start gap-2 group"
                >
                  <motion.span
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    className="text-[#0093E9] mt-1"
                  >
                    ▹
                  </motion.span>
                  <p className="text-white-100 text-[14px] tracking-wider group-hover:text-[#80d0c7] transition-colors duration-300">
                    {point}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Services = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>サービス
        </p>
        <h2 className={`${styles.sectionHeadText}`}>Services.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
        </motion.p>
      </div>

      <div className="mt-20 flex flex-col gap-20">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Services, "services"); 