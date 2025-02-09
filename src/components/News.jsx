import React, { useState, useEffect, useRef } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import { BallCanvas } from "./canvas";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { news, newsContent, technologies } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const NewsCard = ({ news }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2
  });
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const parentRect = element.parentElement.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    setPosition({
      x: Math.random() * (parentRect.width - elementRect.width),
      y: Math.random() * (parentRect.height - elementRect.height)
    });
  }, []);

  useEffect(() => {
    let animationFrameId;
    const element = elementRef.current;
    if (!element) return;

    const parentRect = element.parentElement.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const animate = () => {
      setPosition(prev => {
        let newX = prev.x + velocity.vx;
        let newY = prev.y + velocity.vy;
        let newVx = velocity.vx;
        let newVy = velocity.vy;

        if (newX <= 0 || newX >= parentRect.width - elementRect.width) {
          newVx = -newVx;
          setVelocity(v => ({ ...v, vx: newVx }));
        }
        if (newY <= 0 || newY >= parentRect.height - elementRect.height) {
          newVy = -newVy;
          setVelocity(v => ({ ...v, vy: newVy }));
        }

        return {
          x: newX,
          y: newY
        };
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [velocity]);

  return (
    <VerticalTimelineElement
      ref={elementRef}
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
        border: "2px solid transparent",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
        transform: `translate(${position.x}px, ${position.y}px)`,
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

const TechSection = () => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [positions, setPositions] = useState(
    technologies.map(() => ({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.5
    }))
  );

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height
        });
        setPositions(prev => prev.map(pos => ({
          ...pos,
          x: Math.random() * (rect.width - 80),
          y: Math.random() * (rect.height - 80)
        })));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getRandomVelocity = () => {
    const speed = 1 + Math.random() * 7;
    const angle = Math.random() * Math.PI * 2;
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotationSpeed: (Math.random() - 0.5) * 0.5
    };
  };

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    let animationFrameId;
    
    const animate = () => {
      setPositions(prevPositions => 
        prevPositions.map(pos => {
          let newX = pos.x + pos.vx;
          let newY = pos.y + pos.vy;
          let newVx = pos.vx;
          let newVy = pos.vy;
          let newRotation = (pos.rotation + pos.rotationSpeed) % 360;
          
          const BALL_SIZE = 64; // w-16 = 64px
          const BOUNCE_DAMPING = 0.8; // 跳ね返り時の減衰
          const EDGE_BUFFER = 5; // 端からの余白

          // 横方向の跳ね返り
          if (newX <= EDGE_BUFFER) {
            newX = EDGE_BUFFER;
            newVx = Math.abs(newVx) * BOUNCE_DAMPING; // 右向きに跳ね返る
          } else if (newX >= containerSize.width - BALL_SIZE - EDGE_BUFFER) {
            newX = containerSize.width - BALL_SIZE - EDGE_BUFFER;
            newVx = -Math.abs(newVx) * BOUNCE_DAMPING; // 左向きに跳ね返る
          }

          // 縦方向の跳ね返り
          if (newY <= EDGE_BUFFER) {
            newY = EDGE_BUFFER;
            newVy = Math.abs(newVy) * BOUNCE_DAMPING; // 下向きに跳ね返る
          } else if (newY >= containerSize.height - BALL_SIZE - EDGE_BUFFER) {
            newY = containerSize.height - BALL_SIZE - EDGE_BUFFER;
            newVy = -Math.abs(newVy) * BOUNCE_DAMPING; // 上向きに跳ね返る
          }

          // 最小速度を上げる
          const MIN_SPEED = 0.8;
          const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
          if (currentSpeed < MIN_SPEED) {
            const angle = Math.random() * Math.PI * 2;
            newVx = Math.cos(angle) * MIN_SPEED;
            newVy = Math.sin(angle) * MIN_SPEED;
          }

          return {
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: newRotation,
            rotationSpeed: pos.rotationSpeed
          };
        })
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [containerSize]);

  return (
    <div 
      ref={containerRef}
      className='relative w-full h-[600px]'
      style={{ 
        overflow: 'hidden',
        marginTop: '2rem'
      }}
    >
      {technologies.map((technology, index) => (
        <div
          className='absolute w-16 h-16'
          key={technology.name}
          style={{
            transform: `translate(${positions[index]?.x}px, ${positions[index]?.y}px) rotate(${positions[index]?.rotation}deg)`,
            transition: 'transform 0.016s linear',
            opacity: 0.8
          }}
        >
          <BallCanvas icon={technology.icon} />
        </div>
      ))}
    </div>
  );
};

const News = () => {
  return (
    <div className="relative min-h-screen">
      {/* 背景として3Dモデルを配置 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <TechSection />
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 bg-transparent">
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
      </div>
    </div>
  );
};

export default SectionWrapper(News, "news");