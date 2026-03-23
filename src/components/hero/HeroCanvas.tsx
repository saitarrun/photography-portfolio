"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMousePosition } from "@/lib/hooks/useMousePosition";

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const mouse = useMousePosition();

  const [positions, opacities] = useMemo(() => {
    const count = 60;
    const pos = new Float32Array(count * 3);
    const opa = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      opa[i] = Math.random() * 0.4 + 0.1;
    }
    return [pos, opa];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    const posArray = ref.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < posArray.length / 3; i++) {
      // Slow upward drift
      posArray[i * 3 + 1] += 0.002;
      // Gentle horizontal sway
      posArray[i * 3] += Math.sin(time * 0.3 + i) * 0.0005;

      // Reset particles that drift too high
      if (posArray[i * 3 + 1] > 4) {
        posArray[i * 3 + 1] = -4;
        posArray[i * 3] = (Math.random() - 0.5) * 10;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    // Subtle mouse influence on rotation
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      mouse.normalizedX * 0.05,
      0.02
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      mouse.normalizedY * 0.03,
      0.02
    );
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-opacity"
          args={[opacities, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ff9155"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition();

  useFrame(() => {
    if (!groupRef.current) return;
    // Subtle camera-like perspective shift based on mouse
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.normalizedX * 0.02,
      0.03
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.normalizedY * 0.015,
      0.03
    );
  });

  return (
    <group ref={groupRef}>
      <Particles />
    </group>
  );
}

export function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-[1]">
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
