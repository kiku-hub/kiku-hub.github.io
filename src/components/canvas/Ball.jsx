import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Decal,
  Float,
  Preload,
  useTexture,
} from "@react-three/drei";

import CanvasLoader from "../Loader";

// 定数を分離
const ROTATION_SPEED_RANGE = 0.1;
const MESH_SCALE = 1.75;
const FLOAT_CONFIG = {
  speed: 1.75,
  rotationIntensity: 1,
  floatIntensity: 2
};
const MATERIAL_CONFIG = {
  color: '#fff8eb',
  polygonOffset: true,
  polygonOffsetFactor: -5,
  flatShading: true
};
const DECAL_CONFIG = {
  position: [0, 0, 1],
  rotation: [2 * Math.PI, 0, 6.25],
  scale: 1,
  flatShading: true
};

const Ball = ({ imgUrl }) => {
  const textureUrl = useMemo(() => {
    // 相対パスを使用して画像を参照
    const url = new URL(imgUrl, import.meta.url).href;
    return url;
  }, [imgUrl]);

  const [decal] = useTexture([textureUrl], (loader) => {
    // テクスチャのロード時のエラーハンドリング
    loader.crossOrigin = 'anonymous';
  });

  const meshRef = useRef();

  // 回転速度の初期化をより明確に
  const rotationSpeed = useRef({
    x: (Math.random() - 0.5) * ROTATION_SPEED_RANGE,
    y: (Math.random() - 0.5) * ROTATION_SPEED_RANGE,
    z: (Math.random() - 0.5) * ROTATION_SPEED_RANGE,
  });

  // フレームごとの回転更新
  useFrame(() => {
    if (!meshRef.current) return;
    
    const { current: mesh } = meshRef;
    const { current: speed } = rotationSpeed;
    
    mesh.rotation.x += speed.x;
    mesh.rotation.y += speed.y;
    mesh.rotation.z += speed.z;
  });

  return (
    <Float {...FLOAT_CONFIG}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh 
        ref={meshRef}
        castShadow 
        receiveShadow 
        scale={MESH_SCALE}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial {...MATERIAL_CONFIG} />
        <Decal
          {...DECAL_CONFIG}
          map={decal}
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon }) => {
  return (
    <Canvas
      frameloop='always'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <Ball imgUrl={icon} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
