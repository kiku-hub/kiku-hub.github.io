import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useMediaQuery } from "../../hooks";

// モバイル用と通常用の星の数を定数として定義
const MOBILE_STAR_COUNT = 1800;
const DESKTOP_STAR_COUNT = 3000;

const Stars = ({ isMobile }) => {
  const ref = useRef();
  // useStateの中で条件分岐を行わず、一貫した構造にする
  const [sphere] = useState(() => 
    random.inSphere(new Float32Array(isMobile ? MOBILE_STAR_COUNT : DESKTOP_STAR_COUNT), { radius: 1.5 })
  );

  useFrame((state, delta) => {
    // 条件分岐はここで行う
    const rotationSpeed = isMobile ? 0.5 : 1;
    ref.current.rotation.x -= delta / (15 / rotationSpeed);
    ref.current.rotation.y -= delta / (20 / rotationSpeed);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color='#ffffff'
          size={isMobile ? 0.002 : 0.003}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

// メモ化されたStarsを作成
const MobileStars = () => <Stars isMobile={true} />;
const DesktopStars = () => <Stars isMobile={false} />;

const StarsCanvas = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className='w-full h-full fixed top-0 left-0 z-[-1]'>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          {isMobile ? <MobileStars /> : <DesktopStars />}
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
