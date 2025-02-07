import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { aboutContent } from "../constants";
import ThreePyramid from "./canvas/ThreePyramid";

const MVVDescription = ({ title, description, isVisible, onHover }) => {
  // MVVに応じて色を設定
  const getColorByTitle = (title) => {
    switch (title.toLowerCase()) {
      case 'mission':
        return '#8dd3c7';  // Mission: 爽やかな青緑
      case 'vision':
        return '#a4c9e3';  // Vision: 柔らかい青
      case 'value':
        return '#b4a7d6';  // Value: 落ち着いた紫
      default:
        return '#ffffff';
    }
  };

  if (!isVisible) return null;
  
  const textColor = getColorByTitle(title);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(title.toLowerCase());
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(null);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-2 border-transparent transition-all duration-300 p-6 rounded-2xl mb-4 last:mb-0 flex flex-col shadow-lg hover:shadow-xl relative"
      style={{
        backgroundColor: isHovered 
          ? `color-mix(in srgb, ${textColor} 15%, #232631)`
          : '#1d1836',
        borderColor: isHovered ? textColor : 'transparent',
        boxShadow: isHovered 
          ? `0 0 30px ${textColor}40, inset 0 0 50px ${textColor}20`
          : undefined,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered && (
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at center, ${textColor}10 0%, transparent 70%)`,
            mixBlendMode: 'overlay'
          }}
        />
      )}
      <h3 
        className="text-[24px] font-bold mb-5 transition-all duration-300 relative z-10"
        style={{ 
          color: textColor,
          textShadow: isHovered ? `0 0 15px ${textColor}99` : 'none',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {title}
      </h3>
      
      <div className="space-y-4 flex-grow relative z-10">
        <p 
          className="text-white text-[16px] tracking-wide leading-relaxed font-medium transition-colors duration-300"
          style={{
            color: isHovered ? 'white' : undefined,
            textShadow: isHovered ? `0 0 10px ${textColor}40` : 'none'
          }}
        >
          {description}
        </p>
        {aboutContent.cards.find(card => card.id.toLowerCase() === title.toLowerCase())?.subDescription && (
          <p 
            className="text-white/40 text-[13px] tracking-wide italic leading-relaxed pl-4 border-l transition-colors duration-300"
            style={{
              borderColor: isHovered ? textColor + '40' : '#4a4a8f30'
            }}
          >
            {aboutContent.cards.find(card => card.id.toLowerCase() === title.toLowerCase()).subDescription}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const About = () => {
  const [visibleLayers, setVisibleLayers] = useState([]);
  const [highlightedLayer, setHighlightedLayer] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const animationRef = useRef(null);

  const handleHover = (layerId) => {
    if (visibleLayers.includes(layerId) || layerId === null) {
      setHighlightedLayer(layerId);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          startAnimation();
        } else {
          setIsInView(false);
          setVisibleLayers([]);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '-10% 0px'
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

  const startAnimation = () => {
    if (animationRef.current) {
      Object.values(animationRef.current).forEach(timer => clearTimeout(timer));
    }

    setVisibleLayers([]);

    const sequence = [
      ['value'],
      ['value', 'vision'],
      ['value', 'vision', 'mission']
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

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        Object.values(animationRef.current).forEach(timer => clearTimeout(timer));
      }
    };
  }, []);

  const orderedCards = aboutContent.cards.slice().reverse();

  return (
    <div ref={sectionRef}>
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className={`${styles.sectionSubText} bg-gradient-to-r from-white/90 via-white/80 to-white/70 bg-clip-text text-transparent`}>
            {aboutContent.title}
          </p>
          <h2 className={`${styles.sectionHeadText} bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent`}>
            {aboutContent.subtitle}
          </h2>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row gap-20 items-center justify-center">
        <div className="relative w-full md:w-1/2">
          <ThreePyramid 
            visibleLayers={visibleLayers} 
            highlightedLayer={highlightedLayer}
          />
        </div>

        <div className="w-full md:w-1/2">
          {orderedCards.map((card) => (
            <MVVDescription
              key={card.id}
              title={card.title}
              description={card.description}
              isVisible={visibleLayers.includes(card.id.toLowerCase())}
              onHover={handleHover}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
