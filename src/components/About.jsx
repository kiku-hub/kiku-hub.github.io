import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { aboutContent } from "../constants";
import ThreePyramid from "./canvas/ThreePyramidOptimized";
import MVVContainer from "./mvv/MVVContainer";
import { useMediaQuery } from "../hooks";

const About = () => {
  const [visibleLayers, setVisibleLayers] = useState([]);
  const [highlightedLayer, setHighlightedLayer] = useState(null);
  const [hoveredFromPyramid, setHoveredFromPyramid] = useState(null);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  // モバイルデバイスかどうかを検出
  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleHover = useCallback((layerId) => {
    if (visibleLayers.includes(layerId) || layerId === null) {
      setHighlightedLayer(layerId);
    }
  }, [visibleLayers]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          const sequence = [
            ['value'],
            ['value', 'vision'],
            ['value', 'vision', 'mission']
          ];

          sequence.forEach((layers, index) => {
            setTimeout(() => {
              setVisibleLayers(layers);
            }, index * 700);
          });

          setHasAnimated(true);
        }
      },
      { threshold: 0.3, rootMargin: '-10% 0px' }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [hasAnimated]);

  return (
    <div ref={sectionRef}>
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          variants={textVariant()}
          animate={hasAnimated ? "show" : "hidden"}
        >
          <p className={`${styles.sectionSubText} text-secondary`}>
            {aboutContent.title}
          </p>
          <h2 className={`${styles.sectionHeadText} text-white`}>
            {aboutContent.subtitle}
          </h2>
        </motion.div>
      </div>

      <div className={`flex flex-col ${!isMobile ? 'md:flex-row' : ''} gap-16 items-center justify-center -mt-8`}>
        {/* モバイルでない場合のみ3Dピラミッドを表示 */}
        {!isMobile && (
          <div className="relative w-full md:w-1/2">
            <ThreePyramid 
              visibleLayers={visibleLayers} 
              highlightedLayer={highlightedLayer}
              onLayerHover={useCallback((layerId) => {
                setHoveredFromPyramid(layerId);
                setHighlightedLayer(layerId);
              }, [])}
            />
          </div>
        )}

        <MVVContainer
          orderedCards={aboutContent.cards.slice().reverse()}
          visibleLayers={visibleLayers}
          hoveredFromPyramid={hoveredFromPyramid}
          onHover={handleHover}
          className={isMobile ? "w-full" : ""}
        />
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
