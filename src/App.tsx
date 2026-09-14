import { Suspense, useEffect } from 'react';
import React from 'react';
import Lenis from 'lenis';
import UniverseBackground from './components/scene/UniverseBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { initMouse } from './utils/mouse';
import Roadmap from './components/Roadmap';
import CareerAdvisor from './components/CareerAdvisor';
import FinalSection from './components/FinalSection';
import { gsap, ScrollTrigger } from './utils/gsap';
import { setLenis } from './utils/scroll';

const LazyCareer = React.lazy(() => import('./components/CareerUniverse'));
const LazySkills = React.lazy(() => import('./components/SkillConstellation'));
const LazyProjects = React.lazy(() => import('./components/ProjectGalaxy'));

function SectionFallback({ label }: { label: string }) {
  return (
    <div className="section-shell relative flex min-h-[60vh] items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.07),transparent_65%)]" />
      <div className="mono text-[0.62rem] tracking-[0.4em] text-white/20">{label}</div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initMouse();

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);
    window.addEventListener('load', refresh);

    let lenis: Lenis | null = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);

      return () => {
        window.clearTimeout(t);
        window.removeEventListener('load', refresh);
        gsap.ticker.remove(tick);
        lenis!.destroy();
        setLenis(null);
      };
    }

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('load', refresh);
      setLenis(null);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="overlay-grid" />
      <div className="overlay-noise" />
      <div className="overlay-vignette" />
      <UniverseBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Suspense fallback={<SectionFallback label="LOADING CAREER UNIVERSE…" />}>
          <LazyCareer />
        </Suspense>
        <Suspense fallback={<SectionFallback label="LOADING CONSTELLATION…" />}>
          <LazySkills />
        </Suspense>
        <Roadmap />
        <Suspense fallback={<SectionFallback label="LOADING GALAXY…" />}>
          <LazyProjects />
        </Suspense>
        <CareerAdvisor />
        <FinalSection />
      </main>
    </div>
  );
}