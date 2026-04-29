"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const ref = useRef<THREE.Points>(null);
  
  // Create particles
  const particles = useMemo(() => {
    const arr = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta / 15;
      ref.current.rotation.x -= delta / 20;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3}>
      <PointMaterial
        transparent
        color="#ff4d4d"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function BloodDrop({ position, scale, color, speed = 2 }: { position: [number, number, number], scale: number, color: string, speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.2;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3 * speed) * 0.1;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={2} position={position}>
      <mesh ref={meshRef} scale={scale}>
        {/* An elongated sphere representing an abstract blood drop */}
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.2}
          metalness={0.1}
          envMapIntensity={1}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  useFrame((state) => {
    // Subtle mouse responsive camera movement
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, (state.pointer.x * Math.PI) / 8, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (state.pointer.y * Math.PI) / 8, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffb3b3" />
      <pointLight position={[-10, -10, -5]} intensity={2} color="#ff1a1a" />
      
      <Particles />
      
      <BloodDrop position={[-3, 1, -2]} scale={0.8} color="#ef4444" speed={1.5} />
      <BloodDrop position={[4, -1, -3]} scale={1.2} color="#dc2626" speed={2} />
      <BloodDrop position={[2, 3, -5]} scale={0.6} color="#b91c1c" speed={1.8} />
      <BloodDrop position={[-4, -2, -4]} scale={1.5} color="#991b1b" speed={1.2} />
      <BloodDrop position={[0, -4, -6]} scale={1.0} color="#7f1d1d" speed={2.5} />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <Scene />
      </Canvas>
      {/* Overlay gradient to blend scene with the background smoothly */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background z-10" />
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)] z-10 opacity-80" />
    </div>
  );
}
