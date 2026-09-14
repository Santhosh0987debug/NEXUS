import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { PROJECTS, type Project } from '../../data/projects';
import { makeRadialTexture } from '../../utils/three';

function Star() {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const texture = useMemo(() => makeRadialTexture('#a78bfa'), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) ref.current.rotation.y = t * 0.2;
    if (glowRef.current) {
      const s = 2.8 + Math.sin(t * 1.6) * 0.35;
      glowRef.current.scale.set(s, s, 1);
    }
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.45, 28, 28]} />
        <meshBasicMaterial color="#e0d4ff" />
      </mesh>
      <sprite ref={glowRef} scale={[2.8, 2.8, 1]}>
        <spriteMaterial map={texture} color="#ffffff" transparent opacity={0.52} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

function Planet({
  project,
  active,
  hovered,
  onHover,
  onSelect,
}: {
  project: Project;
  active: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const sphere = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const glowTexture = useMemo(() => makeRadialTexture(project.color), [project.color]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = t * project.speed;
    if (group.current) {
      group.current.position.set(
        Math.cos(angle) * project.orbit,
        Math.sin(angle * 0.65) * 0.35,
        Math.sin(angle) * project.orbit,
      );
    }
    const targetScale = active ? 1.6 : hovered ? 1.3 : 1;
    if (sphere.current) sphere.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    if (halo.current) {
      const s = (active ? 1.6 : 1) + Math.sin(t * 2) * 0.12;
      halo.current.scale.set(s, s, 1);
      halo.current.rotation.z = t * 0.6;
    }
    if (ring.current) {
      ring.current.rotation.x = 1.55;
      ring.current.rotation.y = t * 0.3;
      const rs = active ? 1.25 : 1;
      ring.current.scale.lerp(new THREE.Vector3(rs, rs, rs), 0.08);
    }
  });

  const showLabel = active || hovered;

  return (
    <group ref={group}>
      <mesh
        ref={sphere}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(project.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[project.size, 24, 24]} />
        <meshBasicMaterial color={project.color} transparent opacity={active ? 1 : 0.75} />
      </mesh>

      {project.ring && (
        <mesh ref={ring} rotation={[1.55, 0, 0]}>
          <torusGeometry args={[project.size * 1.7, 0.018, 10, 48]} />
          <meshBasicMaterial
            color={active ? '#ffffff' : project.color}
            transparent
            opacity={active ? 0.85 : 0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      <mesh ref={halo} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[project.size * 1.3, 0.008, 8, 48]} />
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={active ? 0.9 : 0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <sprite scale={[1.2, 1.2, 1]}>
        <spriteMaterial map={glowTexture} transparent opacity={active ? 0.55 : 0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      {showLabel && (
        <Html position={[0, project.size + 0.28, 0]} center zIndexRange={[30, 0]} pointerEvents="none">
          <div className="whitespace-nowrap rounded-full border border-white/10 bg-black/60 px-2.5 py-0.5 text-[0.56rem] uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
            {project.title}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function ProjectScene({
  selectedId,
  hoverId,
  onHover,
  onSelect,
}: {
  selectedId: string | null;
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.8, 9], fov: 52 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.8}
      />
      <Star />
      {PROJECTS.map((p) => (
        <Planet
          key={p.id}
          project={p}
          active={selectedId === p.id}
          hovered={hoverId === p.id}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </Canvas>
  );
}