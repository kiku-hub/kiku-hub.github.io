import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { aboutContent } from "../constants";
import ThreePyramid from "./canvas/ThreePyramidOptimized";
import MVVContainer from "./mvv/MVVContainer";

const About = () => {
  const [visibleLayers, setVisibleLayers] = useState([]);
  const [highlightedLayer, setHighlightedLayer] = useState(null);
  const [hoveredFromPyramid, setHoveredFromPyramid] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const animationRef = useRef(null);

  const handleHover = useCallback((layerId) => {
    if (visibleLayers.includes(layerId) || layerId === null) {
      setHighlightedLayer(layerId);
    }
  }, [visibleLayers]);

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
      }, 0),

      timer2: setTimeout(() => {
        setVisibleLayers(sequence[1]);
      }, 1000),

      timer3: setTimeout(() => {
        setVisibleLayers(sequence[2]);
      }, 2000)
    };
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        Object.values(animationRef.current).forEach(timer => clearTimeout(timer));
      }
    };
  }, []);

  const orderedCards = useMemo(() => 
    aboutContent.cards.slice().reverse(),
    []
  );

  return (
    <div ref={sectionRef}>
      <div className="text-center mb-8">
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

      <div className="flex flex-col md:flex-row gap-16 items-center justify-center -mt-8">
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

        <MVVContainer
          orderedCards={orderedCards}
          visibleLayers={visibleLayers}
          hoveredFromPyramid={hoveredFromPyramid}
          onHover={handleHover}
        />
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
