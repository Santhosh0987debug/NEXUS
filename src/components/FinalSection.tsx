import { Compass, Rocket, Route } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { scrollToTarget } from '../utils/scroll';

export default function FinalSection() {
  const reveal = useReveal<HTMLElement>();

  return (
    <section id="final" ref={reveal} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_110%,rgba(76,29,149,0.35),transparent_70%)]" />

      <div className="container-nx relative flex min-h-[92vh] flex-col items-center justify-center py-24 text-center">
        <p data-reveal="up" className="mono text-[0.62rem] tracking-[0.4em] text-white/40">
          END OF THE JOURNEY — BEGINNING OF YOURS
        </p>

        <h2 data-reveal="up" data-delay="0.1" className="display grad-text mt-8 text-[clamp(4rem,14vw,10rem)] uppercase">
          NEXUS
        </h2>

        <div data-reveal="up" data-delay="0.25" className="mt-6 space-y-1.5">
          <p className="text-xl font-light text-white/85 sm:text-2xl">Build the skills.</p>
          <p className="text-xl font-light text-white/85 sm:text-2xl">Build the projects.</p>
          <p className="accent-text text-xl font-semibold sm:text-2xl">Build your future.</p>
        </div>

        <div data-reveal="up" data-delay="0.4" className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => scrollToTarget('#careers')} className="btn-pill">
            <Compass size={14} /> Explore Careers
          </button>
          <button onClick={() => scrollToTarget('#projects')} className="btn-pill">
            <Rocket size={14} /> View Projects
          </button>
          <button onClick={() => scrollToTarget('#roadmap')} className="btn-pill btn-solid">
            <Route size={14} /> Start Your Roadmap
          </button>
        </div>

        <p data-reveal="up" data-delay="0.55" className="mono mt-16 text-[0.58rem] tracking-[0.3em] text-white/30">
          NEXUS © 2026 — REACT · TYPESCRIPT · THREE.JS · GSAP · TAILWIND
        </p>
      </div>
    </section>
  );
}