import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useProgress } from "@react-three/drei";
import { logo } from "../assets";
import { useMediaQuery } from "../hooks";

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
  const { progress, errors } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const progressRef = useRef(0);
  const maxProgressRef = useRef(0);
  const timeoutRef = useRef(null);
  // モバイルデバイスかどうかを検出
  const isMobile = useMediaQuery("(max-width: 767px)");

  // フェイルセーフタイマー - 20秒後に強制的に先に進む
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      console.log("Failsafe timeout reached, forcing loader to complete");
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, 20000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // デバッグ用のログ
  useEffect(() => {
    console.log(`Progress: ${progress}%, Errors: `, errors);
    
    // エラーがある場合、10秒後に強制的に先に進む
    if (errors && errors.length > 0) {
      console.error("Loading errors detected:", errors);
      setTimeout(() => {
        console.log("Forcing loader to complete due to errors");
        setFadeOut(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }, 5000);
    }
  }, [progress, errors]);

  // モバイルの場合は進捗を自動的に進める
  useEffect(() => {
    if (isMobile && progress < 90) {
      const interval = setInterval(() => {
        const newProgress = Math.min(progressRef.current + 1, 100);
        progressRef.current = newProgress;
        setDisplayProgress(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setFadeOut(true);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [isMobile, progress]);

  // 実際の進捗値を滑らかにアニメーション - モバイルでない場合のみ適用
  useEffect(() => {
    if (isMobile) return;
    
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
  }, [progress, isMobile]);

  useEffect(() => {
    if (progress === 100 || Math.round(displayProgress) === 100) {
      console.log("Progress reached 100%");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      const checkProgress = setInterval(() => {
        console.log(`Display progress: ${Math.round(displayProgress)}`);
        if (Math.round(displayProgress) === 100) {
          console.log("Display progress reached 100%, starting fadeOut");
          clearInterval(checkProgress);
          setFadeOut(true);
          setTimeout(() => {
            console.log("Loader complete, showing content");
            setLoading(false);
          }, isMobile ? 500 : 1500);
        }
      }, 100);

      return () => clearInterval(checkProgress);
    }
  }, [progress, displayProgress, isMobile]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: isMobile ? 0.5 : 1,
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
                    {/* ORCX Logo */}
                    <div className="absolute w-[50px] h-[50px] flex items-center justify-center bg-white rounded-full">
                      <img
                        src={logo}
                        alt="ORCX"
                        className="w-[40px] h-[40px] object-contain"
                      />
                    </div>
                    {/* Progress Text */}
                    <span className="absolute bottom-[-35px] text-white text-base font-light tracking-wider">
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