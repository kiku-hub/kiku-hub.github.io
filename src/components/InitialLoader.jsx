import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useProgress } from "@react-three/drei";

// アニメーション設定
const containerVariants = {
  hidden: { 
    scale: 0.8,
    opacity: 0,
    y: 20
  },
  visible: { 
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
      when: "afterChildren",
      staggerChildren: 0.1
    }
  }
};

const childVariants = {
  hidden: { 
    scale: 0.9,
    opacity: 0,
    y: 10
  },
  visible: { 
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const InitialLoader = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const { progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const progressRef = useRef(0);
  const maxProgressRef = useRef(0);

  // 実際の進捗値を滑らかにアニメーション
  useEffect(() => {
    let animationFrame;
    const ANIMATION_SPEED = 0.08; // よりゆっくりとした速度

    const animateProgress = () => {
      const targetProgress = Math.max(progress, maxProgressRef.current);
      maxProgressRef.current = targetProgress;

      const diff = targetProgress - progressRef.current;
      
      if (Math.abs(diff) < 0.01) {
        progressRef.current = targetProgress;
        setDisplayProgress(targetProgress);
      } else {
        const step = Math.max(diff * ANIMATION_SPEED, 0.1); // 最小増加量を設定
        progressRef.current = Math.min(progressRef.current + step, targetProgress);
        setDisplayProgress(progressRef.current);
        animationFrame = requestAnimationFrame(animateProgress);
      }
    };

    animationFrame = requestAnimationFrame(animateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [progress]);

  useEffect(() => {
    if (progress === 100) {
      const checkProgress = setInterval(() => {
        if (Math.round(displayProgress) === 100) {
          clearInterval(checkProgress);
          setFadeOut(true);
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        }
      }, 100);

      return () => clearInterval(checkProgress);
    }
  }, [progress, displayProgress]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 1,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {/* オーバーレイグラデーション */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black to-transparent"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: displayProgress / 200,
            }}
            transition={{ duration: 0.4 }}
          />
          
          {/* 明るさのオーバーレイ */}
          <motion.div
            className="absolute inset-0 mix-blend-overlay"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: fadeOut ? 0.4 : displayProgress / 300,
              background: fadeOut 
                ? 'radial-gradient(circle at center, white 0%, transparent 70%)'
                : 'radial-gradient(circle at center, white 0%, transparent 100%)'
            }}
            transition={{ duration: 0.4 }}
          />

          <div className="h-screen flex items-center justify-center">
            <motion.div
              variants={containerVariants}
              initial="visible"
              animate={fadeOut ? "exit" : "visible"}
              exit="exit"
            >
              <div className="flex flex-col items-center gap-8">
                <motion.div variants={childVariants}>
                  <div className="relative w-[100px] h-[100px] flex items-center justify-center">
                    {/* Background Circle */}
                    <svg className="absolute w-full h-full -rotate-90">
                      <circle
                        className="text-white/10"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        r="47"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                    {/* Progress Circle */}
                    <svg className="absolute w-full h-full -rotate-90">
                      <circle
                        className="text-white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        r="47"
                        cx="50"
                        cy="50"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 47}`,
                          strokeDashoffset: `${2 * Math.PI * 47 * (1 - displayProgress / 100)}`,
                          transition: 'none'
                        }}
                      />
                    </svg>
                    {/* Progress Text */}
                    <span className="text-white text-base font-light tracking-wider">
                      {Math.round(displayProgress)}
                    </span>
                  </div>
                </motion.div>
                
                <motion.div variants={childVariants}>
                  <span className="text-white/50 text-xs tracking-[0.3em] font-normal uppercase">
                    Loading
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader;