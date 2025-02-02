import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CursorEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // カーソルがポインターになる要素上にあるかチェック
      const target = e.target;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.onclick ||
        getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isPointer ? 1.5 : 1,
          opacity: 0.8,
        }}
        transition={{
          type: "spring",
          mass: 0.3,
          stiffness: 100,
          damping: 10,
        }}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isPointer ? 0.5 : 1,
        }}
        transition={{
          type: "spring",
          mass: 0.2,
          stiffness: 150,
          damping: 8,
        }}
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-24 h-24 rounded-full pointer-events-none z-40 opacity-20"
        animate={{
          x: mousePosition.x - 48,
          y: mousePosition.y - 48,
          scale: isPointer ? 1.2 : 1,
        }}
        transition={{
          type: "spring",
          mass: 0.5,
          stiffness: 50,
          damping: 12,
        }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
        }}
      />
    </>
  );
};

export default CursorEffect; 