import React from "react";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const ServiceCard = ({ index, title, description, points }) => {
  return (
    <Tilt className="xs:w-[350px] w-full">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className="w-full bg-[#003973] p-[1px] rounded-[20px]"
      >
        <div className="bg-[#003973] rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
          <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
          {description && (
            <p className="text-secondary text-[14px] text-center">
              {description}
            </p>
          )}
          {points && (
            <ul className="mt-4 list-disc ml-5 space-y-2">
              {points.map((point, index) => (
                <li
                  key={`service-point-${index}`}
                  className="text-white-100 text-[14px] pl-1 tracking-wider"
                >
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </Tilt>
  );
};

const Services = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>サービス
        </p>
        <h2 className={styles.sectionHeadText}>Services.</h2>
      </motion.div>

      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Services, "services"); 