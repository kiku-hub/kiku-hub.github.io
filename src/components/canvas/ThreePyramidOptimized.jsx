import React, { useRef, useCallback, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, useAnimations } from "@react-three/drei";

const PyramidLayer = React.memo(({ position, bottomScale, topScale, height, visible, isHighlighted, highlightedLayer, onHover, layerId }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const scaleRef = useRef(visible ? 1 : 0);
  const brightnessRef = useRef(1);
  const baseOpacity = 0.7;
  const initialYOffset = useRef(layerId === 'value' ? 0 : 20);

  const layerColor = useMemo(() => {
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
  }, [layerId]);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    
    meshRef.current.rotation.y += delta * 0.3;
    
    if (visible) {
      const targetScale = isHighlighted ? 1.05 : 1;
      const targetBrightness = highlightedLayer === null || isHighlighted ? 1 : 0.05;
      
      const hoverSpeed = 0.15;
      const visibilitySpeed = 0.03;
      
      scaleRef.current += (targetScale - scaleRef.current) * (isHighlighted ? hoverSpeed : visibilitySpeed);
      brightnessRef.current += (targetBrightness - brightnessRef.current) * hoverSpeed;
      
      if (initialYOffset.current > 0) {
        initialYOffset.current *= 0.8;
        meshRef.current.position.y = position[1] + initialYOffset.current;
      }
      
    } else {
      scaleRef.current *= 0.96;
      brightnessRef.current = 1;
      initialYOffset.current = layerId === 'value' ? 0 : 20;
    }

    if (Math.abs(meshRef.current.scale.x - scaleRef.current) > 0.005) {
      meshRef.current.scale.setScalar(scaleRef.current);
    }

    materialRef.current.opacity = baseOpacity;
    materialRef.current.color.copy(layerColor).multiplyScalar(brightnessRef.current);
    
    meshRef.current.visible = scaleRef.current > 0.02;
  });

  const materialProps = useMemo(() => ({
    transparent: true,
    opacity: baseOpacity,
    metalness: 0.2,
    roughness: 0.15,
    transmission: 0.7,
    thickness: 3.0,
    attenuationDistance: 2.0,
    attenuationColor: layerColor,
    envMapIntensity: 2.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.15,
    ior: 1.8,
    reflectivity: 0.4,
    sheen: 0.3,
    sheenRoughness: 0.2,
    sheenColor: layerColor,
    side: THREE.DoubleSide,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    depthWrite: false
  }), [layerColor]);

  const handlePointerEnter = useCallback((e) => {
    e.stopPropagation();
    onHover(layerId);
  }, [onHover, layerId]);

  const handlePointerLeave = useCallback((e) => {
    e.stopPropagation();
    onHover(null);
  }, [onHover]);

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1] + initialYOffset.current, position[2]]}
      rotation={[0, Math.PI / 6, 0]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <cylinderGeometry args={[topScale, bottomScale, height, 3]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color={layerColor}
        {...materialProps}
      />
    </mesh>
  );
});

const OrcaModel = React.memo(({ position, visible }) => {
  const modelRef = useRef();
  const orca = useGLTF("/orca/Animation_Skill_01_withSkin.glb");
  const { animations } = orca;
  const { actions, names } = useAnimations(animations, orca.scene);
  const scaleRef = useRef(0);
  const initialYOffset = useRef(20);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    orca.scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

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
        actions[name].fadeOut(0.5);
      });
    };
  }, [actions, names, orca.scene]);

  useFrame(() => {
    if (!modelRef.current) return;
    
    if (visible) {
      if (!hasStartedRef.current) {
        setTimeout(() => {
          hasStartedRef.current = true;
        }, 100);
      }
      
      if (hasStartedRef.current) {
        scaleRef.current += (1 - scaleRef.current) * 0.03;
        if (initialYOffset.current > 0) {
          initialYOffset.current *= 0.8;
        }
      }
    } else {
      scaleRef.current *= 0.96;
      initialYOffset.current = 20;
      hasStartedRef.current = false;
    }
    
    modelRef.current.scale.setScalar(scaleRef.current * 1.0);
    modelRef.current.position.y = position[1] + initialYOffset.current;
    modelRef.current.visible = scaleRef.current > 0.02;
  });

  return (
    <primitive
      ref={modelRef}
      object={orca.scene}
      scale={0}
      position={[position[0], position[1], position[2]]}
      rotation={[0, Math.PI / 2, 0]}
    />
  );
});

const PyramidGroup = React.memo(({ visibleLayers, highlightedLayer, onLayerHover }) => {
  const groupRef = useRef();

  const pyramidLayers = useMemo(() => [
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
      y: 4.9,
      bottomScale: 2.9,
      topScale: 0,
      height: 4.9,
      color: 0x8dd3c7
    }
  ], []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
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
      <OrcaModel 
        position={[0, pyramidLayers[2].y - 2.1, 0]}
        visible={visibleLayers.includes('mission')}
      />
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
        <Suspense fallback={null}>
          <directionalLight position={[5, 5, 5]} intensity={1.3} />
          <ambientLight intensity={0.7} />
          <pointLight position={[-5, 5, -5]} intensity={0.9} color={0xffffff} />
          <pointLight position={[5, -5, 5]} intensity={0.6} color={0xffffff} />
          
          <PyramidGroup 
            visibleLayers={visibleLayers} 
            highlightedLayer={highlightedLayer} 
            onLayerHover={onLayerHover} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default ThreePyramid; 