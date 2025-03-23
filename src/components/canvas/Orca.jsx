import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from 'three';
import { useMediaQuery } from "../../hooks";

// 定数の定義
const MODEL_PATH = "/orca/Animation_Formal_Bow_withSkin.glb";
const ANIMATION_CONFIG = {
  timeScale: 0.7,
  fadeInDuration: 1,
  fadeOutDuration: 1,
};

const CAMERA_CONFIG = {
  fov: 45,
  near: 0.1,
  far: 200,
  position: [15, 3, 5],
};

const MODEL_SCALE = 6.5;

// モバイル用のシンプルなプレースホルダー
const MobilePlaceholder = () => {
  const ref = useRef();
  
  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.y = Math.PI / 4;
    }
  }, []);
  
  return (
    <mesh ref={ref} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <boxGeometry args={[5, 5, 5]} />
      <meshStandardMaterial 
        color="#1976D2"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.8}
      />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
    </mesh>
  );
};

// Orcaモデルコンポーネント
const OrcaModel = ({ isMobile }) => {
  // モバイルの場合は早期リターン
  if (isMobile) {
    return <MobilePlaceholder />;
  }
  
  const modelRef = useRef();
  const hasStartedRef = useRef(false);
  const [modelPath, setModelPath] = useState(MODEL_PATH);
  const [loadError, setLoadError] = useState(false);

  // GLTFローダーの設定
  useEffect(() => {
    const loadModel = async () => {
      try {
        await useGLTF.preload(modelPath, undefined, {
          crossOrigin: 'anonymous'
        });
      } catch (error) {
        console.error('CDNからのモデル読み込みに失敗:', error);
        if (modelPath === MODEL_PATH) {
          setLoadError(true);
        }
      }
    };
    loadModel();
  }, [modelPath]);

  // モデルの読み込みに失敗した場合はプレースホルダーを表示
  if (loadError) {
    return <MobilePlaceholder />;
  }

  const orca = useGLTF(modelPath);
  const { actions, names } = useAnimations(orca.animations, orca.scene);
  const { gl } = useThree();

  useEffect(() => {
    if (gl) {
      // レンダラーの設定
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // デバイスピクセル比を最大2までに制限
      gl.capabilities.getMaxAnisotropy();
    }
  }, [gl]);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // シーンの最適化
    orca.scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        
        // ジオメトリの最適化
        if (object.geometry) {
          object.geometry.attributes.position.usage = THREE.StaticDrawUsage;
          if (object.geometry.attributes.normal) {
            object.geometry.attributes.normal.usage = THREE.StaticDrawUsage;
          }
          if (object.geometry.attributes.uv) {
            object.geometry.attributes.uv.usage = THREE.StaticDrawUsage;
          }
        }
        
        // マテリアルとテクスチャの最適化
        if (object.material) {
          // テクスチャの最適化
          const optimizeTexture = (texture) => {
            if (!texture) return;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            texture.needsUpdate = true;
            if (gl) {
              texture.anisotropy = gl.capabilities.getMaxAnisotropy();
            }
          };

          optimizeTexture(object.material.map);
          optimizeTexture(object.material.normalMap);
          optimizeTexture(object.material.roughnessMap);
          optimizeTexture(object.material.metalnessMap);
          
          // マテリアルの最適化
          object.material.precision = 'lowp';
          object.material.needsUpdate = true;
        }
      }
    });

    // メモリ解放のための参照解除
    const cleanup = () => {
      names.forEach((name) => {
        if (actions[name]) {
          actions[name].stop();
          actions[name].reset();
        }
      });
      
      orca.scene.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          if (object.material.map) object.material.map.dispose();
          if (object.material.normalMap) object.material.normalMap.dispose();
          if (object.material.roughnessMap) object.material.roughnessMap.dispose();
          if (object.material.metalnessMap) object.material.metalnessMap.dispose();
          object.material.dispose();
        }
      });
    };

    // 5秒待ってからアニメーション開始
    const timer = setTimeout(() => {
      names.forEach((name) => {
        const action = actions[name];
        action.reset();
        action.time = 0;
        action
          .setLoop(THREE.LoopOnce, 1)
          .setEffectiveTimeScale(ANIMATION_CONFIG.timeScale)
          .fadeIn(ANIMATION_CONFIG.fadeInDuration)
          .play();

        action.clampWhenFinished = true;
      });
    }, 4000);

    return () => {
      clearTimeout(timer);
      cleanup();
      names.forEach((name) => {
        if (actions[name]) {
          actions[name].fadeOut(ANIMATION_CONFIG.fadeOutDuration);
        }
      });
    };
  }, [actions, names, orca.scene, gl]);

  return (
    <mesh ref={modelRef}>
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
        scale={MODEL_SCALE}
        position={[-9, -2.5, -2.0]}
        rotation={[0, 0, 0]}
      />
    </mesh>
  );
};

// Canvas コンポーネント
const OrcaCanvas = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  
  const canvasProps = {
    shadows: !isMobile, // モバイルでは影を無効
    frameloop: isMobile ? 'demand' : 'always', // モバイルでは必要なときだけ描画
    dpr: isMobile ? [0.5, 1] : [1, 2], // モバイルではピクセル比を下げる
    gl: { 
      preserveDrawingBuffer: true,
      antialias: !isMobile, // モバイルではアンチエイリアスを無効
      powerPreference: isMobile ? "low-power" : "high-performance",
      alpha: true,
      precision: 'lowp',
      depth: true,
      stencil: false
    },
    camera: CAMERA_CONFIG,
    performance: { min: 0.1 }
  };

  return (
    <Canvas {...canvasProps}>
      <Suspense fallback={null}>
        <OrbitControls
          enableZoom={false}
          enableRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <OrcaModel isMobile={isMobile} />
      </Suspense>
      {!isMobile && <Preload all />}
    </Canvas>
  );
};

export default OrcaCanvas; 