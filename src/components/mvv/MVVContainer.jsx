import React from "react";
import MVVDescription from "./MVVDescription";

// MVVの説明部分のコンテナコンポーネント
const MVVContainer = ({ orderedCards, visibleLayers, hoveredFromPyramid, onHover }) => {
  return (
    <div className="w-full md:w-1/2 -mt-4 relative overflow-hidden">
      <div className="relative">
        {orderedCards.map((card) => (
          <MVVDescription
            key={card.id}
            title={card.title}
            description={card.description}
            isVisible={visibleLayers.includes(card.id.toLowerCase())}
            onHover={onHover}
            isHighlightedFromPyramid={hoveredFromPyramid === card.id.toLowerCase()}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(MVVContainer); 