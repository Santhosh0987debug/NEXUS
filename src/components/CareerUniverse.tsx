import { useState } from 'react';
import { ArrowUpRight, Orbit, Radar, X } from 'lucide-react';
import CareerScene from './scene/CareerScene';
import CanvasSection from './scene/CanvasSection';
import { CAREERS } from '../data/careers';
import { useReveal } from '../hooks/useReveal';

export default function CareerUniverse() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const reveal = useReveal<HTMLElement>();

  const active = activeIndex !== null ? CAREERS[activeIndex] : null;
  const hovered = hoverIndex !== null ? CAREERS[hoverIndex] : null;

  return (
    <section id="careers" ref={reveal} className="section-shell relative">
      <div className="container-nx">
        <div data-reveal="up">
          <p className="eyebrow">01 — Career Universe</p>
          <h2 className="display mt-5 max-w-3xl text-4xl text-white sm:text-5xl md:text-6xl">
            Six orbits. <span className="grad-text">One direction.</span>
          </h2>
          <p className="text-muted mt-5 max-w-xl text-sm leading-relaxed md:text-base">
            Every career path is a gravitational field of skills. Hover to scan an orbit, click to
            dock and inspect what each path demands.
          </p>
        </div>
      </div>

      <div className="container-nx mt-8 md:mt-12">
        <div className="flex flex-col gap-5 md:h-[76vh] md:flex-row md:gap-8">
          <div className="relative h-[58vh] overflow-hidden rounded-2xl border border-white/[0.07] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.08),transparent_70%)] md:flex-1 md:h-auto">
            <CanvasSection className="absolute inset-0">
              <CareerScene
                activeIndex={activeIndex}
                hoverIndex={hoverIndex}
                onHover={setHoverIndex}
                onSelect={setActiveIndex}
              />
            </CanvasSection>

            <div className="mono pointer-events-none absolute left-4 top-4 flex flex-col gap-1 text-[0.6rem] tracking-[0.28em] text-white/30">
              <span className="flex items-center gap-2">
                <Orbit size={11} /> HOVER TO SCAN
              </span>
              <span className="flex items-center gap-2">
                <Radar size={11} /> CLICK TO DOCK
              </span>
            </div>

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="max-w-sm">
                {hovered && activeIndex === null ? (
                  <div className="glass-card animate-floaty px-4 py-3">
                    <div className="mono text-[0.6rem] tracking-[0.3em]" style={{ color: hovered.color }}>
                      {hovered.code} · {hovered.band}
                    </div>
                    <div className="mt-1 font-display text-lg text-white">{hovered.name}</div>
                    <div className="mt-0.5 text-xs text-white/50">{hovered.tagline}</div>
                  </div>
                ) : active ? (
                  <div className="mono text-[0.6rem] tracking-[0.3em]" style={{ color: active.color }}>
                    ▲ ORBIT DOCKED
                  </div>
                ) : (
                  <div className="text-[0.62rem] leading-relaxed text-white/35">
                    {activeIndex === null
                      ? 'Awaiting contact with the career field…'
                      : '-'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="md:w-[22rem]">
            {active ? (
              <div className="glass-card relative overflow-hidden p-6 md:sticky md:top-24">
                <div
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
                  style={{ background: active.color + '26' }}
                />
                <button
                  onClick={() => setActiveIndex(null)}
                  className="absolute right-4 top-4 rounded-full border border-white/10 p-1.5 text-white/60 transition hover:border-white/30 hover:text-white"
                  aria-label="Close career panel"
                >
                  <X size={14} />
                </button>

                <div className="mono text-[0.6rem] tracking-[0.3em]" style={{ color: active.color }}>
                  {active.code} · {active.band}
                </div>
                <h3 className="display mt-2 text-2xl text-white">{active.name}</h3>
                <p className="mt-1 text-sm italic text-white/60">{active.tagline}</p>
                <p className="text-muted mt-4 text-sm leading-relaxed">{active.description}</p>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[0.62rem] tracking-[0.26em] text-white/45">
                      GROWTH SIGNAL
                    </span>
                    <span className="mono text-[0.62rem] text-white/60">{active.demand}%</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${active.demand}%`,
                        background: `linear-gradient(90deg, ${active.color}, #a78bfa)`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mono text-[0.62rem] tracking-[0.26em] text-white/45">CORE SKILLS</div>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {active.coreSkills.map((s) => (
                      <span
                        key={s}
                        className="chip on"
                        style={{ borderColor: active.color + '55' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mono text-[0.62rem] tracking-[0.26em] text-white/45">
                    RECOMMENDED NEXT SKILLS
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {active.nextSkills.map((s) => (
                      <span key={s} className="chip">
                        <ArrowUpRight size={11} /> {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mono text-[0.62rem] tracking-[0.26em] text-white/45">
                    TYPICAL PROJECTS
                  </div>
                  <ul className="mt-2.5 space-y-2">
                    {active.typicalProjects.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: active.color }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="glass-card flex h-full flex-col items-start justify-center gap-4 p-6 md:sticky md:top-24">
                <div className="mono text-[0.62rem] tracking-[0.3em] text-white/40">ORBIT CONTROL</div>
                <div className="display text-2xl text-white">Dock a career</div>
                <p className="text-muted text-sm leading-relaxed">
                  Hover the glowing spheres to scan each path. Click to open its full skill map,
                  projects and growth signal.
                </p>
                <div className="mt-1 flex gap-2">
                  {CAREERS.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveIndex(i)}
                      className="h-2.5 w-2.5 rounded-full transition hover:scale-125"
                      style={{ background: activeIndex === i ? c.color : c.color + '44' }}
                      aria-label={`Inspect ${c.name}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}