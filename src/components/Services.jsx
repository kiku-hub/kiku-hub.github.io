import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const ServiceCard = ({ index, title, description, points, icon }) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="w-full flex flex-col lg:flex-row gap-8 bg-[#003973]/20 backdrop-blur-sm p-8 rounded-3xl hover:bg-[#003973]/30 transition-all duration-300"
    >
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
          <h3 className="text-white text-xl font-bold">{title}</h3>
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
    </motion.div>
  );
};

const Services = () => {
  return (
    <div className="min-h-screen">
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>サービス
        </p>
        <h2 className={`${styles.sectionHeadText}`}>Services.</h2>
      </motion.div>

      <div className="mt-20 flex flex-col gap-20">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Services, "services"); 