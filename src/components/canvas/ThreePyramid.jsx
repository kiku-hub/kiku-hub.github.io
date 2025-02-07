import React, { useRef, useEffect } from 'react';
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
      // 回転アニメーション（これは常に維持）
      meshRef.current.rotation.y += 0.005;

      if (visible) {
        // 表示アニメーション
        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 1, 0.1);
        opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0.7, 0.1);
      } else {
        // 非表示アニメーション
        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 0, 0.1);
        opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0, 0.1);
      }

      // スケールと不透明度を適用
      meshRef.current.scale.setScalar(scaleRef.current);
      materialRef.current.opacity = opacityRef.current;

      // 完全に透明になったら非表示に
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
      id: 'value',
      y: 0,
      bottomScale: 3.0,
      topScale: 2.2,
      height: 1.4,
      color: 0xb4a7d6
    },
    {
      id: 'vision',
      y: 1.6,
      bottomScale: 2.2,
      topScale: 1.4,
      height: 1.4,
      color: 0xa4c9e3
    },
    {
      id: 'mission',
      y: 3.2,
      bottomScale: 1.4,
      topScale: 0,
      height: 1.4,
      color: 0x8dd3c7
    }
  ];

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI / 6, 0]}>
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
    <div className="w-full h-[500px]">
      <Canvas
        camera={{
          position: [0, 4, 10],
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