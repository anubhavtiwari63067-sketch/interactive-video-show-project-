"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { generateShapePoints } from "@/utils/particleMath";

interface ParticlesProps {
  count?: number;
}

export default function Particles({ count = 10000 }: ParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { handPosition, handActive, currentShape, particleColor, pinchDistance, gesture } = useStore();
  
  // Dummy object for matrix calculations
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Particle data
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
       temp.push({
         pos: new THREE.Vector3(
           (Math.random() - 0.5) * 20,
           (Math.random() - 0.5) * 20,
           (Math.random() - 0.5) * 20
         ),
         vel: new THREE.Vector3(),
         acc: new THREE.Vector3(),
         target: new THREE.Vector3()
       });
    }
    return temp;
  }, [count]);

  // Update targets when shape changes
  useEffect(() => {
    const targetPoints = generateShapePoints(currentShape, count);
    for (let i = 0; i < count; i++) {
      particles[i].target.set(
        targetPoints[i * 3],
        targetPoints[i * 3 + 1],
        targetPoints[i * 3 + 2]
      );
    }
  }, [currentShape, count, particles]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const handPosVec = new THREE.Vector3(handPosition.x, handPosition.y, handPosition.z);
    
    // Interaction strength based on pinch/gesture
    const repulsionStrength = handActive && gesture === "FIST" ? 8 : 0;
    const attractionStrength = handActive && gesture === "OPEN_PALM" ? 5 : 0;
    const explosionFactor = 1 + pinchDistance * 10;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      
      // 1. Move towards target (Shape formation)
      const targetWithExplosion = p.target.clone().multiplyScalar(explosionFactor);
      const steering = targetWithExplosion.clone().sub(p.pos).multiplyScalar(0.02);
      p.acc.add(steering);

      // 2. Hand interaction
      if (handActive) {
        const distToHand = p.pos.distanceTo(handPosVec);
        if (distToHand < 5) {
          const force = p.pos.clone().sub(handPosVec).normalize();
          
          if (repulsionStrength > 0) {
            force.multiplyScalar(repulsionStrength / (distToHand + 1));
            p.acc.add(force);
          }
          
          if (attractionStrength > 0) {
            force.multiplyScalar(-attractionStrength / (distToHand + 1));
            p.acc.add(force);
          }
        }
      }

      // 3. Physics update
      p.vel.add(p.acc);
      p.vel.multiplyScalar(0.95); // Damping
      p.pos.add(p.vel);
      p.acc.set(0, 0, 0);

      // 4. Color Update (Dynamic shift based on velocity)
      const speed = p.vel.length();
      const baseColor = new THREE.Color(particleColor);
      const shiftColor = new THREE.Color("#ff00dd"); // Neon Pink shift
      baseColor.lerp(shiftColor, Math.min(speed * 2, 1));
      
      // Update mesh matrix
      dummy.position.copy(p.pos);
      // Small rotation for flair
      dummy.rotation.set(time * 0.2, time * 0.3, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, baseColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color={particleColor} transparent opacity={0.6} />
    </instancedMesh>
  );
}
