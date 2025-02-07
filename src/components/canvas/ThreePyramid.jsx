import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PyramidLayer = ({ position, bottomScale, topScale, height, color, visible }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const scaleRef = useRef(visible ? 1 : 0);
  const opacityRef = useRef(visible ? 0.7 : 0);

  useEffect(() => {
    if (!visible) {
      scaleRef.current = 0;
      opacityRef.current = 0;
    }
  }, [visible]);

  useFrame(() => {
    if (meshRef.current && materialRef.current) {
      meshRef.current.rotation.y += 0.005;

      if (visible) {
        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 1, 0.1);
        opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0.7, 0.1);
      } else {
        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 0, 0.1);
        opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0, 0.1);
      }

      meshRef.current.scale.setScalar(scaleRef.current);
      materialRef.current.opacity = opacityRef.current;
      meshRef.current.visible = opacityRef.current > 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, Math.PI / 6, 0]}
    >
      <cylinderGeometry args={[topScale, bottomScale, height, 3]} />
      <meshPhongMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const PyramidGroup = ({ visibleLayers }) => {
  const groupRef = useRef();

  // レイヤーを下から上の順に定義
  const pyramidLayers = [
    {
      id: 'value',    // 最下層
      y: -2,
      bottomScale: 5.8,  // 少し小さく
      topScale: 4.4,     // 少し小さく
      height: 2.5,       // 少し小さく
      color: 0xb4a7d6    // Value: 落ち着いた紫
    },
    {
      id: 'vision',   // 中間層
      y: 0.7,
      bottomScale: 4.4,  // 少し小さく
      topScale: 3.0,     // 少し小さく
      height: 2.5,       // 少し小さく
      color: 0xa4c9e3    // Vision: 柔らかい青
    },
    {
      id: 'mission',  // 最上層
      y: 3.4,
      bottomScale: 3.0,  // 少し小さく
      topScale: 0,
      height: 2.5,       // 少し小さく
      color: 0x8dd3c7    // Mission: 爽やかな青緑
    }
  ];

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI / 6, 0]} position={[0, 0.5, 0]}>  
      {pyramidLayers.map((layer) => (
        <PyramidLayer
          key={layer.id}
          position={[0, layer.y, 0]}
          bottomScale={layer.bottomScale}
          topScale={layer.topScale}
          height={layer.height}
          color={layer.color}
          visible={visibleLayers.includes(layer.id)}
        />
      ))}
    </group>
  );
};

const ThreePyramid = ({ visibleLayers = ['value'] }) => {
  return (
    <div className="w-full h-[600px]">
      <Canvas
        camera={{
          position: [0, 1.8, 18],  // カメラのY位置をさらに少し下げる
          fov: 45,
          near: 0.1,
          far: 1000
        }}
      >
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <ambientLight color={0x404040} />
        <PyramidGroup visibleLayers={visibleLayers} />
      </Canvas>
    </div>
  );
};

export default ThreePyramid;