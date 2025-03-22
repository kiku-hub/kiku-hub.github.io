import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { aboutContent } from "../constants";
import ThreePyramid from "./canvas/ThreePyramidOptimized";
import MVVContainer from "./mvv/MVVContainer";
import useMediaQuery from "../hooks/useMediaQuery";

const About = () => {
  const [visibleLayers, setVisibleLayers] = useState([]);
  const [highlightedLayer, setHighlightedLayer] = useState(null);
  const [hoveredFromPyramid, setHoveredFromPyramid] = useState(null);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
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
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (hoveredFromPyramid) {
      handleHover(hoveredFromPyramid);
    }
  }, [hoveredFromPyramid, handleHover]);

  return (
    <div ref={sectionRef} className="relative min-h-screen py-16">
      <div className="container mx-auto px-4">
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>About Us</p>
          <h2 className={styles.sectionHeadText}>Mission, Vision, Value.</h2>
        </motion.div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <div className={`flex-1 ${isMobile ? 'w-full' : 'w-1/2'}`}>
            <MVVContainer
              visibleLayers={visibleLayers}
              highlightedLayer={highlightedLayer}
              onHover={handleHover}
            />
          </div>

          {/* モバイルでは3Dピラミッドは表示しない */}
          {!isMobile && (
            <div className="flex-1 w-1/2 h-[400px] relative">
              <ThreePyramid
                visibleLayers={visibleLayers}
                onHover={setHoveredFromPyramid}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
