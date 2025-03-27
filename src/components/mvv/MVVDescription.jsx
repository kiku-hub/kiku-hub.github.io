import React, { useState, useEffect, useMemo, useCallback } from "react";
import { aboutContent } from "../../constants";

// MVVDescriptionコンポーネントを別ファイルに分離
const MVVDescription = ({ title, description, isVisible: isVisibleProp, onHover, isHighlightedFromPyramid }) => {
  const cardDetails = useMemo(() => 
    aboutContent.cards.find(card => card.id.toLowerCase() === title.toLowerCase()),
    [title]
  );

  const textColor = useMemo(() => {
    switch (title.toLowerCase()) {
      case 'mission': return '#8dd3c7';
      case 'vision': return '#a4c9e3';
      case 'value': return '#b4a7d6';
      default: return '#ffffff';
    }
  }, [title]);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimationVisible, setIsAnimationVisible] = useState(false);
  const isMobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth <= 767, []);

  // アニメーションの状態管理を修正
  useEffect(() => {
    if (isVisibleProp) {
      // 少し遅延を入れてアニメーションを開始
      const timer = setTimeout(() => {
        setIsAnimationVisible(true);
      }, 50); // わずかな遅延を追加
      return () => clearTimeout(timer);
    } else {
      setIsAnimationVisible(false);
    }
  }, [isVisibleProp]);

  // 遅延時間を調整（より短い遅延に変更）
  const getDelay = useCallback(() => {
    switch (title.toLowerCase()) {
      case 'value': return 0;    // 最初の層
      case 'vision': return 1;   // 2番目の層（2から1に変更）
      case 'mission': return 2;  // 3番目の層（4から2に変更）
      default: return 0;
    }
  }, [title]);

  // スタイルをメモ化
  const styles = useMemo(() => ({
    container: {
      opacity: isAnimationVisible ? 1 : 0,
      transform: `translateX(${isAnimationVisible ? '0' : '120%'})`,
      backgroundColor: isHovered 
        ? `color-mix(in srgb, ${textColor} 15%, #232631)`
        : '#1d1836',
      borderColor: isHovered ? textColor : 'transparent',
      boxShadow: isHovered 
        ? `0 0 15px ${textColor}40`
        : 'none',
      transitionDelay: isMobile ? '0s' : `${getDelay() * 0.7}s`,
      transitionProperty: 'transform, opacity',
      transitionDuration: '0.5s',
      transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      willChange: 'transform, opacity, background-color, box-shadow',
      position: 'relative',
      width: '100%',
    },
    hoverScale: {
      transform: isHovered ? 'scale(1.01)' : 'scale(1)',
      transition: 'transform 0.2s ease',
    },
    title: {
      color: textColor,
      textShadow: isHovered ? `0 0 15px ${textColor}99` : 'none',
      transition: 'all 0.2s ease',
    },
    description: {
      color: isHovered ? 'white' : '#e0e0e0',
      textShadow: isHovered ? `0 0 10px ${textColor}40` : 'none',
      transition: 'all 0.2s ease',
      fontSize: isMobile ? '15px' : '16.5px',
      fontWeight: 'bold',
      '& strong': {
        color: 'white',
        fontWeight: '600',
      }
    },
    subDescription: {
      borderColor: isHovered ? textColor + '40' : '#4a4a8f30'
    },
    overlay: {
      opacity: isHovered ? 1 : 0,
      background: `radial-gradient(circle at center, ${textColor}08 0%, transparent 60%)`,
      transition: 'opacity 0.2s ease',
    }
  }), [isHovered, textColor, isAnimationVisible, getDelay, isMobile]);

  const handleMouseEnter = useCallback(() => {
    requestAnimationFrame(() => {
      setIsHovered(true);
      onHover(title.toLowerCase());
    });
  }, [onHover, title]);
  
  const handleMouseLeave = useCallback(() => {
    requestAnimationFrame(() => {
      setIsHovered(false);
      onHover(null);
    });
  }, [onHover]);

  useEffect(() => {
    setIsHovered(isHighlightedFromPyramid);
  }, [isHighlightedFromPyramid]);

  // モバイル用スタイル計算
  const getMobileStyleAdjustments = () => {
    if (typeof window === 'undefined') return {};
    const isMobile = window.innerWidth <= 767;
    if (!isMobile) return {};
    
    return {
      marginBottom: '30px'
    };
  };

  if (!isVisibleProp) return null;

  return (
    <div
      className="border-2 border-transparent p-5 md:p-5 p-4 rounded-xl mb-3 last:mb-0 flex flex-col shadow-md relative"
      style={{...styles.container, ...getMobileStyleAdjustments()}}
    >
      <div
        style={styles.hoverScale}
        className="relative w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="absolute inset-0 rounded-xl transition-opacity duration-300"
          style={styles.overlay}
        />
        <h3 
          className="text-[18px] md:text-[20px] font-bold mb-3 md:mb-4 relative z-10 transition-all duration-300"
          style={styles.title}
        >
          {title}
        </h3>
        
        <div className="space-y-2 md:space-y-3 flex-grow relative z-10">
          <p 
            className="text-[14px] md:text-[15px] tracking-wide leading-relaxed font-medium transition-all duration-300"
            style={styles.description}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          {cardDetails?.subDescription && (
            <p 
              className="text-white/40 text-[11px] md:text-[12px] tracking-wide italic leading-relaxed pl-3 border-l transition-all duration-300"
              style={styles.subDescription}
            >
              {cardDetails.subDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// メモ化したコンポーネントをエクスポート
export default React.memo(MVVDescription); 