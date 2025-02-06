import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const PyramidLayer = ({ position, bottomScale, topScale, height, color }) => {
  const meshRef = useRef();

  useFrame(() => {
    meshRef.current.rotation.y += 0.005;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, Math.PI / 6, 0]}
    >
      <cylinderGeometry args={[topScale, bottomScale, height, 3]} />
      <meshPhongMaterial
        color={color}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const PyramidGroup = () => {
  const groupRef = useRef();
  const pyramidLayers = [
    { y: 3.2, bottomScale: 1.4, topScale: 0, height: 1.4, color: 0x8dd3c7 },
    { y: 1.6, bottomScale: 2.2, topScale: 1.4, height: 1.4, color: 0xa4c9e3 },
    { y: 0, bottomScale: 3.0, topScale: 2.2, height: 1.4, color: 0xb4a7d6 }
  ];

  useFrame(() => {
    groupRef.current.rotation.y += 0.005;
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI / 6, 0]}>
      {pyramidLayers.map((layer, index) => (
        <PyramidLayer
          key={index}
          position={[0, layer.y, 0]}
          bottomScale={layer.bottomScale}
          topScale={layer.topScale}
          height={layer.height}
          color={layer.color}
        />
      ))}
    </group>
  );
};

const ThreePyramid = () => {
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
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
        />
        <ambientLight color={0x404040} />

        <PyramidGroup />

      </Canvas>
    </div>
  );
};

export default ThreePyramid;