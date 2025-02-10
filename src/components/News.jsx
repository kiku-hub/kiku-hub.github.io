import React, { useState, useEffect, useRef, useCallback, memo } from "react";
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

// 定数を分離
const ANIMATION_CONFIG = {
  BALL_SIZE: 64,
  BOUNCE_DAMPING: 0.8,
  EDGE_BUFFER: 5,
  MIN_SPEED: 0.8,
  INITIAL_VELOCITY_RANGE: 2,
  ROTATION_SPEED_RANGE: 0.5,
};

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

// アニメーション設定を分離
const CARD_ANIMATION_CONFIG = {
  VELOCITY_RANGE: 2,
  BOUNCE_DAMPING: 0.8,
  MIN_SPEED: 0.8,
  FPS_NORMALIZE: 16
};

// 移動ロジックを分離
const calculateNewPosition = (current, velocity, parentRect, elementRect, deltaTime) => {
  let newX = current.x + velocity.vx * deltaTime;
  let newY = current.y + velocity.vy * deltaTime;
  let newVx = velocity.vx;
  let newVy = velocity.vy;

  // 境界チェックと跳ね返り
  if (newX <= 0 || newX >= parentRect.width - elementRect.width) {
    newVx = -newVx * CARD_ANIMATION_CONFIG.BOUNCE_DAMPING;
    newX = newX <= 0 ? 0 : parentRect.width - elementRect.width;
  }
  if (newY <= 0 || newY >= parentRect.height - elementRect.height) {
    newVy = -newVy * CARD_ANIMATION_CONFIG.BOUNCE_DAMPING;
    newY = newY <= 0 ? 0 : parentRect.height - elementRect.height;
  }

  return { newX, newY, newVx, newVy };
};

