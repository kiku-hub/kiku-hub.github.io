import React, { useState, useEffect, useRef, useCallback, memo } from "react";
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

// 定数を分離
const TIMELINE_ELEMENT_STYLE = {
  background: "#1d1836",
  color: "#fff",
  border: "2px solid transparent",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
};

const TIMELINE_ELEMENT_HOVER = {
  background: "#232631",
  borderColor: "#4a4a8f",
  transform: "scale(1.02)",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
};

// 改行用のユーティリティ関数を追加
const formatText = (text) => {
  return text.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i !== text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
};

// メモ化したNewsCardコンポーネントを修正
const NewsCard = memo(({ news }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        ...TIMELINE_ELEMENT_STYLE,
        "&:hover": TIMELINE_ELEMENT_HOVER,
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
        <p className='text-secondary text-[16px] font-semibold' style={{ margin: 0 }}>
          {news.category}
        </p>
      </div>

      <div className='mt-5 space-y-2'>
        {news.description.map((point, index) => (
          <p
            key={`news-point-${index}`}
            className='text-white-100 text-[14px] tracking-wider'
          >
            {formatText(point)}
          </p>
        ))}
      </div>
    </VerticalTimelineElement>
  );
});

const News = () => {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 bg-transparent">
        <div>
          <p className={`${styles.sectionSubText} text-center`}>
            {newsContent.title}
          </p>
          <h2 className={`${styles.sectionHeadText} text-center`}>
            {newsContent.subtitle}
          </h2>
        </div>

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
      </div>
    </div>
  );
};

export default SectionWrapper(News, "news");