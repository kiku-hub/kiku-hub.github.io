import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { aboutContent } from "../constants";
import ThreePyramid from "./canvas/ThreePyramid";

const MVVDescription = ({ title, description, icon, isVisible }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col mb-12 last:mb-0"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{icon}</span>
              <span className="text-3xl font-bold text-white">{title}</span>
            </div>
          </div>
          <div className="ml-14">
            <p className="text-white/80 text-sm max-w-md leading-relaxed">
              {description}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const About = () => {
  const [visibleLayers, setVisibleLayers] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const animationRef = useRef(null);

  // Intersection Observerの設定
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 要素が表示領域に入った時
        if (entry.isIntersecting) {
          setIsInView(true);
          startAnimation();
        } else {
          // 要素が表示領域から出た時
          setIsInView(false);
          setVisibleLayers([]);
        }
      },
      {
        threshold: 0.3 // 30%見えたら開始
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // アニメーションの開始
  const startAnimation = () => {
    // 前回のアニメーションをクリア
    if (animationRef.current) {
      Object.values(animationRef.current).forEach(timer => clearTimeout(timer));
    }

    // 新しいアニメーションを開始
    setVisibleLayers([]); // リセット

    const sequence = [
      ['value'],                    // 最下層
      ['value', 'vision'],          // 中間層を追加
      ['value', 'vision', 'mission'] // 最上層を追加
    ];

    animationRef.current = {
      timer1: setTimeout(() => {
        setVisibleLayers(sequence[0]);
      }, 500),

      timer2: setTimeout(() => {
        setVisibleLayers(sequence[1]);
      }, 2500),

      timer3: setTimeout(() => {
        setVisibleLayers(sequence[2]);
      }, 4500)
    };
  };

  // コンポーネントのクリーンアップ
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        Object.values(animationRef.current).forEach(timer => clearTimeout(timer));
      }
    };
  }, []);

  // カードを下から上の順に表示
  const orderedCards = aboutContent.cards.slice().reverse();

  return (
    <div ref={sectionRef}>
      <div className="text-center mb-20">
        <p className={styles.sectionSubText}>{aboutContent.title}</p>
        <h2 className={styles.sectionHeadText}>{aboutContent.subtitle}</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-20 items-center justify-center">
        {/* Three.jsピラミッド */}
        <div className="relative w-full md:w-1/2">
          <ThreePyramid visibleLayers={visibleLayers} />
        </div>

        {/* 説明部分 */}
        <div className="w-full md:w-1/2">
          {orderedCards.map((card) => (
            <MVVDescription
              key={card.id}
              title={card.title}
              description={card.description}
              icon={card.icon}
              isVisible={visibleLayers.includes(card.id.toLowerCase())}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
