import { useLayoutEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import HeroScene from './scene/HeroScene';
import { gsap, ScrollTrigger } from '../utils/gsap';

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        '[data-hero]',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.13 },
        0.25,
      );
      if (sceneRef.current) {
        gsap.fromTo(
          sceneRef.current,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' },
        );
      }

      gsap.to(sceneRef.current, {
        opacity: 0.22,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '70% top',
          scrub: true,
        },
      });

      gsap.to('[data-hero-overlay]', {
        yPercent: -26,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '65% top',
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section id="home" ref={root} className="relative flex h-[100svh] min-h-[620px] items-center justify-center overflow-hidden">
      <div ref={sceneRef} className="absolute inset-0">
        <HeroScene />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(5,6,10,0.35),transparent_70%)]" />

      <div
        data-hero-overlay
        className="pointer-events-none relative z-10 px-6 text-center"
      >
        <p data-hero className="mono mx-auto flex items-center gap-4 text-[0.62rem] tracking-[0.42em] text-white/45">
          <span className="hidden h-px w-10 bg-white/20 sm:block" />
          INTERACTIVE AI CAREER &amp; SKILL EXPLORER
          <span className="hidden h-px w-10 bg-white/20 sm:block" />
        </p>

        <h1 className="display grad-text mt-6 select-none text-[clamp(4.5rem,17vw,13rem)] uppercase">
          NEXUS
        </h1>

        <p data-hero className="mt-3 text-lg font-light text-white/75 sm:text-2xl">
          Your future is <span className="accent-text font-normal">built</span>, not predicted.
        </p>

        <div data-hero className="mx-auto mt-12 flex max-w-md items-center justify-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-violet-500/40" />
          <span className="mono text-[0.58rem] tracking-[0.34em] text-violet-300/80">
            SCROLL TO ENTER
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-violet-500/40" />
        </div>
      </div>

      <div data-hero className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-floaty text-white/50">
        <ChevronDown size={18} />
      </div>

      <div data-hero className="mono pointer-events-none absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 rotate-180 text-[0.56rem] tracking-[0.4em] text-white/25 [writing-mode:vertical-rl] lg:block">
        30.16°N — 77.95°E — STATION NEXUS
      </div>
      <div data-hero className="mono pointer-events-none absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 text-[0.56rem] tracking-[0.4em] text-white/25 [writing-mode:vertical-rl] lg:block">
        v1.0 — ORBIT ONLINE
      </div>
    </section>
  );
}