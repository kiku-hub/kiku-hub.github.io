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
    // シーンの最適化
    orca.scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    // アニメーションの設定
    names.forEach((name) => {
      const action = actions[name];
      action
        .reset()
        .setLoop(THREE.LoopOnce, 1)
        .setEffectiveTimeScale(ANIMATION_CONFIG.timeScale)
        .fadeIn(ANIMATION_CONFIG.fadeInDuration)
        .play();

      action.clampWhenFinished = true;
    });

    return () => {
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
        scale={isMobile ? MODEL_SCALE.mobile : MODEL_SCALE.desktop}
        position={[0, -2.5, -2.0]}
        rotation={[0, 0, 0]}
      />
    </mesh>
  );
};

// Canvas コンポーネント
const OrcaCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
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
      <Suspense>
        <OrbitControls
          enableZoom={false}
          enableRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Orca isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default OrcaCanvas; 