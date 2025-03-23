import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useMediaQuery } from "../../hooks";

const Stars = ({ isMobile }) => {
  const ref = useRef();
  const starCount = isMobile ? 1000 : 3000;
  const [sphere] = useState(() => 
    random.inSphere(new Float32Array(starCount), { radius: 1.5 })
  );

  useFrame((state, delta) => {
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

const StarsCanvas = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className='w-full h-full fixed top-0 left-0 z-[-1]'>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars isMobile={isMobile} />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
