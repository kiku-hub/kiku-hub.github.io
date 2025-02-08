import React, { useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PyramidLayer = React.memo(({ position, bottomScale, topScale, height, visible, isHighlighted, highlightedLayer, onHover, layerId }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const scaleRef = useRef(visible ? 1 : 0);
  const brightnessRef = useRef(1);
  const baseOpacity = 0.7;
  const initialYOffset = useRef(layerId === 'value' ? 0 : 20);

  const getLayerColor = () => {
    switch (layerId) {
      case 'mission':
        return new THREE.Color(0x48c9b0).multiplyScalar(1.3);
      case 'vision':
        return new THREE.Color(0x5ca5d9).multiplyScalar(1.3);
      case 'value':
        return new THREE.Color(0x9b6b9e).multiplyScalar(1.3);
      default:
        return new THREE.Color(0xffffff);
    }
  };

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    
    meshRef.current.rotation.y += delta * 0.5;
    
    if (visible) {
      const targetScale = isHighlighted ? 1.05 : 1;
      const targetBrightness = highlightedLayer === null || isHighlighted ? 1 : 0.05;
      
      const hoverSpeed = 0.05;
      const visibilitySpeed = 0.010;
      
      scaleRef.current += (targetScale - scaleRef.current) * (isHighlighted ? hoverSpeed : visibilitySpeed);
      brightnessRef.current += (targetBrightness - brightnessRef.current) * hoverSpeed;
      
      if (initialYOffset.current > 0) {
        initialYOffset.current *= 0.95;
        meshRef.current.position.y = position[1] + initialYOffset.current;
      }
      
    } else {
      scaleRef.current *= 0.95;
      brightnessRef.current = 1;
      initialYOffset.current = layerId === 'value' ? 0 : 20;
    }

    if (Math.abs(meshRef.current.scale.x - scaleRef.current) > 0.001) {
      meshRef.current.scale.setScalar(scaleRef.current);
    }

    materialRef.current.opacity = baseOpacity;
    materialRef.current.color.copy(getLayerColor()).multiplyScalar(brightnessRef.current);
    
    meshRef.current.visible = scaleRef.current > 0.01;
  });

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1] + initialYOffset.current, position[2]]}
      rotation={[0, Math.PI / 6, 0]}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onHover(layerId);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
    >
      <cylinderGeometry args={[topScale, bottomScale, height, 3]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color={getLayerColor()}
        transparent={true}
        opacity={baseOpacity}
        metalness={0.2}
        roughness={0.15}
        transmission={0.7}
        thickness={3.0}
        attenuationDistance={2.0}
        attenuationColor={getLayerColor()}
        envMapIntensity={2.5}
        clearcoat={0.5}
        clearcoatRoughness={0.15}
        ior={1.8}
        reflectivity={0.4}
        sheen={0.3}
        sheenRoughness={0.2}
        sheenColor={getLayerColor()}
        side={THREE.DoubleSide}
        blending={THREE.CustomBlending}
        blendEquation={THREE.AddEquation}
        blendSrc={THREE.OneFactor}
        blendDst={THREE.OneMinusSrcAlphaFactor}
        depthWrite={false}
      />
    </mesh>
  );
});

const PyramidGroup = React.memo(({ visibleLayers, highlightedLayer, onLayerHover }) => {
  const groupRef = useRef();

  const pyramidLayers = [
    {
      id: 'value',
      y: -3.65,
      bottomScale: 6.5,
      topScale: 4.8,
      height: 4.0,
      color: 0xb4a7d6
    },
    {
      id: 'vision',
      y: 0.4,
      bottomScale: 4.7,
      topScale: 3.0,
      height: 3.8,
      color: 0xa4c9e3
    },
    {
      id: 'mission',
      y: 4.4,
      bottomScale: 2.95,
      topScale: 0,
      height: 4.0,
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
      position={[0, 0.6, 0]}
      onPointerMissed={() => onLayerHover && onLayerHover(null)}
    >
      {pyramidLayers.map((layer) => (
        <PyramidLayer
          key={layer.id}
          position={[0, layer.y, 0]}
          bottomScale={layer.bottomScale}
          topScale={layer.topScale}
          height={layer.height}
          visible={visibleLayers.includes(layer.id)}
          isHighlighted={highlightedLayer === layer.id}
          highlightedLayer={highlightedLayer}
          onHover={onLayerHover}
          layerId={layer.id}
        />
      ))}
    </group>
  );
});

const ThreePyramid = React.memo(({ visibleLayers = ['value'], highlightedLayer = null, onLayerHover }) => {
  return (
    <div className="w-full h-[600px]">
      <Canvas
        camera={{
          position: [0, 4.0, 20],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
      >
        <directionalLight position={[5, 5, 5]} intensity={1.3} />
        <ambientLight intensity={0.7} />
        <pointLight position={[-5, 5, -5]} intensity={0.9} color={0xffffff} />
        <pointLight position={[5, -5, 5]} intensity={0.6} color={0xffffff} />
        
        <PyramidGroup 
          visibleLayers={visibleLayers} 
          highlightedLayer={highlightedLayer} 
          onLayerHover={onLayerHover} 
        />
      </Canvas>
    </div>
  );
});

export default ThreePyramid; 