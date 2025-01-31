import { motion } from "framer-motion";
import { styles } from "../styles";
import { OrcaCanvas } from "./canvas";

// 青系のカラーパレット
const colors = {
  primary: '#00a8ff',      // メインの青
  accent: '#0097e6',       // アクセントの青
  glow: '#00d2ff',         // グロー効果用の明るい青
  neon: '#48dbfb'          // ネオン効果用の鮮やかな青
};

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
    opacity: [0.3, 1, 0.3],
    filter: ["blur(4px)", "blur(2px)", "blur(4px)"],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

const Hero = () => {
  return (
    <section className={`relative w-full h-screen mx-auto bg-gradient-to-b from-transparent to-[#0a0a0a]`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#00a8ff]/5 via-transparent to-transparent"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />

      <motion.div
        className="absolute inset-0 bg-noise-pattern mix-blend-overlay opacity-5"
        animate={{
          opacity: [0.03, 0.05, 0.03],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}>
        <div className='flex flex-col justify-center items-center mt-5'>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
              boxShadow: [
                `0 0 10px ${colors.primary}33`,
                `0 0 20px ${colors.primary}66`,
                `0 0 10px ${colors.primary}33`
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className='w-5 h-5 rounded-full bg-[#00a8ff] backdrop-blur-sm' 
          />
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className='w-[2px] sm:h-80 h-40 bg-gradient-to-b from-[#00a8ff] via-[#00a8ff]/50 to-transparent' 
          />
        </div>

        <div className="relative z-10">
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className={`${styles.heroHeadText} text-white relative inline-block`}
              variants={textVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div className="relative flex flex-col items-start gap-0">
                {["BREAK", "AND", "BUILD"].map((text, index) => (
                  <motion.span
                    key={index}
                    className={`relative ${
                      text === "AND" 
                        ? "text-white/60 transform tracking-[0.3em] py-1"
                        : "text-[#e6e6ed] font-bold tracking-[0.3em] text-glow"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {Array.from(text).map((letter, letterIndex) => (
                      <motion.span
                        key={letterIndex}
                        className="inline-block relative"
                        variants={letterVariants}
                        style={{ animationDelay: `${letterIndex * 0.1 + index * 0.5}s` }}
                        whileHover={{
                          color: colors.neon,
                          textShadow: `0 0 15px ${colors.glow}`,
                        }}
                      >
                        {letter}
                        <motion.div
                          className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#00a8ff]"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: [0, 1, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: letterIndex * 0.1
                          }}
                        />
                      </motion.span>
                    ))}
                    <motion.div
                      className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#00a8ff]/0 via-[#00a8ff] to-[#00a8ff]/0"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ 
                        scaleX: 1, 
                        opacity: [0.5, 1, 0.5],
                        filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </motion.span>
                ))}
              </motion.div>
            </motion.h1>
          </motion.div>

          <motion.div 
            className="mt-8 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
          >
            {[
              ["BREAK", "the ordinary,", "CREATE", "new value."],
              ["See", "the essence,", "OPEN", "the future."]
            ].map((textParts, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden inline-block group"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2 + index * 0.3, duration: 0.8 }}
                whileHover={{ 
                  x: 10, 
                  scale: 1.02,
                  textShadow: `0 0 8px ${colors.primary}80`
                }}
              >
                <motion.span 
                  className={`${styles.heroSubText} text-[#e6e6ed] relative z-10 block tracking-wider flex items-center gap-4`}
                  animate={{
                    y: [-1, 1, -1],
                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.2,
                  }}
                >
                  {textParts.map((part, partIndex) => (
                    <motion.span
                      key={partIndex}
                      className={`inline-block ${part.trim().toUpperCase() === part.trim() ? 'text-[#00a8ff] font-bold' : ''}`}
                      whileHover={part.trim().toUpperCase() === part.trim() ? {
                        scale: 1.1,
                        textShadow: "0 0 10px rgba(0, 168, 255, 0.5)"
                      } : {}}
                    >
                      {part}
                    </motion.span>
                  ))}
                </motion.span>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00a8ff]/0 via-[#00a8ff]/30 to-[#00a8ff]/0"
                  animate={{
                    x: ["-100%", "0%", "100%"],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.2,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3/5 h-full">
        <OrcaCanvas />
      </div>

      <motion.div 
        className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <a href='#about'>
          <motion.div 
            className='relative w-[35px] h-[64px] rounded-full border-2 border-[#00a8ff]/20 flex justify-center items-start p-2 backdrop-blur-sm hover:border-[#00a8ff]/40 transition-colors duration-300'
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 0 15px rgba(0, 168, 255, 0.2)"
            }}
          >
            <motion.div
              animate={{
                y: [0, 24, 0],
                boxShadow: [
                  "0 0 5px rgba(0, 168, 255, 0.2)",
                  "0 0 10px rgba(0, 168, 255, 0.4)",
                  "0 0 5px rgba(0, 168, 255, 0.2)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-[#00a8ff]/80 mb-1'
            />
          </motion.div>
        </a>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />
    </section>
  );
};

const gridPattern = {
  backgroundImage: `
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
  `,
  backgroundSize: '40px 40px'
};

const additionalStyles = `
  .text-glow {
    text-shadow: 0 0 10px rgba(0, 168, 255, 0.3);
  }
  .shadow-glow {
    box-shadow: 0 0 10px rgba(0, 168, 255, 0.2);
  }
`;

export default Hero;
