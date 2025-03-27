import React, { useState, useEffect, useMemo, useCallback } from "react";
import { aboutContent } from "../../constants";
import classNames from "classnames";

// MVVDescriptionコンポーネントを別ファイルに分離
const MVVDescription = ({ title, description, isVisible: isVisibleProp, onHover, isHighlightedFromPyramid }) => {
  const cardDetails = useMemo(() => 
    aboutContent.cards.find(card => card.id.toLowerCase() === title.toLowerCase()),
    [title]
  );

  // タイトルに基づいてコンテナインデックスを計算
  const containerIndex = useMemo(() => {
    switch (title.toLowerCase()) {
      case 'mission': return 2;
      case 'vision': return 1;
      case 'value': return 0;
      default: return 0;
    }
  }, [title]);

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
      opacity: isMobile ? 1 : (isAnimationVisible ? 1 : 0),
      transform: isMobile 
        ? 'none' 
        : `translateX(${isAnimationVisible ? '0' : '120%'})`,
      backgroundColor: isMobile 
        ? '#1d1836' 
        : (isHovered ? `color-mix(in srgb, ${textColor} 15%, #232631)` : '#1d1836'),
      borderColor: isMobile 
        ? 'transparent' 
        : (isHovered ? textColor : 'transparent'),
      boxShadow: isMobile 
        ? 'none' 
        : (isHovered ? `0 0 15px ${textColor}40` : 'none'),
      transitionDelay: isMobile ? '0s' : `${getDelay() * 0.7}s`,
      transitionProperty: isMobile ? 'none' : 'transform, opacity',
      transitionDuration: isMobile ? '0s' : '0.5s',
      transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      willChange: isMobile ? 'auto' : 'transform, opacity, background-color, box-shadow',
      position: 'relative',
      width: '100%',
    },
    hoverScale: {
      transform: isMobile ? 'scale(1)' : (isHovered ? 'scale(1.01)' : 'scale(1)'),
      transition: isMobile ? 'none' : 'transform 0.2s ease',
    },
    title: {
      color: textColor,
      textShadow: isMobile ? 'none' : (isHovered ? `0 0 15px ${textColor}99` : 'none'),
      transition: isMobile ? 'none' : 'all 0.2s ease',
    },
    description: {
      color: isMobile ? '#e0e0e0' : (isHovered ? 'white' : '#e0e0e0'),
      textShadow: isMobile ? 'none' : (isHovered ? `0 0 10px ${textColor}40` : 'none'),
      transition: isMobile ? 'none' : 'all 0.2s ease',
      fontSize: isMobile ? '15px' : '16.5px',
      fontWeight: 'bold',
      '& strong': {
        color: 'white',
        fontWeight: '600',
      }
    },
    subDescription: {
      borderColor: isMobile ? '#4a4a8f30' : (isHovered ? textColor + '40' : '#4a4a8f30')
    },
    overlay: {
      opacity: isMobile ? 0 : (isHovered ? 1 : 0),
      background: `radial-gradient(circle at center, ${textColor}08 0%, transparent 60%)`,
      transition: isMobile ? 'none' : 'opacity 0.2s ease',
    }
  }), [isHovered, textColor, isAnimationVisible, getDelay, isMobile]);

  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    requestAnimationFrame(() => {
      setIsHovered(true);
      onHover(title.toLowerCase());
    });
  }, [onHover, title, isMobile]);
  
  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    requestAnimationFrame(() => {
      setIsHovered(false);
      onHover(null);
    });
  }, [onHover, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    setIsHovered(isHighlightedFromPyramid);
  }, [isHighlightedFromPyramid, isMobile]);

  // モバイル用スタイル計算
  const getMobileStyleAdjustments = () => {
    if (typeof window === 'undefined') return {};
    const isMobile = window.innerWidth <= 767;
    if (!isMobile) return {};
    
    return {
      marginBottom: '15px'
    };
  };

  if (!isVisibleProp) return null;

  return (
    <div
      className={classNames('flex flex-col rounded-md border p-5 mb-7 sm:p-6 max-w-full', getMobileStyleAdjustments())}
      style={{
        ...styles.container,
        marginBottom: isMobile ? '15px' : '30px',
        padding: isMobile ? '15px' : '',
      }}
      onMouseEnter={isMobile ? undefined : () => setIsHovered(true)}
      onMouseLeave={isMobile ? undefined : () => setIsHovered(false)}
    >
      {/* オーバーレイ効果 */}
      <div 
        className="absolute top-0 left-0 w-full h-full rounded-md"
        style={styles.overlay}
      />
      {/* コンテンツコンテナ */}
      <div className="relative z-10" style={styles.hoverScale}>
        <h3 
          className="text-[18px] md:text-[20px] font-bold mb-2 md:mb-4 relative z-10 transition-all duration-300"
          style={styles.title}
        >
          {title}
        </h3>
        
        <div className="space-y-1 md:space-y-3 flex-grow relative z-10">
          <p 
            className="text-[14px] md:text-[15px] tracking-wide leading-relaxed font-medium transition-all duration-300"
            style={styles.description}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          {cardDetails?.subDescription && (
            <p 
              className="text-white/40 text-[11px] md:text-[12px] tracking-wide italic leading-relaxed pl-2 md:pl-3 border-l transition-all duration-300"
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