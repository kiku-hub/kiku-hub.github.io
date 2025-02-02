import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const InitialLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPageLoad = () => {
      if (document.readyState === 'complete') {
        // ページが完全に読み込まれた後、少し待ってからローディングを終了
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    // 初期チェック
    checkPageLoad();

    // readystatechangeイベントリスナーを追加
    document.addEventListener('readystatechange', checkPageLoad);

    // クリーンアップ
    return () => {
      document.removeEventListener('readystatechange', checkPageLoad);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 1,
              ease: "easeInOut",
            },
          }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="w-24 h-24 border-2 border-white/20 rounded-full"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute w-24 h-24"
              initial={{ rotate: 0 }}
            >
              <motion.div
                className="w-4 h-4 bg-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  times: [0, 0.5, 1],
                }}
              />
            </motion.div>
            <motion.div
              className="absolute w-32 h-32 border border-white/20 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader; 