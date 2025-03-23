import React, { useRef, useCallback, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMediaQuery } from "../../hooks";

// パフォーマンス計測用のユーティリティ
const PERFORMANCE_METRICS = {
  frameCount: 0,
  lastTime: 0,
  fps: 0,
  memoryUsage: 0,
  renderTime: 0
};

// デバッグモードの設定
const DEBUG_MODE = false;

const measurePerformance = () => {
  if (!DEBUG_MODE) return;
  
  const now = performance.now();
  const memory = window?.performance?.memory;
  
  PERFORMANCE_METRICS.frameCount++;
  
  if (now - PERFORMANCE_METRICS.lastTime >= 1000) {
    PERFORMANCE_METRICS.fps = PERFORMANCE_METRICS.frameCount;
    PERFORMANCE_METRICS.frameCount = 0;
    PERFORMANCE_METRICS.lastTime = now;
    PERFORMANCE_METRICS.memoryUsage = memory ? memory.usedJSHeapSize / 1048576 : 0;
    
    console.log('Performance Metrics:', {
      FPS: PERFORMANCE_METRICS.fps,
      'Memory Usage (MB)': PERFORMANCE_METRICS.memoryUsage.toFixed(2),
      'Render Time (ms)': PERFORMANCE_METRICS.renderTime.toFixed(2)
    });
  }
};

// アニメーション設定
const ANIMATION_CONFIG = {
  rotation: {
    layer: 0.3,
    group: 0.1
  },
  scale: {
    hover: 1.05,
    normal: 1,
    hidden: 0,
    threshold: 0.02
  },
  transition: {
    hover: 0.15,
    normal: 0.03
  },
  brightness: {
    active: 1,
    inactive: 0.05
  },
  offset: {
    initial: 20,
    decay: 0.8
  }
};

// ピラミッドの設定
const PYRAMID_CONFIG = {
  layers: {
    mission: {
      color: new THREE.Color(0x48c9b0).multiplyScalar(1.3),
      position: [0, 4.9, 0],
      scales: [2.9, 0],
      height: 4.9
    },
    vision: {
      color: new THREE.Color(0x5ca5d9).multiplyScalar(1.3),
      position: [0, 0.4, 0],
      scales: [4.7, 3.0],
      height: 3.8
    },
    value: {
      color: new THREE.Color(0x9b6b9e).multiplyScalar(1.3),
      position: [0, -3.65, 0],
      scales: [6.5, 4.8],
      height: 4.0
    }
  },
  material: {
    common: {
      transparent: true,
      metalness: 0.2,
      roughness: 0.15,
      transmission: 0.7,
      thickness: 3.0,
      attenuationDistance: 2.0,
      envMapIntensity: 2.5,
      clearcoat: 0.5,
      clearcoatRoughness: 0.15,
      ior: 1.8,
      reflectivity: 0.4,
      sheen: 0.3,
      sheenRoughness: 0.2,
      side: THREE.DoubleSide,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      depthWrite: false,
      opacity: 0.7
    }
  },
  camera: {
    position: [0, 4.0, 20],
    fov: 45,
    near: 0.1,
    far: 1000
  },
  lights: {
    directional: { position: [5, 5, 5], intensity: 1.3 },
    ambient: { intensity: 0.7 },
    point1: { position: [-5, 5, -5], intensity: 0.9, color: 0xffffff },
    point2: { position: [5, -5, 5], intensity: 0.6, color: 0xffffff }
  }
};

