import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Decal,
  Float,
  Preload,
} from "@react-three/drei";
import * as THREE from 'three';

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
  const meshRef = useRef();
  const textureRef = useRef();

  // テクスチャの作成を最適化
  const decal = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    
    const img = new Image();
    img.src = imgUrl;
    
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const base64 = canvas.toDataURL('image/png');
        const newTexture = textureLoader.load(base64, (texture) => {
          // テクスチャ設定を最適化
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          texture.needsUpdate = true;
        });
        textureRef.current = newTexture;
        resolve(newTexture);
      };
    });
  }, [imgUrl]);

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
        <meshStandardMaterial 
          {...MATERIAL_CONFIG}
          onBeforeCompile={(shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <map_fragment>',
              `
              #include <map_fragment>
              gl_FragColor = vec4(gl_FragColor.rgb, gl_FragColor.a);
              `
            );
          }}
        />
        <Suspense fallback={null}>
          {textureRef.current && (
            <Decal
              {...DECAL_CONFIG}
              map={textureRef.current}
            />
          )}
        </Suspense>
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
