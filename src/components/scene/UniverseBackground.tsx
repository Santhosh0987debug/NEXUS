import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useIsMobile from '../../hooks/useIsMobile';
import { mouse } from '../../utils/mouse';
import { makeRadialTexture } from '../../utils/three';

function Starfield({ count, texture }: { count: number; texture: THREE.Texture }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 46;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40 - 6;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.007;
    ref.current.position.y = (window.scrollY / window.innerHeight) * 1.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        color="#c4d4ff"
        size={0.14}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Nebula({
  position,
  color,
  scale,
  texture,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  texture: THREE.Texture;
}) {
  const mat = useMemo(
    () => new THREE.SpriteMaterial({ map: texture, color, transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending }),
    [texture, color],
  );
  return (
    <sprite position={position} scale={[scale, scale, 1]} material={mat} />
  );
}

function Rig() {
  const smooth = useRef({ x: 0, y: 0 });
  useFrame((state, dt) => {
    const k = 1 - Math.pow(0.0015, dt);
    smooth.current.x += (mouse.x - smooth.current.x) * k;
    smooth.current.y += (mouse.y - smooth.current.y) * k;
    const camera = state.camera;
    camera.position.x += (smooth.current.x * 1.3 - camera.position.x) * k;
    camera.position.y += (smooth.current.y * 0.8 - camera.position.y) * k;
    camera.lookAt(smooth.current.x * 0.25, smooth.current.y * 0.15, 0);
  });
  return null;
}

export default function UniverseBackground() {
  const isMobile = useIsMobile();
  const count = isMobile ? 520 : 1700;
  const glow = useMemo(() => makeRadialTexture('#ffffff'), []);
  const purple = useMemo(() => makeRadialTexture('#8b5cf6'), []);
  const cyan = useMemo(() => makeRadialTexture('#22d3ee'), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1 : 1.5]}
        camera={{ position: [0, 0, 13], fov: 55 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Starfield count={count} texture={glow} />
          <Nebula position={[-16, 9, -18]} color="#6d28d9" scale={34} texture={purple} />
          <Nebula position={[18, -8, -22]} color="#1d4ed8" scale={30} texture={cyan} />
          <Nebula position={[6, 16, -26]} color="#0e7490" scale={26} texture={glow} />
          <Rig />
        </Suspense>
      </Canvas>
    </div>
  );
}