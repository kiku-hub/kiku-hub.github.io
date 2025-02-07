import React from "react";
import { motion } from "framer-motion";
import { 
  BiBuildingHouse,
  BiCalendar,
  BiMap,
  BiUser,
  BiMoney,
  BiGroup
} from "react-icons/bi";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { companyInfo } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const getIcon = (iconName) => {
  const iconMap = {
    building: BiBuildingHouse,
    calendar: BiCalendar,
    location: BiMap,
    user: BiUser,
    money: BiMoney,
    users: BiGroup
  };
  const IconComponent = iconMap[iconName] || BiBuildingHouse;
  return <IconComponent size={24} />;
};

const CompanyDetail = ({ label, value, icon, index }) => {
  return (
    <motion.div
      variants={fadeIn("right", "spring", 0.2 * index, 0.75)}
      className="w-full md:w-[48%] bg-black-200 p-6 rounded-2xl"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5">
          {getIcon(icon)}
        </div>
        <div>
          <h3 className="text-white text-[18px] font-bold">
            {label}
          </h3>
          <p className="text-secondary text-[16px] font-semibold">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Company = () => {
  return (
    <>
      <div className="mt-12 bg-black-100 rounded-[20px]">
        <div className="bg-tertiary rounded-2xl sm:px-16 px-6 sm:py-16 py-10 min-h-[300px]">
          <motion.div variants={textVariant()}>
            <p className={styles.sectionSubText}>
              {companyInfo.title}
            </p>
            <h2 className={styles.sectionHeadText}>
              {companyInfo.subtitle}
            </h2>
          </motion.div>
        </div>

        <div className="sm:px-16 px-6 -mt-16">
          <div className="flex flex-wrap justify-between gap-7 mb-14">
            {companyInfo.details.map((detail, index) => (
              <CompanyDetail
                key={detail.label}
                index={index}
                {...detail}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Company, "company");
