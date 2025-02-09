import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { news, newsContent } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const NewsCard = ({ news }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
        border: "2px solid transparent",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
        "&:hover": {
          background: "#232631",
          borderColor: "#4a4a8f",
          transform: "scale(1.02)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        }
      }}
      contentArrowStyle={{ borderRight: "7px solid #232631" }}
      date={news.date}
      iconStyle={{ 
        background: news.icon === "/orcx-logo.png" ? "#ffffff" : news.iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          <img
            src={news.icon}
            alt={news.title}
            className='w-[60%] h-[60%] object-contain'
          />
        </div>
      }
    >
      <div>
        <h3 className='text-white text-[24px] font-bold'>{news.title}</h3>
        <p
          className='text-secondary text-[16px] font-semibold'
          style={{ margin: 0 }}
        >
          {news.category}
        </p>
      </div>

      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {news.description.map((point, index) => (
          <li
            key={`news-point-${index}`}
            className='text-white-100 text-[14px] pl-1 tracking-wider'
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const News = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          {newsContent.title}
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          {newsContent.subtitle}
        </h2>
      </motion.div>

      <div className='mt-20 flex flex-col'>
        <VerticalTimeline>
          {news.map((item, index) => (
            <NewsCard
              key={`news-${index}`}
              news={item}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(News, "news"); 