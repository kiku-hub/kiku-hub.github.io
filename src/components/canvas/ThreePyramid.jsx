import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PyramidLayer = ({ position, bottomScale, topScale, height, color, visible, isHighlighted, highlightedLayer, onHover }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const scaleRef = useRef(visible ? 1 : 0);
  const opacityRef = useRef(visible ? 0.7 : 0);
  const baseOpacity = 0.7;

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
        const targetScale = isHighlighted ? 1.05 : 1;
        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.1);
        const targetOpacity = isHighlighted ? 0.95 : baseOpacity;
        opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, 0.1);

        // 非ハイライト層を暗く
        if (!isHighlighted && highlightedLayer !== null) {
          opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0.3, 0.1);
        }
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
      onPointerEnter={(e) => {
        // イベントの伝播を停止
        e.stopPropagation();
        onHover && onHover(true);
      }}
      onPointerLeave={(e) => {
        // イベントの伝播を停止
        e.stopPropagation();
        onHover && onHover(false);
      }}
    >
      <cylinderGeometry args={[topScale, bottomScale, height, 3]} />
      <meshPhongMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        emissive={color}
        emissiveIntensity={isHighlighted ? 0.5 : 0}
        shininess={isHighlighted ? 100 : 30}
      />
    </mesh>
  );
};

const PyramidGroup = ({ visibleLayers, highlightedLayer, onLayerHover }) => {
  const groupRef = useRef();

  // レイヤーを下から上の順に定義
  const pyramidLayers = [
    {
      id: 'value',    // 最下層
      y: -3,
      bottomScale: 6.2,
      topScale: 4.7,
      height: 2.8,
      color: 0xb4a7d6
    },
    {
      id: 'vision',   // 中間層
      y: 0.0,
      bottomScale: 4.7,
      topScale: 3.2,
      height: 2.8,
      color: 0xa4c9e3
    },
    {
      id: 'mission',  // 最上層
      y: 3.0,
      bottomScale: 3.2,
      topScale: 0,
      height: 2.8,
      color: 0x8dd3c7
    }
  ];

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group 
      ref={groupRef} 
      rotation={[0, Math.PI / 6, 0]} 
      position={[0, 0, 0]}
      onPointerMissed={() => {
        // ピラミッド外のクリックでハイライトをクリア
        onLayerHover && onLayerHover(null);
      }}
    >
      {pyramidLayers.map((layer) => (
        <PyramidLayer
          key={layer.id}
          position={[0, layer.y, 0]}
          bottomScale={layer.bottomScale}
          topScale={layer.topScale}
          height={layer.height}
          color={layer.color}
          visible={visibleLayers.includes(layer.id)}
          isHighlighted={highlightedLayer === layer.id}
          highlightedLayer={highlightedLayer}
          onHover={(isHovered) => onLayerHover && onLayerHover(isHovered ? layer.id : null)}
        />
      ))}
    </group>
  );
};

const ThreePyramid = ({ visibleLayers = ['value'], highlightedLayer = null, onLayerHover }) => {
  return (
    <div className="w-full h-[600px]">
      <Canvas
        camera={{
          position: [0, 1.5, 20],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
      >
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <ambientLight color={0x404040} />
        <PyramidGroup visibleLayers={visibleLayers} highlightedLayer={highlightedLayer} onLayerHover={onLayerHover} />
      </Canvas>
    </div>
  );
};

export default ThreePyramid;