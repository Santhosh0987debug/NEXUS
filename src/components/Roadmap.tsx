import { useEffect, useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { gsap } from '../utils/gsap';

const STAGES = [
  {
    title: 'FOUNDATION',
    lines: [
      'Learn the languages of the machine.',
      'HTML, CSS & JavaScript fundamentals.',
      'Git & GitHub workflow.',
      'Build five small projects from scratch.',
    ],
  },
  {
    title: 'CORE DEVELOPMENT',
    lines: [
      'Go deeper than tutorials.',
      'Tailwind, React and component design.',
      'TypeScript and clean-code discipline.',
      'APIs, databases and dev-tool fluency.',
    ],
  },
  {
    title: 'SPECIALIZATION',
    lines: [
      'Choose your lane.',
      'Pick one career orbit from the map.',
      'Master its core stack deliberately.',
      'Build a small expert-level prototype.',
    ],
  },
  {
    title: 'REAL PROJECTS',
    lines: [
      'Ship things people can actually use.',
      'Build 2–3 portfolio-quality projects.',
      'Document, deploy, and present them.',
      'Write READMEs, record short demos.',
    ],
  },
  {
    title: 'INTERNSHIP',
    lines: [
      'Work inside a real team.',
      'Contribute to open source meaningfully.',
      'Ask for code reviews and ship fixes.',
      'Apply to 20+ targeted opportunities.',
    ],
  },
  {
    title: 'PLACEMENT',
    lines: [
      'Turn skills into opportunity.',
      'Polish your resume, GitHub and LinkedIn.',
      'Run mock interviews weekly.',
      'Apply, interview, negotiate with confidence.',
    ],
  },
];

function PinnedRoadmap() {
  const pinRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinRef.current || !fillRef.current || !stageContainerRef.current || !orbRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const stageEls = Array.from(stageContainerRef.current.children) as HTMLElement[];
    const ctx = gsap.context(() => {
      gsap.set(stageEls, { opacity: 0, y: 44, scale: 0.94 });
      gsap.set(fillRef.current!, { scaleY: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current!,
          start: 'top top',
          end: '+=4800',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(fillRef.current!, { scaleY: 1, ease: 'none', duration: STAGES.length }, 0);
      tl.to(orbRef.current!, { top: '92%', duration: STAGES.length }, 0);

      stageEls.forEach((s, i) => {
        const start = i * 1;
        tl.to(s, { autoAlpha: 1, y: 0, scale: 1, duration: 1.1 }, start);
        if (i > 0) {
          tl.to(stageEls[i - 1], { autoAlpha: 0.12, y: -28, scale: 0.96, duration: 0.85 }, start + 0.25);
        }
      });
    }, pinRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pinRef} className="relative h-[480vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-4xl px-6">
          <div className="pointer-events-none absolute left-4 top-0 bottom-0 w-px bg-white/[0.08] md:left-1/2 md:-translate-x-1/2">
            <div
              ref={fillRef}
              className="absolute left-0 top-0 h-full w-full origin-top"
              style={{ background: 'linear-gradient(180deg, #7c3aed, #3b82f6 50%, #22d3ee)' }}
            />
            <div
              ref={orbRef}
              className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_22px_rgba(124,58,237,0.8)]"
              style={{ top: '4%' }}
            />
          </div>

          <div ref={stageContainerRef} className="relative z-10 grid gap-16 md:gap-24 py-24">
            {STAGES.map((s, i) => (
              <div
                key={s.title}
                className={`relative md:grid md:grid-cols-2 md:gap-16 ${
                  i % 2 === 0 ? '' : 'md:[direction:rtl]'
                }`}
              >
                <div className={`${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="mono text-[0.68rem] tracking-[0.3em] text-white/25">
                    0{i + 1}
                  </div>
                  <h3 className="display mt-1 text-3xl text-white sm:text-4xl md:text-5xl">
                    {s.title}
                  </h3>
                </div>
                <div className="mt-4 space-y-2.5 md:mt-0 md:[direction:ltr]">
                  {s.lines.map((line, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-3 text-sm leading-relaxed text-white/70"
                    >
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                        style={{
                          background: j === 0 ? '#a78bfa' : 'rgba(255,255,255,0.25)',
                        }}
                      />
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.26em] text-white/20">
            6 STAGES · 22 ACTIONS · 1 PATH
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Roadmap() {
  const reveal = useReveal<HTMLElement>();

  return (
    <section id="roadmap" ref={reveal} className="relative pt-16">
      <div className="container-nx mb-8 md:mb-14" data-reveal="up">
        <p className="eyebrow">03 — Career Roadmap</p>
        <h2 className="display mt-5 max-w-3xl text-4xl text-white sm:text-5xl md:text-6xl">
          From curiosity to <span className="grad-text">placement</span>.
        </h2>
        <p className="text-muted mt-5 max-w-xl text-sm leading-relaxed md:text-base">
          A cinematic, zero-fluff path. Each phase has exactly what matters — no filler, no dead
          time.
        </p>
      </div>
      <PinnedRoadmap />
    </section>
  );
}