import { useState } from 'react';
import { ArrowUpRight, Github, Rocket, X } from 'lucide-react';
import ProjectScene from './scene/ProjectScene';
import CanvasSection from './scene/CanvasSection';
import { PROJECTS, type ProjectStatus } from '../data/projects';
import { useReveal } from '../hooks/useReveal';

const STATUS_STYLE: Record<ProjectStatus, { color: string; bg: string }> = {
  LIVE: { color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  DEMO: { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
  'IN PROGRESS': { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  ARCHIVE: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

export default function ProjectGalaxy() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const reveal = useReveal<HTMLElement>();

  const project = PROJECTS.find((p) => p.id === selectedId) ?? null;
  const hovered = PROJECTS.find((p) => p.id === hoverId) ?? null;

  return (
    <section id="projects" ref={reveal} className="section-shell relative">
      <div className="container-nx">
        <div data-reveal="up">
          <p className="eyebrow">04 — Project Galaxy</p>
          <h2 className="display mt-5 max-w-3xl text-4xl text-white sm:text-5xl md:text-6xl">
            Every project is a <span className="grad-text">planet you built.</span>
          </h2>
          <p className="text-muted mt-5 max-w-xl text-sm leading-relaxed md:text-base">
            A proof-of-work system with its own gravity. Click a planet to inspect what was built,
            with which tools, and what it proves about you.
          </p>
        </div>
      </div>

      <div className="container-nx mt-8 md:mt-12">
        <div className="flex flex-col gap-5 md:h-[76vh] md:flex-row md:gap-8">
          <div className="relative h-[58vh] overflow-hidden rounded-2xl border border-white/[0.07] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.07),transparent_70%)] md:flex-1 md:h-auto">
            <CanvasSection className="absolute inset-0">
              <ProjectScene
                selectedId={selectedId}
                hoverId={hoverId}
                onHover={setHoverId}
                onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
              />
            </CanvasSection>

            <div className="mono pointer-events-none absolute left-4 top-4 text-[0.6rem] tracking-[0.28em] text-white/30">
              {hovered ? `TRACKING — ${hovered.title.toUpperCase()}` : 'DRAG TO ORBIT · CLICK A PLANET'}
            </div>
          </div>

          <aside className="md:w-[22rem]">
            {project ? (
              <div className="glass-card relative overflow-hidden p-6 md:sticky md:top-24">
                <div
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
                  style={{ background: project.color + '26' }}
                />
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute right-4 top-4 rounded-full border border-white/10 p-1.5 text-white/60 transition hover:border-white/30 hover:text-white"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>

                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.58rem] uppercase tracking-[0.2em]"
                  style={{
                    color: STATUS_STYLE[project.status].color,
                    borderColor: STATUS_STYLE[project.status].color + '44',
                    background: STATUS_STYLE[project.status].bg,
                  }}
                >
                  <span
                    className="h-1 w-1 rounded-full"
                    style={{ background: STATUS_STYLE[project.status].color }}
                  />
                  {project.status}
                </span>

                <h3 className="display mt-3 text-2xl text-white">{project.title}</h3>
                <p className="mt-1 text-sm italic text-white/60">{project.tagline}</p>
                <p className="text-muted mt-4 text-sm leading-relaxed">{project.description}</p>

                <div className="mt-5">
                  <div className="mono text-[0.58rem] tracking-[0.26em] text-white/45">TECHNOLOGY</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="chip on"
                        style={{ borderColor: project.color + '44' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mono text-[0.58rem] tracking-[0.26em] text-white/45">SKILLS PROVEN</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.skills.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-2.5">
                  <a
                    href={project.gh}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-pill flex-1"
                  >
                    <Github size={14} /> GitHub
                  </a>
                  <a href={project.demo} className="btn-pill btn-solid flex-1">
                    <Rocket size={14} /> Demo
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass-card flex h-full flex-col justify-center gap-4 p-6 md:sticky md:top-24">
                <div className="mono text-[0.62rem] tracking-[0.3em] text-white/40">GALAXY CATALOG</div>
                <ul className="space-y-1.5">
                  {PROJECTS.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => setSelectedId(p.id)}
                        className="group flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-2.5 py-2 text-left transition hover:border-white/10 hover:bg-white/[0.03]"
                      >
                        <span className="flex items-center gap-2.5 text-sm text-white/75">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: p.color }}
                          />
                          {p.title}
                        </span>
                        <ArrowUpRight
                          size={13}
                          className="text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white/70"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="text-muted text-xs leading-relaxed">
                  Hover one in the 3D field for a closer look. Click a planet — or its name here —
                  to open the full mission briefing.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}