// ジオメトリ生成用のユーティリティ関数
const createGeometry = (config) => {
  try {
    const geometry = new THREE.CylinderGeometry(
      config.scales[1],
      config.scales[0],
      config.height,
      3
    );
    
    // バッファジオメトリの検証と修正
    const position = geometry.attributes.position;
    if (position) {
      let hasNaN = false;
      const array = position.array;
      for (let i = 0; i < array.length; i++) {
        if (isNaN(array[i])) {
          array[i] = 0;
          hasNaN = true;
        }
      }
      if (hasNaN) {
        position.needsUpdate = true;
        console.warn('Fixed NaN values in geometry position attribute');
      }
    }
    
    // 正しい計算順序を確保
    geometry.computeVertexNormals();
    
    // boundingSphereの計算前にposition属性が有効であることを確認
    if (geometry.attributes.position && geometry.attributes.position.count > 0) {
      geometry.computeBoundingSphere();
      
      // バウンディングスフィアがNaNでないことを確認
      if (geometry.boundingSphere && 
          (isNaN(geometry.boundingSphere.radius) || 
           isNaN(geometry.boundingSphere.center.x) || 
           isNaN(geometry.boundingSphere.center.y) || 
           isNaN(geometry.boundingSphere.center.z))) {
        
        // 異常値が見つかった場合は手動で初期化
        console.warn('Invalid bounding sphere detected, resetting to default values');
        geometry.boundingSphere.radius = 1;
        geometry.boundingSphere.center.set(0, 0, 0);
      }
    } else {
      console.warn('Cannot compute bounding sphere: Invalid position attribute');
    }
    
    return geometry;
  } catch (error) {
    console.error('Error creating geometry:', error);
    // フォールバックジオメトリを返す
    const fallbackGeometry = new THREE.BoxGeometry(1, 1, 1);
    fallbackGeometry.computeVertexNormals();
    fallbackGeometry.computeBoundingSphere();
    return fallbackGeometry;
  }
};

// アニメーション更新用のユーティリティ関数
const updateAnimation = (meshRef, materialRef, config, {
  visible,
  isHighlighted,
  highlightedLayer,
  scaleRef,
  brightnessRef,
  initialYOffset,
  delta
}) => {
  if (!meshRef.current || !materialRef.current) return;

  meshRef.current.rotation.y += delta * ANIMATION_CONFIG.rotation.layer;

  if (visible) {
    const targetScale = isHighlighted ? ANIMATION_CONFIG.scale.hover : ANIMATION_CONFIG.scale.normal;
    const targetBrightness = highlightedLayer === null || isHighlighted ? 
      ANIMATION_CONFIG.brightness.active : ANIMATION_CONFIG.brightness.inactive;

    scaleRef.current += (targetScale - scaleRef.current) * 
      (isHighlighted ? ANIMATION_CONFIG.transition.hover : ANIMATION_CONFIG.transition.normal);
    brightnessRef.current += (targetBrightness - brightnessRef.current) * ANIMATION_CONFIG.transition.hover;

    if (initialYOffset.current > 0) {
      initialYOffset.current *= ANIMATION_CONFIG.offset.decay;
      meshRef.current.position.y = config.position[1] + initialYOffset.current;
    }
  } else {
    scaleRef.current *= 0.96;
    brightnessRef.current = ANIMATION_CONFIG.brightness.active;
    initialYOffset.current = ANIMATION_CONFIG.offset.initial;
  }

  meshRef.current.scale.setScalar(scaleRef.current);
  materialRef.current.color.copy(config.color).multiplyScalar(brightnessRef.current);
  meshRef.current.visible = scaleRef.current > ANIMATION_CONFIG.scale.threshold;
};

const PyramidLayer = React.memo(({ layerId, visible, isHighlighted, highlightedLayer, onHover }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const scaleRef = useRef(visible ? ANIMATION_CONFIG.scale.normal : ANIMATION_CONFIG.scale.hidden);
  const brightnessRef = useRef(ANIMATION_CONFIG.brightness.active);
  const initialYOffset = useRef(layerId === 'value' ? 0 : ANIMATION_CONFIG.offset.initial);
  const config = PYRAMID_CONFIG.layers[layerId];
  
  const geometry = useMemo(() => createGeometry(config), [config]);
  
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    ...PYRAMID_CONFIG.material.common,
    color: config.color,
    attenuationColor: config.color
  }), [config.color]);

  useFrame((state, delta) => {
    const startTime = performance.now();
    
    updateAnimation(meshRef, materialRef, config, {
      visible,
      isHighlighted,
      highlightedLayer,
      scaleRef,
      brightnessRef,
      initialYOffset,
      delta
    });

    PERFORMANCE_METRICS.renderTime = performance.now() - startTime;
    measurePerformance();
  });

  const handlePointerEvents = useMemo(() => ({
    onPointerEnter: (e) => {
      e.stopPropagation();
      onHover(layerId);
    },
    onPointerLeave: (e) => {
      e.stopPropagation();
      onHover(null);
    }
  }), [layerId, onHover]);

  return (
    <mesh
      ref={meshRef}
      position={config.position}
      rotation={[0, Math.PI / 6, 0]}
      geometry={geometry}
      {...handlePointerEvents}
    >
      <meshPhysicalMaterial ref={materialRef} {...material} />
    </mesh>
  );
});

