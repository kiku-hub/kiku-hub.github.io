import React from "react";
import MVVDescription from "./MVVDescription";

// MVVの説明部分のコンテナコンポーネント
const MVVContainer = ({ orderedCards, visibleLayers, hoveredFromPyramid, onHover }) => {
  return (
    <div className="w-full md:w-1/2 -mt-4 relative h-[500px]">
      <div className="relative w-full h-full">
        {orderedCards.map((card, index) => {
          const isVisible = visibleLayers.includes(card.id.toLowerCase());
          // カードの位置を計算（Valueが一番下になるように）
          const getPosition = () => {
            switch (card.id.toLowerCase()) {
              case 'value': return 0;      // 一番下
              case 'vision': return 175;   // 真ん中 (200px上)
              case 'mission': return 350;  // 一番上 (400px上)
              default: return 0;
            }
          };

          return (
            <div
              key={card.id}
              className="absolute w-full transition-all duration-700"
              style={{
                bottom: isVisible ? `${getPosition()}px` : '0px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible 
                  ? 'none' 
                  : 'translateX(120%) translateY(50px)',
                zIndex: getPosition() / 200, // zIndexも調整
              }}
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