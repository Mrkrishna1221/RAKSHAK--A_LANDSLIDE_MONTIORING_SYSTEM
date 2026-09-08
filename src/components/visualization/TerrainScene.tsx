import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TerrainSceneProps {
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
  rainfallIntensity?: number;
  deformationLevel?: number;
}

const riskColors = {
  LOW: "#22c55e",
  MODERATE: "#eab308",
  HIGH: "#f97316",
  VERY_HIGH: "#ef4444",
};

function RiskTerrain({ riskLevel, rainfallIntensity = 50, deformationLevel = 30 }: TerrainSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(12, 12, 60, 60);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      const height =
        Math.sin(x * 0.5) * Math.cos(z * 0.5) * 1.5 +
        Math.sin(x * 1.2 + 0.5) * Math.cos(z * 0.8 + 1) * 0.8 +
        Math.sin(x * 0.2) * Math.cos(z * 0.2) * 2 +
        Math.sin(x * 2.5) * Math.cos(z * 2.5) * 0.3;
      pos.setZ(i, height);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const wireGeometry = useMemo(() => {
    return new THREE.WireframeGeometry(geometry);
  }, [geometry]);

  const color = riskColors[riskLevel];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -Math.PI / 2.2;
      meshRef.current.position.y = -1;
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.03;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = -Math.PI / 2.2;
      wireRef.current.position.y = -0.98;
      const t = state.clock.elapsedTime;
      wireRef.current.rotation.z = Math.sin(t * 0.2) * 0.03;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color={color}
          flatShading
          transparent
          opacity={0.35}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
      <lineSegments ref={wireRef} geometry={wireGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

function RiskIndicators({ riskLevel }: { riskLevel: string }) {
  const ref = useRef<THREE.Group>(null);
  const count = riskLevel === "VERY_HIGH" ? 8 : riskLevel === "HIGH" ? 5 : riskLevel === "MODERATE" ? 3 : 1;
  const color = riskColors[riskLevel as keyof typeof riskColors];

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push({
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * 2 + 0.5,
        z: (Math.random() - 0.5) * 8,
      });
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      const t = state.clock.elapsedTime + i * 0.5;
      child.position.y = positions[i].y + Math.sin(t) * 0.3;
      (child as THREE.Mesh).scale.setScalar(0.8 + Math.sin(t * 2) * 0.2);
    });
  });

  return (
    <group ref={ref}>
      {positions.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function ContourLines() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ref} position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {[2, 3.5, 5, 6.5].map((radius, i) => (
        <mesh key={i}>
          <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
          <meshBasicMaterial color="#1e3a5f" transparent opacity={0.3 - i * 0.05} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export default function TerrainScene({
  riskLevel = "MODERATE",
  rainfallIntensity = 50,
  deformationLevel = 30,
}: TerrainSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 4, 10], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={["#0a0a0b", 8, 25]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 8, 5]} intensity={0.6} color="#8ab4f8" />
        <pointLight position={[-3, 3, -3]} intensity={0.3} color={riskColors[riskLevel]} />
        <RiskTerrain riskLevel={riskLevel} rainfallIntensity={rainfallIntensity} deformationLevel={deformationLevel} />
        <RiskIndicators riskLevel={riskLevel} />
        <ContourLines />
      </Canvas>
    </div>
  );
}
