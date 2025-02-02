import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useProgress } from "@react-three/drei";
import { Box, CircularProgress, Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

// カスタムスタイルのCircularProgress
const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: 'white',
  opacity: 0.9,
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}));

// カスタムスタイルのコンテナ
const LoaderContainer = styled(Container)({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

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
    opacity: 0,
    y: 20,
    scale: 0.9
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.4,
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

  // 実際の進捗値を滑らかにアニメーション
  useEffect(() => {
    let animationFrame;
    const animateProgress = () => {
      const diff = progress - progressRef.current;
      if (Math.abs(diff) < 0.1) {
        progressRef.current = progress;
        setDisplayProgress(progress);
      } else {
        // 現在値から目標値に向かってスムーズに変化
        progressRef.current += diff * 0.1;
        setDisplayProgress(progressRef.current);
        animationFrame = requestAnimationFrame(animateProgress);
      }
    };

    animationFrame = requestAnimationFrame(animateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [progress]);

  // ローディング完了時の処理
  useEffect(() => {
    if (progress === 100) {
      // displayProgressが100%に到達するまで待つ
      const checkProgress = setInterval(() => {
        if (Math.round(displayProgress) === 100) {
          clearInterval(checkProgress);
          // フェードアウトアニメーションを開始
          setFadeOut(true);
          // フェードアウト完了後にローディングを終了
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
          <LoaderContainer maxWidth={false}>
            <motion.div
              variants={containerVariants}
              initial="visible"
              animate={fadeOut ? "exit" : "visible"}
              exit="exit"
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3
                }}
              >
                <motion.div variants={childVariants}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <StyledCircularProgress
                      variant="determinate"
                      value={100}
                      size={100}
                      thickness={1.5}
                      sx={{ 
                        opacity: 0.1,
                        position: 'absolute'
                      }}
                    />
                    <StyledCircularProgress
                      variant="determinate"
                      value={displayProgress}
                      size={100}
                      thickness={1.5}
                      sx={{
                        position: 'absolute',
                        transform: 'rotate(-90deg)'
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 300,
                        letterSpacing: 1,
                        fontSize: '1rem'
                      }}
                    >
                      {Math.round(displayProgress)}
                    </Typography>
                  </Box>
                </motion.div>
                
                <motion.div variants={childVariants}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      letterSpacing: '0.3em',
                      fontSize: '0.6rem',
                      fontWeight: 400,
                      textTransform: 'uppercase'
                    }}
                  >
                    Loading
                  </Typography>
                </motion.div>
              </Box>
            </motion.div>
          </LoaderContainer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader; 