// 最小速度を保証する関数
const ensureMinimumSpeed = (vx, vy) => {
  const currentSpeed = Math.sqrt(vx * vx + vy * vy);
  if (currentSpeed < CARD_ANIMATION_CONFIG.MIN_SPEED) {
    const angle = Math.random() * Math.PI * 2;
    return {
      vx: Math.cos(angle) * CARD_ANIMATION_CONFIG.MIN_SPEED,
      vy: Math.sin(angle) * CARD_ANIMATION_CONFIG.MIN_SPEED
    };
  }
  return { vx, vy };
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({
    vx: (Math.random() - 0.5) * CARD_ANIMATION_CONFIG.VELOCITY_RANGE,
    vy: (Math.random() - 0.5) * CARD_ANIMATION_CONFIG.VELOCITY_RANGE
  });
  const elementRef = useRef(null);
  const animationFrameRef = useRef(null);

  // 初期位置の設定
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

  // アニメーションの実行
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / CARD_ANIMATION_CONFIG.FPS_NORMALIZE;
      lastTime = currentTime;

      const parentRect = element.parentElement.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      setPosition(prev => {
        const { newX, newY, newVx, newVy } = calculateNewPosition(
          prev,
          velocity,
          parentRect,
          elementRect,
          deltaTime
        );

        const { vx, vy } = ensureMinimumSpeed(newVx, newVy);
        if (vx !== velocity.vx || vy !== velocity.vy) {
          setVelocity({ vx, vy });
        }

        return { x: newX, y: newY };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [velocity]);

  return (
    <VerticalTimelineElement
      ref={elementRef}
      contentStyle={{
        ...TIMELINE_ELEMENT_STYLE,
        "&:hover": TIMELINE_ELEMENT_HOVER,
        transform: `translate(${position.x}px, ${position.y}px)`
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

// メモ化したBallコンポーネント
const Ball = memo(({ position, icon }) => (
  <div
    className='absolute w-16 h-16'
    style={{
      transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotation}deg)`,
      transition: 'transform 0.016s linear',
      opacity: 0.8,
      pointerEvents: 'none'
    }}
  >
    <BallCanvas icon={icon} />
  </div>
));

// 初期位置と速度の生成関数
const createInitialState = () => ({
  x: 0,
  y: 0,
  vx: (Math.random() - 0.5) * ANIMATION_CONFIG.INITIAL_VELOCITY_RANGE,
  vy: (Math.random() - 0.5) * ANIMATION_CONFIG.INITIAL_VELOCITY_RANGE,
  rotation: Math.random() * 360,
  rotationSpeed: (Math.random() - 0.5) * ANIMATION_CONFIG.ROTATION_SPEED_RANGE
});

const TechSection = () => {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const positionsRef = useRef(technologies.map(createInitialState));
  const [positions, setPositions] = useState(positionsRef.current);

  const handleResize = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setContainerSize({
      width: rect.width,
      height: rect.height
    });
    
    positionsRef.current = positionsRef.current.map(pos => ({
      ...pos,
      x: Math.random() * (rect.width - ANIMATION_CONFIG.BALL_SIZE),
      y: Math.random() * (rect.height - ANIMATION_CONFIG.BALL_SIZE)
    }));
    setPositions(positionsRef.current);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    let lastTime = performance.now();
    
    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 16;
      lastTime = currentTime;

      positionsRef.current = positionsRef.current.map(updateBallPosition(containerSize, deltaTime));
      setPositions([...positionsRef.current]);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
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
      {positions.map((position, index) => (
        <Ball
          key={technologies[index].name}
          position={position}
          icon={technologies[index].icon}
        />
      ))}
    </div>
  );
};

// ボールの位置更新ロジックを分離
const updateBallPosition = (containerSize, deltaTime) => (pos) => {
  let newX = pos.x + pos.vx * deltaTime;
  let newY = pos.y + pos.vy * deltaTime;
  let newVx = pos.vx;
  let newVy = pos.vy;
  let newRotation = (pos.rotation + pos.rotationSpeed * deltaTime) % 360;

  // 境界チェックと跳ね返り
  if (newX <= ANIMATION_CONFIG.EDGE_BUFFER) {
    newX = ANIMATION_CONFIG.EDGE_BUFFER;
    newVx = Math.abs(newVx) * ANIMATION_CONFIG.BOUNCE_DAMPING;
  } else if (newX >= containerSize.width - ANIMATION_CONFIG.BALL_SIZE - ANIMATION_CONFIG.EDGE_BUFFER) {
    newX = containerSize.width - ANIMATION_CONFIG.BALL_SIZE - ANIMATION_CONFIG.EDGE_BUFFER;
    newVx = -Math.abs(newVx) * ANIMATION_CONFIG.BOUNCE_DAMPING;
  }

  if (newY <= ANIMATION_CONFIG.EDGE_BUFFER) {
    newY = ANIMATION_CONFIG.EDGE_BUFFER;
    newVy = Math.abs(newVy) * ANIMATION_CONFIG.BOUNCE_DAMPING;
  } else if (newY >= containerSize.height - ANIMATION_CONFIG.BALL_SIZE - ANIMATION_CONFIG.EDGE_BUFFER) {
    newY = containerSize.height - ANIMATION_CONFIG.BALL_SIZE - ANIMATION_CONFIG.EDGE_BUFFER;
    newVy = -Math.abs(newVy) * ANIMATION_CONFIG.BOUNCE_DAMPING;
  }

  // 最小速度の保証
  const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
  if (currentSpeed < ANIMATION_CONFIG.MIN_SPEED) {
    const angle = Math.random() * Math.PI * 2;
    newVx = Math.cos(angle) * ANIMATION_CONFIG.MIN_SPEED;
    newVy = Math.sin(angle) * ANIMATION_CONFIG.MIN_SPEED;
  }

  return {
    x: newX,
    y: newY,
    vx: newVx,
    vy: newVy,
    rotation: newRotation,
    rotationSpeed: pos.rotationSpeed
  };
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