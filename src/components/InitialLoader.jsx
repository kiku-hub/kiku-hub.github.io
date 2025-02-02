import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// カスタムスタイルのCircularProgress
const StyledCircularProgress = styled(CircularProgress)({
  color: 'white',
  opacity: 0.8,
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round',
  },
});

const InitialLoader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [modelProgress, setModelProgress] = useState(0);
  const { progress: threeProgress } = useProgress();

  useEffect(() => {
    // 3Dモデルの読み込み進捗を更新
    setModelProgress(Math.round(threeProgress));
  }, [threeProgress]);

  useEffect(() => {
    const checkPageLoad = () => {
      // ページとモデルの両方が完全に読み込まれたことを確認
      if (document.readyState === 'complete' && modelProgress === 100) {
        // 完全に読み込まれた後、スムーズに終了
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    // 初期チェック
    checkPageLoad();

    // readystatechangeイベントリスナーを追加
    document.addEventListener('readystatechange', checkPageLoad);

    // プログレスバーのアニメーション
    // ページの読み込み(50%) + 3Dモデルの読み込み(50%)の合計で100%とする
    const interval = setInterval(() => {
      setProgress((prev) => {
        const pageLoadProgress = document.readyState === 'complete' ? 50 : Math.min(prev, 45);
        const modelLoadProgress = Math.min(modelProgress / 2, 50); // モデルの進捗を50%に換算
        const totalProgress = Math.round(pageLoadProgress + modelLoadProgress);
        
        return Math.min(totalProgress, 99);
      });
    }, 16); // 60fpsに合わせて更新

    // クリーンアップ
    return () => {
      document.removeEventListener('readystatechange', checkPageLoad);
      clearInterval(interval);
    };
  }, [modelProgress]);

  // 完全に読み込まれたら100%を表示
  useEffect(() => {
    if (document.readyState === 'complete' && modelProgress === 100) {
      setProgress(100);
    }
  }, [document.readyState, modelProgress]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
              position: 'relative'
            }}
          >
            {/* プログレスサークル */}
            <Box sx={{ position: 'relative' }}>
              <StyledCircularProgress
                variant="determinate"
                value={100}
                size={120}
                thickness={1}
                sx={{ opacity: 0.1 }}
              />
              <StyledCircularProgress
                variant="determinate"
                value={progress}
                size={120}
                thickness={1}
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  transform: 'rotate(-90deg)'
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontWeight: 200,
                  fontSize: '1.5rem',
                  letterSpacing: '0.1em'
                }}
              >
                {progress}%
              </Typography>
            </Box>
            
            {/* Loading テキスト */}
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
                fontSize: '0.65rem',
                fontWeight: 300
              }}
            >
              Loading
            </Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader; 