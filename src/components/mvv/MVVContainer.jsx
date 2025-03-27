import React from "react";
import MVVDescription from "./MVVDescription";

// MVVの説明部分のコンテナコンポーネント
const MVVContainer = ({ orderedCards, visibleLayers, hoveredFromPyramid, onHover, className = "" }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 767;

  return (
    <div className={`w-full md:w-full ${isMobile ? '-mt-16' : '-mt-24'} relative h-auto md:h-[550px] ${className}`}>
      <div className="relative w-full h-full">
        {orderedCards.map((card, index) => {
          const isVisible = visibleLayers.includes(card.id.toLowerCase());
          // カードの位置を計算（Valueが一番下になるように）
          const getPosition = () => {
            switch (card.id.toLowerCase()) {
              case 'value': return 0;      // 一番下
              case 'vision': return 180;   // 真ん中
              case 'mission': return 360;  // 一番上
              default: return 0;
            }
          };

          // モバイル用スタイル計算
          const getMobileStyle = () => {
            const isMobile = window.innerWidth <= 767;
            if (!isMobile) {
              return {
                bottom: isVisible ? `${getPosition()}px` : '0px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible 
                  ? 'none' 
                  : 'translateX(120%) translateY(50px)',
                zIndex: getPosition() / 200, // zIndexも調整
                transition: 'transform 0.5s ease, opacity 0.5s ease',
              };
            }
            
            const mobilePositions = {
              'value': 0,
              'vision': 1,
              'mission': 2
            };
            
            const position = mobilePositions[card.id.toLowerCase()] || 0;
            
            return {
              position: 'relative',
              marginBottom: '15px',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : 'translateX(50px)',
              order: position,
              transition: 'transform 0.5s ease, opacity 0.5s ease',
              top: 'auto',
              bottom: 'auto'
            };
          };

          return (
            <div
              key={card.id}
              className="md:absolute w-full"
              style={getMobileStyle()}
            >
              <MVVDescription
                title={card.title}
                description={card.description}
                isVisible={isVisible}
                onHover={onHover}
                isHighlightedFromPyramid={hoveredFromPyramid === card.id.toLowerCase()}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(MVVContainer); 