import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CAREERS, type Career } from '../../data/careers';
import { makeRadialTexture } from '../../utils/three';

const RADIUS = 3.6;

const POSITIONS: [number, number, number][] = CAREERS.map((_, i) => {
  const a = (i / CAREERS.length) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(a) * RADIUS, Math.sin(a) * 2.1 + 0.2, -Math.cos(a) * 1.9];
});

const EDGES: Array<[number, number]> = [];
for (let i = 0; i < CAREERS.length; i++) {
  EDGES.push([i, (i + 1) % CAREERS.length]);
  EDGES.push([i, (i + 2) % CAREERS.length]);
}

function Edge({
  ai,
  bi,
  hot,
  dim,
}: {
  ai: number;
  bi: number;
  hot: boolean;
  dim: boolean;
}) {
  const positions = useMemo(() => {
    const [ax, ay, az] = POSITIONS[ai];
    const [bx, by, bz] = POSITIONS[bi];
    return new Float32Array([ax, ay, az, bx, by, bz]);
  }, [ai, bi]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={hot ? '#a78bfa' : '#7c8db5'}
        transparent
        opacity={dim ? 0.06 : hot ? 0.85 : 0.28}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}

function Core() {
  const ref = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const material = useMemo(() => makeRadialTexture('#a78bfa'), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.25;
      const s = 1 + Math.sin(t * 2.2) * 0.12;
      ref.current.scale.setScalar(s);
    }
    if (glowRef.current) {
      const gs = 2.6 + Math.sin(t * 2.2) * 0.4;
      glowRef.current.scale.set(gs, gs, 1);
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[0.34, 1]} />
        <meshBasicMaterial color="#c4b5fd" wireframe />
      </mesh>
      <sprite ref={glowRef}>
        <spriteMaterial map={material} color="#ffffff" transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

type Emphasis = 'idle' | 'hot' | 'dim';

function CareerNode({
  career,
  position,
  index,
  emphasis,
  onHover,
  onSelect,
}: {
  career: Career;
  position: [number, number, number];
  index: number;
  emphasis: Emphasis;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
}) {
  const sphere = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Sprite>(null);
  const texture = useMemo(() => makeRadialTexture(career.color), [career.color]);

  const hot = emphasis === 'hot';
  const dim = emphasis === 'dim';

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 8);
    if (sphere.current) {
      const target = hot ? 1.55 : emphasis === 'idle' ? 1 : 1;
      sphere.current.scale.lerp(new THREE.Vector3(target, target, target), k);
    }
    if (halo.current) {
      halo.current.scale.setScalar(hot ? 1.4 : 0.6 + Math.sin(t * 1.6 + index) * 0.1);
      halo.current.rotation.z = t * 0.5;
    }
    if (glow.current) {
      const gs = (hot ? 2.4 : 1.7) + Math.sin(t * 1.8 + index) * 0.2;
      glow.current.scale.set(gs, gs, 1);
    }
  });

  const showLabel = hot || emphasis === 'dim';

  return (
    <group position={position}>
      <mesh
        ref={sphere}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(index);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(index);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.28, 28, 28]} />
        <meshBasicMaterial color={career.color} transparent opacity={dim ? 0.28 : 1} />
      </mesh>

      <mesh ref={halo} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[0.52, 0.008, 8, 64]} />
        <meshBasicMaterial
          color={hot ? '#ffffff' : career.color}
          transparent
          opacity={hot ? 0.9 : 0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <sprite ref={glow} scale={[1.7, 1.7, 1]}>
        <spriteMaterial map={texture} transparent opacity={dim ? 0.12 : 0.42} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      {showLabel && (
        <Html position={[0, -0.78, 0]} center zIndexRange={[30, 0]} pointerEvents="none">
          <div
            className="whitespace-nowrap rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] backdrop-blur-sm"
            style={{
              borderColor: hot ? career.color + '66' : 'rgba(255,255,255,0.14)',
              color: '#e7ecff',
              background: 'rgba(6,8,14,0.7)',
            }}
          >
            {career.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function CareerScene({
  activeIndex,
  hoverIndex,
  onHover,
  onSelect,
}: {
  activeIndex: number | null;
  hoverIndex: number | null;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.5, 6.6], fov: 52 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.7}
      />
      <Core />

      {EDGES.map(([ai, bi], i) => {
        const hot = hoverIndex === ai || hoverIndex === bi || activeIndex === ai || activeIndex === bi;
        const dim =
          activeIndex !== null && activeIndex !== ai && activeIndex !== bi;
        return <Edge key={i} ai={ai} bi={bi} hot={hot && !dim} dim={dim} />;
      })}

      {CAREERS.map((career, i) => {
        const emphasis: Emphasis =
          hoverIndex === i || (activeIndex === i && hoverIndex === null)
            ? 'hot'
            : activeIndex !== null || hoverIndex !== null
              ? 'dim'
              : 'idle';
        return (
          <CareerNode
            key={career.id}
            career={career}
            position={POSITIONS[i]}
            index={i}
            emphasis={emphasis}
            onHover={onHover}
            onSelect={onSelect}
          />
        );
      })}
    </Canvas>
  );
}