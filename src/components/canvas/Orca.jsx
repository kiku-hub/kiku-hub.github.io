import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from 'three';

import CanvasLoader from "../Loader";

const Orca = ({ isMobile }) => {
  const orca = useGLTF("./orca/Animation_Skill_01_withSkin.glb");
  const { animations } = orca;
  const { actions, names } = useAnimations(animations, orca.scene);

  useEffect(() => {
    console.log('Available animations:', names);

    names.forEach((name) => {
      const action = actions[name];
      action
        .reset()
        .setLoop(THREE.LoopRepeat, Infinity)
        .setEffectiveTimeScale(0.6)
        .fadeIn(0.5)
        .play();
    });

    return () => {
      names.forEach((name) => {
        const action = actions[name];
        action.fadeOut(0.5);
      });
    };
  }, [actions, names]);

  return (
    <mesh>
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
        scale={isMobile ? 2.5 : 3.0}
        position={[4, -1.5, 0]}
        rotation={[-0.00, -0.0, -0.0]}
      />
    </mesh>
  );
};

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

  useGLTF.preload("./orca/Animation_Skill_01_withSkin.glb");

  return (
    <Canvas
      frameloop='always'
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      onError={(error) => {
        console.error('Canvas error:', error);
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
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