import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from 'three';
import CanvasLoader from "../Loader";

// 定数の定義
const MODEL_PATH = "./orca/Animation_Skill_01_withSkin.glb";
const ANIMATION_CONFIG = {
  timeScale: 0.6,
  fadeInDuration: 0.5,
  fadeOutDuration: 0.5,
};

const CAMERA_CONFIG = {
  fov: 45,
  near: 0.1,
  far: 200,
  position: [20, 3, 5],
};

const MODEL_SCALE = {
  mobile: 4.5,
  desktop: 5.0,
};

// Orcaコンポーネント
const Orca = ({ isMobile }) => {
  const modelRef = useRef();
  const orca = useGLTF(MODEL_PATH);
  const { animations } = orca;
  const { actions, names } = useAnimations(animations, orca.scene);

  useEffect(() => {
    const setupAnimations = () => {
      names.forEach((name) => {
        const action = actions[name];
        action
          .reset()
          .setLoop(THREE.LoopRepeat, Infinity)
          .setEffectiveTimeScale(ANIMATION_CONFIG.timeScale)
          .fadeIn(ANIMATION_CONFIG.fadeInDuration)
          .play();
      });
    };

    const cleanupAnimations = () => {
      names.forEach((name) => {
        actions[name].fadeOut(ANIMATION_CONFIG.fadeOutDuration);
      });
    };

    setupAnimations();
    return cleanupAnimations;
  }, [actions, names]);

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
        scale={isMobile ? MODEL_SCALE.mobile : MODEL_SCALE.desktop}
        position={[0, -2.5, -2.0]}
        rotation={[0, 0, 0]}
      />
    </mesh>
  );
};

// OrbitControlsコンポーネント
const SceneControls = () => (
  <OrbitControls
    enableZoom={false}
    enableRotate={true}
    enablePan={false}
    maxPolarAngle={Math.PI / 2}
    minPolarAngle={Math.PI / 2}
    target={[0, 0, 0]}
  />
);

// メインのCanvasコンポーネント
const OrcaCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  // モデルのプリロード
  useGLTF.preload(MODEL_PATH);

  return (
    <Canvas
      frameloop='always'
      shadows
      dpr={[1, 2]}
      camera={CAMERA_CONFIG}
      gl={{ preserveDrawingBuffer: true }}
      onError={(error) => console.error('Canvas error:', error)}
    >
      <Suspense fallback={<CanvasLoader />}>
        <SceneControls />
        <Orca isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default OrcaCanvas; 