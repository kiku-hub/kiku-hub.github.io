import React from "react";
import { motion } from "framer-motion";
import { 
  BiBuildingHouse,
  BiCalendar,
  BiMap,
  BiUser,
  BiMoney,
  BiGroup,
  BiEnvelope,
  BiGlobe,
  BiCodeAlt
} from "react-icons/bi";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { companyInfo } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const GoogleMap = () => {
  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3242.2775373574396!2d139.64547687677862!3d35.64493497259684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f4a8947ee8c9%3A0x47c42964457c7336!2z44CSMTU0LTAwMTcg5p2x5Lqs6YO95LiW55Sw6LC35Yy65LiL6aas5a-65Y2X77yU5LiB55uu77yR77yY4oiS77yX!5e0!3m2!1sja!2sjp!4v1707301725644!5m2!1sja!2sjp"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

const CompanyDetail = ({ label, value, icon, index }) => {
  const isClickable = icon === 'email' || icon === 'website';
  const href = icon === 'email' ? `mailto:${value}` : icon === 'website' ? value : null;

  const content = (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm">
        {getIcon(icon)}
      </div>
      <div className="flex-1">
        <h3 className="text-[13px] text-secondary tracking-wider">
          {label}
        </h3>
        <p className="text-white text-[15px] font-medium">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      variants={fadeIn("right", "spring", index * 0.1, 0.75)}
      className={`w-full bg-tertiary/20 backdrop-blur-sm p-3 rounded-lg border border-white/5
        ${isClickable ? 'hover:bg-tertiary/30 cursor-pointer' : ''}`}
    >
      {isClickable ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      ) : (
        content
      )}
    </motion.div>
  );
};

const getIcon = (iconName) => {
  const iconMap = {
    building: BiBuildingHouse,
    calendar: BiCalendar,
    location: BiMap,
    user: BiUser,
    money: BiMoney,
    users: BiGroup,
    email: BiEnvelope,
    website: BiGlobe,
    service: BiCodeAlt
  };
  const IconComponent = iconMap[iconName] || BiBuildingHouse;
  return <IconComponent size={24} className="text-white" />;
};

const Company = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          {companyInfo.title}
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          {companyInfo.subtitle}
        </h2>
      </motion.div>

      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        <motion.div 
          variants={fadeIn("right", "spring", 0.2, 0.75)}
          className="flex-1"
        >
          <div className="flex flex-col space-y-2">
            {companyInfo.details.map((detail, index) => (
              <CompanyDetail
                key={detail.label}
                index={index}
                {...detail}
              />
            ))}
          </div>
        </motion.div>

        <motion.div 
          variants={fadeIn("left", "spring", 0.3, 0.75)}
          className="flex-1 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]"
        >
          <div className="bg-tertiary/20 backdrop-blur-sm p-2 rounded-lg border border-white/5 h-full">
            <GoogleMap />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SectionWrapper(Company, "company");
