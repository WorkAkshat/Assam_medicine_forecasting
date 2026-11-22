import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// GRD's dosage forms as a slow, floating still-life: two-tone capsules and scored tablets.
const PALETTE = {
  ink: '#15303B',
  teal: '#168C85',
  gold: '#D29C36',
  white: '#F4F7F6',
  mist: '#CDEEEB',
};

function rand(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Capsule({ position, rotation, colors, speed, phase }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    ref.current.position.y = position[1] + Math.sin(t) * 0.18;
    ref.current.rotation.x = rotation[0] + Math.sin(t * 0.7) * 0.25;
    ref.current.rotation.z = rotation[2] + t * 0.12;
  });
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh position={[0, 0.27, 0]}>
        <capsuleGeometry args={[0.26, 0.55, 12, 24]} />
        <meshPhysicalMaterial color={colors[0]} roughness={0.25} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      <mesh position={[0, -0.27, 0]}>
        <capsuleGeometry args={[0.262, 0.55, 12, 24]} />
        <meshPhysicalMaterial color={colors[1]} roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.2} />
      </mesh>
    </group>
  );
}

function Tablet({ position, rotation, color, speed, phase }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    ref.current.position.y = position[1] + Math.sin(t) * 0.15;
    ref.current.rotation.x = rotation[0] + t * 0.18;
    ref.current.rotation.y = rotation[1] + t * 0.1;
  });
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 0.16, 40]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.081, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.035]} />
        <meshStandardMaterial color="#000" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function Cluster() {
  const group = useRef();
  const items = useMemo(() => {
    const r = rand(42);
    const out = [];
    const pairs = [
      [PALETTE.teal, PALETTE.white],
      [PALETTE.gold, PALETTE.white],
      [PALETTE.ink, PALETTE.mist],
      [PALETTE.teal, PALETTE.gold],
    ];
    for (let i = 0; i < 22; i += 1) {
      const a = r() * Math.PI * 2;
      const rad = 1.2 + r() * 2.6;
      const position = [Math.cos(a) * rad * 1.25, (r() - 0.5) * 3.4, Math.sin(a) * rad - 1];
      const rotation = [r() * Math.PI, r() * Math.PI, r() * Math.PI];
      const speed = 0.35 + r() * 0.4;
      const phase = r() * 10;
      if (i % 3 === 2) out.push({ kind: 'tablet', position, rotation, speed, phase, color: r() > 0.5 ? PALETTE.white : PALETTE.mist });
      else out.push({ kind: 'capsule', position, rotation, speed, phase, colors: pairs[i % pairs.length] });
    }
    return out;
  }, []);
  useFrame((state) => {
    // Gentle parallax toward the pointer
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.35, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.2, 0.04);
  });
  return (
    <group ref={group}>
      {items.map((it, i) =>
        it.kind === 'capsule' ? <Capsule key={i} {...it} /> : <Tablet key={i} {...it} />,
      )}
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 7.5], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} aria-label="Floating GRD capsules and tablets">
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#fff4e0" />
      <directionalLight position={[-5, -2, 2]} intensity={0.6} color="#9ddfd7" />
      <pointLight position={[0, 0, 3]} intensity={6} distance={9} color="#D29C36" />
      <Cluster />
    </Canvas>
  );
}
