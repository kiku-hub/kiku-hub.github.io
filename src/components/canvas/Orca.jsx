import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from 'three';

// 定数の定義
const MODEL_PATH = "./orca/Animation_Formal_Bow_withSkin.glb";
const ANIMATION_CONFIG = {
  timeScale: 0.7,
  fadeInDuration: 1,
  fadeOutDuration: 1,
};

const CAMERA_CONFIG = {
  fov: 45,
  near: 0.1,
  far: 200,
  position: [15, 3, 5],
};

const MODEL_SCALE = 6.5;

// Orcaコンポーネント
const Orca = () => {
  const modelRef = useRef();
  const orca = useGLTF(MODEL_PATH);
  const { actions, names } = useAnimations(orca.animations, orca.scene);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // シーンの最適化
    orca.scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    // 5秒待ってからアニメーション開始
    const timer = setTimeout(() => {
      names.forEach((name) => {
        const action = actions[name];
        action.reset();
        action.time = 0;
        action
          .setLoop(THREE.LoopOnce, 1)
          .setEffectiveTimeScale(ANIMATION_CONFIG.timeScale)
          .fadeIn(ANIMATION_CONFIG.fadeInDuration)
          .play();

        action.clampWhenFinished = true;
      });
    }, 4000); // 5秒の遅延

    return () => {
      clearTimeout(timer);
      names.forEach((name) => {
        actions[name].fadeOut(ANIMATION_CONFIG.fadeOutDuration);
      });
    };
  }, [actions, names, orca.scene]);

  return (
    <mesh ref={modelRef}>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={orca.scene}
        scale={MODEL_SCALE}
        position={[-9, -2.5, -2.0]}
        rotation={[0, 0, 0]}
      />
    </mesh>
  );
};

// Canvas コンポーネント
const OrcaCanvas = () => (
  <Canvas
    shadows
    frameloop='always'
    dpr={[1, 2]}
    gl={{ 
      preserveDrawingBuffer: true,
      antialias: true,
    }}
    camera={CAMERA_CONFIG}
  >
    <Suspense fallback={null}>
      <OrbitControls
        enableZoom={false}
        enableRotate={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
      <Orca />
    </Suspense>
    <Preload all />
  </Canvas>
);

export default OrcaCanvas; 