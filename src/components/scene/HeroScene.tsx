import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useIsMobile from '../../hooks/useIsMobile';
import { mouse } from '../../utils/mouse';
import { mulberry32, makeRadialTexture } from '../../utils/three';

interface ClusterDef {
  base: [number, number, number];
  color: string;
  count: number;
  radius: number;
}

const CLUSTERS: ClusterDef[] = [
  { base: [4.2, 1.0, -0.6], color: '#8b5cf6', count: 90, radius: 1.05 },
  { base: [-4.0, 1.7, 0.5], color: '#2563eb', count: 82, radius: 1.0 },
  { base: [0.7, -3.7, 1.3], color: '#06b6d4', count: 72, radius: 0.95 },
  { base: [-2.9, -2.4, -1.0], color: '#a855f7', count: 80, radius: 1.02 },
  { base: [3.5, -1.9, 1.4], color: '#38bdf8', count: 62, radius: 0.9 },
];

function Cluster({
  def,
  texture,
  mouseLocal,
  root,
}: {
  def: ClusterDef;
  texture: THREE.Texture;
  mouseLocal: React.MutableRefObject<THREE.Vector3>;
  root: React.MutableRefObject<THREE.Group | null>;
}) {
  const group = useRef<THREE.Group>(null);
  const origin = useMemo(() => new THREE.Vector3(), []);

  const positions = useMemo(() => {
    const rnd = mulberry32(def.count + 17);
    const arr = new Float32Array(def.count * 3);
    for (let i = 0; i < def.count; i++) {
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      const rad = Math.pow(rnd(), 0.45) * def.radius;
      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * rad;
      arr[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * rad;
      arr[i * 3 + 2] = Math.cos(phi) * rad * 0.7;
    }
    return arr;
  }, [def]);

  const base = useMemo(() => new THREE.Vector3(...def.base), [def.base]);

  useFrame((_, dt) => {
    if (!group.current || !root.current) return;
    const p = mouseLocal.current;
    const delta = p.clone().sub(base);
    const dist = delta.length();
    const radius = def.radius * 2.4;
    if (dist < radius && dist > 0.0001) {
      const push = (1 - dist / radius) * 1.35;
      const dir = delta.clone().normalize();
      group.current.position.set(-dir.x * push, -dir.y * push, -dir.z * push);
    } else {
      group.current.position.lerp(origin, Math.min(1, dt * 2.4));
    }
  });

  return (
    <group ref={group} position={def.base}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={texture}
          color={def.color}
          size={0.16}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.12;
    ref.current.rotation.y = t * 0.18;
    const s = 1 + Math.sin(t * 0.9) * 0.06;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.55, 1]} />
      <meshBasicMaterial color="#8ea7ff" wireframe transparent opacity={0.28} />
    </mesh>
  );
}

function OrbitRing({ radius, tilt, speed, color }: { radius: number; tilt: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, tilt * 0.6, 0]}>
      <torusGeometry args={[radius, 0.0045, 8, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function HeroRig({
  mouseLocal,
  root,
  reduced,
}: {
  mouseLocal: React.MutableRefObject<THREE.Vector3>;
  root: React.MutableRefObject<THREE.Group | null>;
  reduced: boolean;
}) {
  const smooth = useRef({ x: 0, y: 0 });
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (root.current) {
      const intro = THREE.MathUtils.smoothstep(t, 0.15, 1.5);
      const s = intro * (1 + Math.sin(t * 0.7) * 0.02);
      root.current.scale.setScalar(s);
      root.current.rotation.z = t * 0.035;
      root.current.rotation.y = t * 0.055;
    }

    if (reduced) return;
    const k = 1 - Math.pow(0.001, dt);
    smooth.current.x += (mouse.x - smooth.current.x) * k;
    smooth.current.y += (mouse.y - smooth.current.y) * k;
    const camera = state.camera;
    camera.position.x += (smooth.current.x * 1.1 - camera.position.x) * k;
    camera.position.y += (smooth.current.y * 0.6 - camera.position.y) * k;
    camera.position.z = 7;
    camera.lookAt(0, 0, 0);

    const ray = new THREE.Raycaster();
    ray.setFromCamera(state.pointer, state.camera);
    const v = new THREE.Vector3();
    ray.ray.at(-ray.ray.origin.z / ray.ray.direction.z, v);
    if (root.current) root.current.worldToLocal(v);
    mouseLocal.current.lerp(v, Math.min(1, dt * 5));
  });
  return null;
}

export default function HeroScene() {
  const isMobile = useIsMobile();
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const texture = useMemo(() => makeRadialTexture('#ffffff'), []);
  const mouseLocal = useRef(new THREE.Vector3(99, 99, 99));
  const root = useRef<THREE.Group>(null);
  const clusters = useMemo(() => (isMobile ? CLUSTERS.slice(0, 3) : CLUSTERS), [isMobile]);

  return (
    <Canvas
      dpr={[1, isMobile ? 1 : 1.5]}
      camera={{ position: [0, 0, 7], fov: 60 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <group ref={root}>
          <Core />
          <OrbitRing radius={3.4} tilt={0.5} speed={0.14} color="#7c3aed" />
          <OrbitRing radius={4.6} tilt={1.2} speed={0.09} color="#3b82f6" />
          <OrbitRing radius={5.6} tilt={0.85} speed={0.06} color="#0891b2" />
          {clusters.map((c, i) => (
            <Cluster key={i} def={c} texture={texture} mouseLocal={mouseLocal} root={root} />
          ))}
        </group>
        <HeroRig mouseLocal={mouseLocal} root={root} reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}