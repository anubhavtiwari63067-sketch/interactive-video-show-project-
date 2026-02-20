"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Particles from "./Particles";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 60 }}
      gl={{ antialias: false, alpha: true }}
      className="w-full h-full"
    >
      <color attach="background" args={["#000000"]} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Particles count={15000} />
      
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.4} 
        />
      </EffectComposer>
      
      {/* <OrbitControls enablePan={false} enableZoom={true} /> */}
    </Canvas>
  );
}
