import { motion, useAnimation, useInView } from "framer-motion";
import { styles } from "../styles";
import { OrcaCanvas } from "./canvas";
import { useEffect, useRef } from "react";
import { images } from "../assets";
import useMediaQuery from "../hooks/useMediaQuery";

// 青系のカラーパレット
const colors = {
  primary: '#00a8ff',      // メインの青
  accent: '#0097e6',       // アクセントの青
  glow: '#00d2ff',         // グロー効果用の明るい青
  neon: '#48dbfb'          // ネオン効果用の鮮やかな青
};

// 背景画像のプリロード
const preloadBackgroundImage = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = images.herobg.webp || images.herobg.src;
  link.type = images.herobg.webp ? 'image/webp' : 'image/jpeg';
  document.head.appendChild(link);
};

// アニメーション設定をメモ化
const textVariants = {
  animate: {
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const letterVariants = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 3,
      ease: "easeInOut",
    },
  },
};

const glowVariants = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 4,
      ease: "easeInOut",
    },
  },
};

const Hero = () => {
  // モバイルかどうかを検出
  const isMobile = useMediaQuery("(max-width: 767px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const mainControls = useAnimation();

  useEffect(() => {
    preloadBackgroundImage();
  }, []);

  useEffect(() => {
    if (isInView) {
      mainControls.start("animate");
    }
  }, [isInView, mainControls]);

  return (
    <section
      id="hero"
      className={`${styles.paddings} relative w-full bg-hero-pattern bg-cover bg-no-repeat bg-center h-screen flex justify-center items-center overflow-hidden`}
    >
      <div
        ref={ref}
        className="max-w-7xl mx-auto w-full h-full flex flex-col justify-center items-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full flex flex-col justify-center items-center"
        >
          <div className="text-center relative mb-8">
            <motion.h1
              variants={textVariants}
              initial="initial"
              animate={mainControls}
              className={`${styles.heroHeadText} text-white uppercase relative z-10`}
            >
              {Array.from("ORCX").map((letter, index) => (
                <motion.span key={index} variants={letterVariants} className="inline-block">
                  {letter}
                </motion.span>
              ))}
            </motion.h1>
            <motion.div
              variants={glowVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 blur-xl bg-glow-light opacity-30 z-0"
              style={{ backgroundColor: colors.glow }}
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={`${styles.heroSubText} text-white text-center max-w-3xl mx-auto mb-10`}
          >
            <span className="block sm:inline">IT業界の固定観念を覆し、</span>
            <span className="block sm:inline">本質を追求するエンジニア集団。</span>
          </motion.p>
        </motion.div>
      </div>

      {/* モバイルの場合は静的な画像、デスクトップの場合は3Dモデル */}
      {isMobile ? (
        <div className="absolute inset-0 z-0 opacity-70">
          <img 
            src={images.herobg.webp || images.herobg.src} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <OrcaCanvas />
        </div>
      )}

      <div className="absolute bottom-10 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
