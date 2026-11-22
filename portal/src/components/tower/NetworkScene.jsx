import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { HUB, project } from '../../engine/catalog';
import { STATUS_COLORS, locStatus } from './statusColors';

// ---------- Terrain model of Northeast India (stylised, not survey-grade) ----------

const BRAHMAPUTRA = [
  [27.83, 95.65], [27.5, 94.9], [27.1, 94.45], [26.92, 94.1], [26.72, 93.55], [26.62, 92.85],
  [26.42, 92.3], [26.2, 91.75], [26.22, 91.1], [26.17, 90.62], [26.02, 89.98], [25.6, 89.72],
].map(([lat, lon]) => project(lat, lon));
const BARAK = [[24.95, 93.35], [24.83, 92.78], [24.86, 92.35], [24.9, 91.95], [24.75, 91.5]].map(([lat, lon]) => project(lat, lon));

function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const fbm = (x, y) => noise(x, y) * 0.55 + noise(x * 2.1, y * 2.1) * 0.3 + noise(x * 4.3, y * 4.3) * 0.15;

function distToPolyline(x, z, pts) {
  let best = Infinity;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const a = pts[i];
    const b = pts[i + 1];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz)));
    const px = a.x + t * dx - x;
    const pz = a.z + t * dz - z;
    best = Math.min(best, Math.hypot(px, pz));
  }
  return best;
}
const sstep = (e0, e1, x) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const gauss = (x, z, cx, cz, rx, rz) => Math.exp(-(((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2));

export function elevation(x, z) {
  const lon = x / 2 + 93;
  const lat = -z / 2.2 + 25.6;
  // Northern Himalayan wall (Arunachal) rises away from the Brahmaputra
  const north = sstep(26.9, 28.6, lat + (lon - 93) * 0.12) * 2.6;
  const meghalaya = 1.15 * gauss(lon, lat, 91.3, 25.55, 1.05, 0.38);
  const eastHills = sstep(93.0, 93.9, lon) * sstep(26.9, 26.2, lat) * sstep(22.3, 23.4, lat) * 1.55;
  const imphalBasin = -0.9 * gauss(lon, lat, 93.95, 24.8, 0.22, 0.25);
  const tripura = 0.45 * gauss(lon, lat, 91.7, 23.8, 0.5, 0.6);
  const mizo = 0.5 * gauss(lon, lat, 92.75, 23.4, 0.35, 0.9);
  let h = north + meghalaya + eastHills + imphalBasin + tripura + mizo;
  const valley = sstep(0.25, 2.0, distToPolyline(x, z, BRAHMAPUTRA)) * sstep(0.15, 1.1, distToPolyline(x, z, BARAK));
  h *= 0.25 + 0.75 * valley;
  h += (fbm(x * 0.9, z * 0.9) - 0.45) * (0.18 + 0.32 * Math.min(1, h));
  return Math.max(-0.05, h);
}

const TERRAIN = { w: 17.5, d: 18, cx: 1.2, cz: -0.4, sx: 150, sz: 150 };
const C_VALLEY = new THREE.Color('#1d5a52');
const C_LOW = new THREE.Color('#2b6a63');
const C_HILL = new THREE.Color('#3d6673');
const C_HIGH = new THREE.Color('#5a7a87');
const C_PEAK = new THREE.Color('#a9bfc6');

function terrainColor(h, out) {
  if (h < 0.35) return out.copy(C_VALLEY).lerp(C_LOW, h / 0.35);
  if (h < 1.1) return out.copy(C_LOW).lerp(C_HILL, (h - 0.35) / 0.75);
  if (h < 2.0) return out.copy(C_HILL).lerp(C_HIGH, (h - 1.1) / 0.9);
  return out.copy(C_HIGH).lerp(C_PEAK, Math.min(1, (h - 2.0) / 0.8));
}

function Terrain() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(TERRAIN.w, TERRAIN.d, TERRAIN.sx, TERRAIN.sz);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i) + TERRAIN.cx;
      const z = pos.getZ(i) + TERRAIN.cz;
      const h = elevation(x, z);
      pos.setY(i, h);
      // fade the far edges into the night so the map reads as a floating relief
      const edge = Math.min(1, Math.min(TERRAIN.w / 2 - Math.abs(pos.getX(i)), TERRAIN.d / 2 - Math.abs(pos.getZ(i))) / 2.2);
      terrainColor(h, c).multiplyScalar(0.35 + 0.65 * edge);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} position={[TERRAIN.cx, 0, TERRAIN.cz]} receiveShadow>
      <meshStandardMaterial vertexColors flatShading roughness={0.92} metalness={0.02} />
    </mesh>
  );
}

const riverMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#5fe0d2') } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader:
      'uniform float uTime; uniform vec3 uColor; varying vec2 vUv; void main(){ float flow = 0.55 + 0.45 * sin(vUv.x * 90.0 - uTime * 2.4); float edge = smoothstep(0.0, 0.5, 1.0 - abs(vUv.y - 0.5) * 2.0); gl_FragColor = vec4(uColor * (0.7 + 0.5 * flow), 0.85 * edge); }',
  });

function River({ points, radius, motion }) {
  const ref = useRef();
  const { geometry, material } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p.x, Math.max(0.02, elevation(p.x, p.z)) + 0.04, p.z)));
    return { geometry: new THREE.TubeGeometry(curve, 220, radius, 6, false), material: riverMaterial() };
  }, [points, radius]);
  useFrame((_, dt) => {
    if (motion && ref.current) ref.current.material.uniforms.uTime.value += dt;
  });
  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);
  return <mesh ref={ref} geometry={geometry} material={material} />;
}

// ---------- Network layer ----------

function posOf(lat, lon, lift = 0) {
  const p = project(lat, lon);
  return new THREE.Vector3(p.x, elevation(p.x, p.z) + lift, p.z);
}

function Depot({ loc, selected, hovered, onHover, onSelect, maxValue, motion }) {
  const ring = useRef();
  const status = locStatus(loc);
  const color = STATUS_COLORS[status];
  const base = useMemo(() => posOf(loc.lat, loc.lon), [loc.lat, loc.lon]);
  const height = 0.25 + 1.35 * Math.sqrt(loc.stockValue / maxValue);
  const grow = useRef(0);
  const mesh = useRef();
  useFrame((state, dt) => {
    grow.current = Math.min(1, grow.current + dt * (motion ? 1.4 : 10));
    const e = 1 - (1 - grow.current) ** 3;
    if (mesh.current) {
      mesh.current.scale.y = Math.max(0.001, e);
      mesh.current.position.y = base.y + (height * e) / 2;
    }
    if (ring.current) {
      const t = (state.clock.elapsedTime * 0.8) % 1;
      const s = motion ? 0.4 + t * 1.4 : 1;
      ring.current.scale.set(s, s, s);
      ring.current.material.opacity = status === 'critical' ? (motion ? 0.75 * (1 - t) : 0.5) : 0;
    }
  });
  const active = selected || hovered;
  return (
    <group>
      <mesh
        ref={mesh}
        position={[base.x, base.y + height / 2, base.z]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(loc.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(loc.id);
        }}
      >
        <cylinderGeometry args={[active ? 0.14 : 0.11, active ? 0.14 : 0.11, height, 18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.9 : 0.45} roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh ref={ring} position={[base.x, base.y + 0.03, base.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.24, 0.29, 40]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </mesh>
      <Html position={[base.x, base.y + height + 0.32, base.z]} center distanceFactor={16} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium transition-colors ${active ? 'bg-white text-ink-950' : 'bg-ink-950/70 text-white/85'}`}>
          {loc.name}
        </div>
      </Html>
    </group>
  );
}

function Hub() {
  const p = useMemo(() => posOf(HUB.lat, HUB.lon), []);
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.4;
  });
  return (
    <group position={[p.x, p.y, p.z]}>
      <mesh ref={ref} position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.24, 0.3, 0.8, 6]} />
        <meshStandardMaterial color="#d29c36" emissive="#c08427" emissiveIntensity={0.55} roughness={0.3} metalness={0.4} />
      </mesh>
      <Html position={[0, 1.15, 0]} center distanceFactor={16} style={{ pointerEvents: 'none' }}>
        <div className="whitespace-nowrap rounded bg-muga-400 px-1.5 py-0.5 text-[11px] font-semibold text-ink-950">Rani hub</div>
      </Html>
    </group>
  );
}

function Routes({ locations, selected, maxOrder, motion }) {
  const inst = useRef();
  const routes = useMemo(() => {
    const hub = posOf(HUB.lat, HUB.lon, 0.9);
    return locations.map((l) => {
      const end = posOf(l.lat, l.lon, 0.25);
      const mid = hub.clone().lerp(end, 0.5);
      mid.y = Math.max(hub.y, end.y) + 0.8 + hub.distanceTo(end) * 0.12;
      const curve = new THREE.QuadraticBezierCurve3(hub, mid, end);
      const samples = curve.getPoints(64);
      const count = Math.max(1, Math.min(7, Math.round(1 + 6 * Math.sqrt((l.orderValue || 0) / (maxOrder || 1)))));
      return { id: l.id, samples, count, speed: 0.9 / Math.max(1.2, l.leadDays), reliability: l.leadSdDays / Math.max(0.5, l.leadDays) };
    });
  }, [locations, maxOrder]);
  const total = routes.reduce((a, r) => a + r.count, 0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((state) => {
    if (!inst.current) return;
    let k = 0;
    const t = state.clock.elapsedTime;
    for (const r of routes) {
      for (let i = 0; i < r.count; i += 1) {
        const u = motion ? (t * r.speed * 0.35 + i / r.count) % 1 : i / r.count;
        const f = u * 64;
        const a = r.samples[Math.floor(f)];
        const b = r.samples[Math.min(64, Math.floor(f) + 1)];
        dummy.position.lerpVectors(a, b, f - Math.floor(f));
        const s = 0.04 + 0.03 * Math.sin(u * Math.PI);
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        inst.current.setMatrixAt(k, dummy.matrix);
        k += 1;
      }
    }
    inst.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group>
      {routes.map((r) => (
        <Line
          key={r.id}
          points={r.samples}
          color={r.reliability > 0.35 ? '#e0aa3e' : '#4fd1c1'}
          lineWidth={selected === r.id ? 2.2 : 1}
          transparent
          opacity={selected && selected !== r.id ? 0.15 : 0.45}
          dashed={r.reliability > 0.35}
          dashSize={0.18}
          gapSize={0.12}
        />
      ))}
      <instancedMesh key={total} ref={inst} args={[null, null, total]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#f5e8c7" toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

const TARGET = [0.2, 0, -0.9];
const CAMERA_END = new THREE.Vector3(0.6, 12.2, 12.6);

function IntroCamera({ motion, controls }) {
  const { camera, size } = useThree();
  const t = useRef(motion ? 0 : 1);
  const start = useRef(null);
  const from = useMemo(() => new THREE.Vector3(0.6, 30, 2), []);
  // Narrow screens need the camera further back to fit the whole Northeast.
  const aspect = size.width / Math.max(1, size.height);
  const pull = aspect < 0.8 ? 1.6 : aspect < 1.3 ? 1.25 : 1;
  const end = useMemo(() => new THREE.Vector3(TARGET[0], 0, TARGET[2]).lerp(CAMERA_END, pull).setY(CAMERA_END.y * pull), [pull]);
  useEffect(() => {
    if (t.current >= 1) {
      camera.position.copy(end);
      camera.lookAt(...TARGET);
      controls.current?.update();
    }
  }, [end, camera, controls]);
  useFrame((state) => {
    if (t.current >= 1) return;
    if (start.current == null) start.current = state.clock.elapsedTime;
    t.current = Math.min(1, (state.clock.elapsedTime - start.current) / 2.4);
    const e = 1 - (1 - t.current) ** 4;
    camera.position.lerpVectors(from, end, e);
    camera.lookAt(...TARGET);
    if (controls.current) controls.current.update();
  });
  return null;
}

function usePrefersMotion() {
  const [ok, setOk] = useState(() => typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setOk(!m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return ok;
}

export default function NetworkScene({ locations, selected, onSelect, hovered, onHover }) {
  const motion = usePrefersMotion();
  const controls = useRef();
  const maxValue = Math.max(1, ...locations.map((l) => l.stockValue));
  const maxOrder = Math.max(1, ...locations.map((l) => l.orderValue));
  return (
    <Canvas
      camera={{ position: CAMERA_END.toArray(), fov: 36, near: 0.1, far: 120 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => onSelect(null)}
      aria-label="3D map of the Northeast distribution network"
    >
      <color attach="background" args={['#081820']} />
      <fog attach="fog" args={['#081820', 26, 60]} />
      <hemisphereLight args={['#d7f1ec', '#0a1d24', 0.85]} />
      <directionalLight position={[-6, 12, 6]} intensity={1.7} color="#fff1d6" />
      <directionalLight position={[8, 5, -6]} intensity={0.35} color="#7fc6ff" />
      <Terrain />
      <River points={BRAHMAPUTRA} radius={0.09} motion={motion} />
      <River points={BARAK} radius={0.06} motion={motion} />
      <Hub />
      <Routes locations={locations} selected={selected} maxOrder={maxOrder} motion={motion} />
      {locations.map((l) => (
        <Depot key={l.id} loc={l} selected={selected === l.id} hovered={hovered === l.id} onHover={onHover} onSelect={onSelect} maxValue={maxValue} motion={motion} />
      ))}
      <OrbitControls
        ref={controls}
        enablePan={false}
        minDistance={8}
        maxDistance={40}
        minPolarAngle={0.25}
        maxPolarAngle={1.15}
        target={TARGET}
        enableDamping
        dampingFactor={0.08}
      />
      <IntroCamera motion={motion} controls={controls} />
    </Canvas>
  );
}