// モバイルでのシンプルな表示用コンポーネント
const MobilePyramidLayer = React.memo(({ layerId, visible, isHighlighted, highlightedLayer, onHover }) => {
  const meshRef = useRef();
  const config = PYRAMID_CONFIG.layers[layerId];
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.visible = visible;
      meshRef.current.scale.setScalar(isHighlighted ? 1.1 : 1);
      
      // ハイライト状態に応じて色を変更
      const material = meshRef.current.material;
      if (material) {
        const brightness = highlightedLayer === null || isHighlighted ? 1 : 0.4;
        material.color.copy(config.color).multiplyScalar(brightness);
      }
    }
  }, [visible, isHighlighted, highlightedLayer, config.color]);
  
  return (
    <mesh
      ref={meshRef}
      position={config.position}
      rotation={[0, Math.PI / 6, 0]}
      visible={visible}
      onPointerEnter={() => onHover(layerId)}
      onPointerLeave={() => onHover(null)}
    >
      <cylinderGeometry 
        args={[
          config.scales[1], 
          config.scales[0], 
          config.height, 
          3
        ]} 
      />
      <meshStandardMaterial 
        color={config.color} 
        transparent={true}
        opacity={0.8}
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
});

const PyramidGroup = React.memo(({ visibleLayers, highlightedLayer, onLayerHover, isMobile }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isMobile ? 0.05 : ANIMATION_CONFIG.rotation.group);
    }
  });

  return (
    <group 
      ref={groupRef} 
      rotation={[0, Math.PI / 6, 0]} 
      position={[0, 0.6, 0]}
      onPointerMissed={() => onLayerHover(null)}
    >
      {Object.keys(PYRAMID_CONFIG.layers).map((layerId) => (
        isMobile ? 
          <MobilePyramidLayer
            key={layerId}
            layerId={layerId}
            visible={visibleLayers.includes(layerId)}
            isHighlighted={highlightedLayer === layerId}
            highlightedLayer={highlightedLayer}
            onHover={onLayerHover}
          /> :
          <PyramidLayer
            key={layerId}
            layerId={layerId}
            visible={visibleLayers.includes(layerId)}
            isHighlighted={highlightedLayer === layerId}
            highlightedLayer={highlightedLayer}
            onHover={onLayerHover}
          />
      ))}
    </group>
  );
});

const Scene = React.memo(({ visibleLayers, highlightedLayer, onLayerHover }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <>
      <ambientLight intensity={PYRAMID_CONFIG.lights.ambient.intensity} />
      <directionalLight
        position={PYRAMID_CONFIG.lights.directional.position}
        intensity={PYRAMID_CONFIG.lights.directional.intensity}
      />
      <pointLight
        position={PYRAMID_CONFIG.lights.point1.position}
        intensity={PYRAMID_CONFIG.lights.point1.intensity}
        color={PYRAMID_CONFIG.lights.point1.color}
      />
      <pointLight
        position={PYRAMID_CONFIG.lights.point2.position}
        intensity={PYRAMID_CONFIG.lights.point2.intensity}
        color={PYRAMID_CONFIG.lights.point2.color}
      />
      
      <PyramidGroup
        visibleLayers={visibleLayers}
        highlightedLayer={highlightedLayer}
        onLayerHover={onLayerHover}
        isMobile={isMobile}
      />
    </>
  );
});

const ThreePyramid = React.memo(({ visibleLayers, highlightedLayer, onLayerHover }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleHover = useCallback((layerId) => {
    if (onLayerHover) {
      onLayerHover(layerId);
    }
  }, [onLayerHover]);
  
  const canvasProps = {
    camera: PYRAMID_CONFIG.camera,
    shadows: !isMobile,
    frameloop: isMobile ? 'demand' : 'always',
    dpr: isMobile ? [0.5, 1] : [1, 2],
    gl: {
      antialias: !isMobile,
      alpha: true,
      precision: 'lowp',
      powerPreference: isMobile ? "low-power" : "high-performance",
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      minHeight: '400px',
      maxHeight: '600px' 
    }}>
      <Canvas {...canvasProps}>
        <Suspense fallback={null}>
          <Scene
            visibleLayers={visibleLayers}
            highlightedLayer={highlightedLayer}
            onLayerHover={handleHover}
          />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default ThreePyramid; 