import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CATEGORY_COLOR, EDGES, SKILLS, type SkillNode } from '../../data/skills';
import { makeRadialTexture } from '../../utils/three';

type Emphasis = 'idle' | 'hot' | 'dim';

function SkillEdge({
  from,
  to,
  primary,
  hot,
}: {
  from: [number, number, number];
  to: [number, number, number];
  primary?: boolean;
  hot: boolean;
}) {
  const positions = useMemo(() => {
    return new Float32Array([...from, ...to]);
  }, [from, to]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={primary ? '#a78bfa' : '#5b6b8d'}
        transparent
        opacity={hot ? 0.95 : primary ? 0.55 : 0.28}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}

function SkillNode3D({
  skill,
  emphasis,
  learned,
  onHover,
  onSelect,
}: {
  skill: SkillNode;
  emphasis: Emphasis;
  learned: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const sphere = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => makeRadialTexture(CATEGORY_COLOR[skill.category]), [skill.category]);
  const color = CATEGORY_COLOR[skill.category];
  const hot = emphasis === 'hot';
  const dim = emphasis === 'dim';

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 8);
    if (sphere.current) {
      const target = hot ? 1.5 : 1;
      sphere.current.scale.lerp(new THREE.Vector3(target, target, target), k);
    }
    if (halo.current) {
      halo.current.scale.setScalar(hot || learned ? 1.5 : 0.5 + Math.sin(t * 1.4) * 0.1);
      halo.current.rotation.z = t * 0.6;
    }
  });

  const showLabel = hot || learned;

  return (
    <group position={skill.position}>
      <mesh
        ref={sphere}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(skill.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(skill.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.19, 24, 24]} />
        <meshBasicMaterial
          color={learned ? '#cfe0ff' : color}
          transparent
          opacity={dim && !learned ? 0.2 : 0.95}
        />
      </mesh>

      <mesh ref={halo} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[0.34, 0.007, 8, 48]} />
        <meshBasicMaterial
          color={learned ? '#ffffff' : color}
          transparent
          opacity={hot ? 0.9 : learned ? 0.75 : 0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {learned && !hot && (
        <sprite scale={[0.9, 0.9, 1]}>
          <spriteMaterial map={texture} transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      )}

      {showLabel && (
        <Html position={[0, -0.48, 0]} center zIndexRange={[30, 0]} pointerEvents="none">
          <div
            className="whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.58rem] uppercase tracking-[0.2em] backdrop-blur-sm"
            style={{
              borderColor: learned ? 'rgba(255,255,255,0.35)' : color + '66',
              color: '#e7ecff',
              background: 'rgba(6,8,14,0.72)',
            }}
          >
            {learned ? '✓ ' : ''}
            {skill.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function SkillScene({
  selectedId,
  hoverId,
  learned,
  onHover,
  onSelect,
}: {
  selectedId: string | null;
  hoverId: string | null;
  learned: string[];
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.4, 11], fov: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={0.45}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.6}
      />

      {EDGES.map((edge, i) => {
        const from = SKILLS.find((s) => s.id === edge.from);
        const to = SKILLS.find((s) => s.id === edge.to);
        if (!from || !to) return null;
        const hot =
          (selectedId !== null && (edge.from === selectedId || edge.to === selectedId)) ||
          hoverId === edge.from ||
          hoverId === edge.to;
        return (
          <SkillEdge
            key={i}
            from={from.position}
            to={to.position}
            primary={edge.primary}
            hot={hot}
          />
        );
      })}

      {SKILLS.map((skill) => {
        const isLearned = learned.includes(skill.id);
        let emphasis: Emphasis = 'idle';
        if (selectedId === skill.id || hoverId === skill.id) emphasis = 'hot';
        else if (selectedId !== null || hoverId !== null) emphasis = 'dim';

        return (
          <SkillNode3D
            key={skill.id}
            skill={skill}
            emphasis={emphasis}
            learned={isLearned}
            onHover={onHover}
            onSelect={onSelect}
          />
        );
      })}
    </Canvas>
  );
}