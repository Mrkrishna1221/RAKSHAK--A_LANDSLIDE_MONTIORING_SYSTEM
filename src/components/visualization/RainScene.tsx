import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "../../hooks/useAnimations";

interface RainSceneProps {
  rainIntensity: "low" | "moderate" | "high" | "extreme";
}

// Reduced particle counts for better performance
const intensityConfig = {
  low: { count: 200, speed: 2, spread: 20, opacity: 0.3 },
  moderate: { count: 600, speed: 4, spread: 25, opacity: 0.4 },
  high: { count: 1200, speed: 6, spread: 30, opacity: 0.5 },
  extreme: { count: 2000, speed: 9, spread: 35, opacity: 0.6 },
};

// Mobile gets even fewer particles
const mobileIntensityConfig = {
  low: { count: 80, speed: 2, spread: 20, opacity: 0.3 },
  moderate: { count: 200, speed: 4, spread: 25, opacity: 0.4 },
  high: { count: 400, speed: 6, spread: 30, opacity: 0.5 },
  extreme: { count: 700, speed: 9, spread: 35, opacity: 0.6 },
};

function RainParticles({ intensity }: { intensity: "low" | "moderate" | "high" | "extreme" }) {
  const meshRef = useRef<THREE.Points>(null);
  const isMobile = useIsMobile();
  const config = isMobile ? mobileIntensityConfig[intensity] : intensityConfig[intensity];

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(config.count * 3);
    const vel = new Float32Array(config.count);
    for (let i = 0; i < config.count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * config.spread;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * config.spread;
      vel[i] = config.speed * (0.7 + Math.random() * 0.6);
    }
    return { positions: pos, velocities: vel };
  }, [config.count, config.speed, config.spread]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < config.count; i++) {
      arr[i * 3 + 1] -= velocities[i] * delta * 10;
      if (arr[i * 3 + 1] < -2) {
        arr[i * 3 + 1] = 18 + Math.random() * 4;
        arr[i * 3] = (Math.random() - 0.5) * config.spread;
        arr[i * 3 + 2] = (Math.random() - 0.5) * config.spread;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={config.count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#94a3b8"
        transparent
        opacity={config.opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function TerrainMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(40, 40, 80, 80);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      const height =
        Math.sin(x * 0.3) * Math.cos(z * 0.3) * 2 +
        Math.sin(x * 0.7 + 1) * Math.cos(z * 0.5 + 2) * 1.2 +
        Math.sin(x * 0.15) * Math.cos(z * 0.15) * 3;
      pos.setZ(i, height);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -Math.PI / 2.5;
      meshRef.current.position.y = -3;
      meshRef.current.position.z = -5;
      const t = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = Math.sin(t) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#1a2332"
        wireframe={false}
        flatShading
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function GridFloor() {
  return (
    <gridHelper
      args={[40, 40, "#1e3a5f", "#0f1f33"]}
      position={[0, -3.5, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

function FogParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 8 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#3b82f6"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function RainScene({ rainIntensity = "moderate" }: RainSceneProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: false
        }}
      >
        <fog attach="fog" args={["#0a0a0b", 5, 35]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={0.5} color="#6b8fc7" />
        <pointLight position={[-5, 5, -5]} intensity={0.3} color="#3b82f6" />
        <TerrainMesh />
        <GridFloor />
        <RainParticles intensity={rainIntensity} />
        <FogParticles />
      </Canvas>
    </div>
  );
}
