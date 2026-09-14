import { useState, useMemo } from 'react';
import { BookOpen, CheckCircle2, X, Zap } from 'lucide-react';
import SkillScene from './scene/SkillScene';
import CanvasSection from './scene/CanvasSection';
import { CATEGORY_COLOR, EDGES, SKILL_MAP, SPINE_PATH, tierFor } from '../data/skills';
import { useReveal } from '../hooks/useReveal';

export default function SkillConstellation() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [learned, setLearned] = useState<string[]>([]);
  const reveal = useReveal<HTMLElement>();

  const selected = selectedId ? SKILL_MAP[selectedId] : null;
  const hovered = hoverId ? SKILL_MAP[hoverId] : null;
  const active = selected ?? hovered;

  const knownSet = useMemo(() => new Set(learned), [learned]);
  const spineCount = SPINE_PATH.filter((id) => knownSet.has(id)).length;
  const tier = tierFor(spineCount);

  const dependents = useMemo(() => {
    if (!selectedId) return [];
    return EDGES.filter((e) => e.from === selectedId).map((e) => SKILL_MAP[e.to]).filter(Boolean);
  }, [selectedId]);

  const prerequisites = useMemo(() => {
    if (!selectedId) return [];
    const skill = SKILL_MAP[selectedId];
    if (!skill) return [];
    return skill.prereqs.map((id) => SKILL_MAP[id]).filter(Boolean);
  }, [selectedId]);

  const toggleLearned = (id: string) => {
    setLearned((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <section id="skills" ref={reveal} className="section-shell relative">
      <div className="container-nx">
        <div data-reveal="up">
          <p className="eyebrow">02 — Skill Constellation</p>
          <h2 className="display mt-5 max-w-3xl text-4xl text-white sm:text-5xl md:text-6xl">
            Skills are not lists.{' '}
            <span className="grad-text">They are relationships.</span>
          </h2>
          <p className="text-muted mt-5 max-w-xl text-sm leading-relaxed md:text-base">
            Each node unlocks the next. Click a node to learn what it demands, and mark skills you
            already know to compute your personal level.
          </p>
        </div>
      </div>

      <div className="container-nx mt-8 md:mt-12">
        <div className="flex flex-col gap-5 md:h-[76vh] md:flex-row md:gap-8">
          <div className="relative h-[58vh] overflow-hidden rounded-2xl border border-white/[0.07] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent_70%)] md:flex-1 md:h-auto">
            <CanvasSection className="absolute inset-0">
              <SkillScene
                selectedId={selectedId}
                hoverId={hoverId}
                learned={learned}
                onHover={setHoverId}
                onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
              />
            </CanvasSection>

            <div className="glass-card pointer-events-auto absolute left-4 top-4 flex flex-col items-center gap-2 p-3 text-center">
              <div className="text-[0.56rem] uppercase tracking-[0.22em] text-white/45">YOUR LEVEL</div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-500/40 bg-violet-950/40 font-mono text-xs text-violet-300">
                {spineCount}
              </div>
              <div className="text-[0.52rem] font-semibold uppercase tracking-[0.22em] text-violet-300">
                {tier}
              </div>
              <div className="flex gap-0.5">
                {SPINE_PATH.map((id) => (
                  <span
                    key={id}
                    className="h-1.5 w-1.5 rounded-full transition"
                    style={{
                      background: knownSet.has(id) ? '#a78bfa' : 'rgba(255,255,255,0.12)',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 text-[0.6rem] text-white/35">
              {!active && 'Hover a skill node to scan…'}
            </div>
          </div>

          <aside className="md:w-[22rem]">
            {active ? (
              <div className="glass-card relative overflow-hidden p-6 md:sticky md:top-24">
                <div
                  className="absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl"
                  style={{ background: CATEGORY_COLOR[active.category] + '20' }}
                />
                {selected && (
                  <button
                    onClick={() => setSelectedId(null)}
                    className="absolute right-4 top-4 rounded-full border border-white/10 p-1.5 text-white/60 transition hover:border-white/30 hover:text-white"
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>
                )}

                <div
                  className="mono text-[0.58rem] tracking-[0.3em]"
                  style={{ color: CATEGORY_COLOR[active.category] }}
                >
                  {active.category}
                </div>
                <h3 className="display mt-2 text-xl text-white">{active.name}</h3>
                <p className="text-muted mt-3 text-sm leading-relaxed">{active.description}</p>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[0.58rem] tracking-[0.26em] text-white/45">
                      AVG PROFICIENCY
                    </span>
                    <span className="mono text-[0.58rem] text-white/60">{active.level}%</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${active.level}%`,
                        background: CATEGORY_COLOR[active.category],
                      }}
                    />
                  </div>
                </div>

                {selected && (
                  <>
                    {prerequisites.length > 0 && (
                      <div className="mt-5">
                        <div className="mono text-[0.58rem] tracking-[0.26em] text-white/45">REQUIRES</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {prerequisites.map((s) => (
                            <span key={s.id} className="chip">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {dependents.length > 0 && (
                      <div className="mt-4">
                        <div className="mono text-[0.58rem] tracking-[0.26em] text-white/45">FEEDS INTO</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {dependents.map((s) => (
                            <span key={s.id} className="chip">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => toggleLearned(selected.id)}
                      className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs uppercase tracking-[0.16em] transition ${
                        knownSet.has(selected.id)
                          ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-violet-400/40 hover:text-white'
                      }`}
                    >
                      {knownSet.has(selected.id) ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <BookOpen size={14} />
                      )}
                      {knownSet.has(selected.id) ? 'LEARNED' : 'MARK AS LEARNED'}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="glass-card flex h-full flex-col justify-center gap-4 p-6 md:sticky md:top-24">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                    <Zap size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <div className="mono text-[0.62rem] tracking-[0.3em] text-white/40">CONSTELLATION</div>
                    <div className="display text-lg text-white">Select a skill node</div>
                  </div>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  Click any sphere in the constellation to see what it needs, what it unlocks, and
                  whether you have already learned it.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(CATEGORY_COLOR).map(([cat, color]) => (
                    <span
                      key={cat}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[0.62rem] text-white/60"
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                      {cat}
                    </span>
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