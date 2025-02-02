import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CursorEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  let moveTimer;

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);
      clearTimeout(moveTimer);
      moveTimer = setTimeout(() => setIsMoving(false), 150);

      const target = e.target;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.onclick ||
        getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      clearTimeout(moveTimer);
    };
  }, []);

  return (
    <>
      {/* メインリング */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isPointer ? 1.4 : isClicked ? 0.8 : 1,
          rotate: isMoving ? 180 : 0,
        }}
        transition={{
          type: "spring",
          mass: 0.3,
          stiffness: 100,
          damping: 15,
          rotate: {
            type: "tween",
            duration: 0.5,
          }
        }}
        style={{
          border: '1.5px solid rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* インナーリング */}
      <motion.div
        className="fixed top-0 left-0 w-5 h-5 rounded-full pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 10,
          y: mousePosition.y - 10,
          scale: isPointer ? 0.6 : isClicked ? 1.2 : 1,
          opacity: 0.5,
        }}
        transition={{
          type: "spring",
          mass: 0.2,
          stiffness: 150,
          damping: 12,
        }}
        style={{
          border: '1px solid rgba(255, 255, 255, 0.6)',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      />

      {/* パーティクルエフェクト */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-40"
          animate={{
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            opacity: isMoving ? [0.6, 0] : 0,
            scale: isMoving ? [0.8, 1.2] : 0.8,
          }}
          transition={{
            x: {
              type: "spring",
              mass: 0.2,
              stiffness: 100 - i * 20,
              damping: 10,
            },
            y: {
              type: "spring",
              mass: 0.2,
              stiffness: 100 - i * 20,
              damping: 10,
            },
            opacity: {
              duration: 0.5,
              delay: i * 0.1,
            },
            scale: {
              duration: 0.5,
              delay: i * 0.1,
            }
          }}
          style={{
            background: 'white',
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* グローエフェクト */}
      <motion.div
        className="fixed top-0 left-0 w-20 h-20 rounded-full pointer-events-none z-30"
        animate={{
          x: mousePosition.x - 40,
          y: mousePosition.y - 40,
          scale: isPointer ? 1.2 : isClicked ? 0.8 : 1,
          opacity: isMoving ? 0.15 : 0.08,
        }}
        transition={{
          type: "spring",
          mass: 0.5,
          stiffness: 50,
          damping: 10,
        }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
};

export default CursorEffect; 