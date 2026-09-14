import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BrainCircuit,
  Compass,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import { CAREERS } from '../data/careers';
import { SKILLS } from '../data/skills';
import { recommend, type AdvisorInputs, type LevelOption, type Recommendation } from '../utils/advisor';
import { gsap } from '../utils/gsap';
import { getLenis } from '../utils/scroll';
import { useReveal } from '../hooks/useReveal';

const LEVELS: LevelOption[] = ['Beginner', 'Intermediate', 'Advanced'];

export default function CareerAdvisor() {
  const reveal = useReveal<HTMLElement>();
  const resultRef = useRef<HTMLDivElement>(null);
  const [level, setLevel] = useState<LevelOption>('Beginner');
  const [interest, setInterest] = useState<string>('auto');
  const [existing, setExisting] = useState<Set<string>>(new Set());
  const [hours, setHours] = useState(12);
  const [result, setResult] = useState<Recommendation | null>(null);

  const skillList = useMemo(() => SKILLS.map((s) => s.name), []);

  const toggleSkill = (name: string) => {
    setExisting((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const generate = () => {
    const inputs: AdvisorInputs = {
      level,
      interest,
      existing: Array.from(existing),
      hours,
    };
    setResult(recommend(inputs));
    window.setTimeout(() => {
      const el = document.getElementById('advisor-out');
      if (!el) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el, { offset: -96, duration: 1.4 });
      else el.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  useEffect(() => {
    if (!result || !resultRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = resultRef.current.querySelectorAll('.result-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, stagger: 0.09, duration: 0.75, ease: 'power3.out', overwrite: true },
    );
  }, [result]);

  const fill = ((hours - 2) / (40 - 2)) * 100;

  return (
    <section id="advisor" ref={reveal} className="section-shell relative">
      <div className="container-nx">
        <div data-reveal="up">
          <p className="eyebrow">05 — AI Career Advisor</p>
          <h2 className="display mt-5 max-w-3xl text-4xl text-white sm:text-5xl md:text-6xl">
            Forge your next <span className="accent-text">thirty days.</span>
          </h2>
          <p className="text-muted mt-5 max-w-xl text-sm leading-relaxed md:text-base">
            No API, no vague horoscopes. State your starting point and NEXUS renders a
            deterministic, prioritized plan from the career graph above.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="glass-card p-6" data-reveal="left">
            <div className="mono text-[0.62rem] tracking-[0.3em] text-white/40">
              SELF-PROFILE / INPUTS
            </div>

            <div className="mt-5">
              <label className="text-xs text-white/70">CURRENT SKILL LEVEL</label>
              <div className="seg mt-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    className={level === l ? 'on' : ''}
                    onClick={() => setLevel(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="text-xs text-white/70">INTERESTED CAREER</label>
              <select
                className="nx-select mt-2"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              >
                <option value="auto">✦ Let NEXUS decide</option>
                {CAREERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <label className="text-xs text-white/70">EXISTING SKILLS</label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skillList.map((s) => (
                  <button
                    key={s}
                    className={`chip ${existing.has(s) ? 'on' : ''}`}
                    onClick={() => toggleSkill(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center justify-between text-xs text-white/70">
                <span>WEEKLY LEARNING HOURS</span>
                <span className="mono text-[0.7rem] text-violet-300">{hours} h/wk</span>
              </label>
              <input
                type="range"
                min={2}
                max={40}
                step={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="nx-range mt-3"
                style={{ ['--fill' as string]: `${fill}%` }}
              />
              <div className="mt-1 flex justify-between text-[0.58rem] text-white/30">
                <span>2 MINIMAL</span>
                <span>20 STEADY</span>
                <span>40 INTENSE</span>
              </div>
            </div>

            <button onClick={generate} className="btn-pill btn-solid mt-6 w-full">
              <Sparkles size={14} /> Forge My Path
            </button>
          </div>

          <div id="advisor-out" ref={resultRef} className="min-h-[420px]">
            {!result ? (
              <div className="glass-card flex h-full min-h-[420px] flex-col items-center justify-center gap-5 p-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 -m-6 rounded-full bg-violet-600/20 blur-2xl" />
                  <div className="animate-spinSlow relative flex h-16 w-16 items-center justify-center rounded-full border border-violet-400/30">
                    <div className="h-8 w-8 rounded-full bg-[radial-gradient(circle_at_30%_30%,#a78bfa,#312e81)]" />
                  </div>
                </div>
                <div>
                  <div className="mono text-[0.62rem] tracking-[0.3em] text-white/40">
                    SYNTHESIS ENGINE
                  </div>
                  <div className="display mt-1 text-2xl text-white">Awaiting your intent</div>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-white/50">
                  Configure the inputs and press <span className="text-violet-300">Forge My Path</span>.
                  The engine reads your profile and walks the career graph to compute what to learn,
                  in what order, and on what schedule.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                <div className="glass-card result-card flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full opacity-30 blur-xl"
                      style={{ background: result.career.color }}
                    />
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full border"
                      style={{
                        borderColor: result.career.color + '66',
                        background: 'rgba(10,12,22,0.8)',
                      }}
                    >
                      <BrainCircuit size={26} style={{ color: result.career.color }} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mono text-[0.6rem] tracking-[0.28em] text-white/40">
                      RECOMMENDED CAREER · {result.pace}
                    </div>
                    <h3 className="display mt-1 text-2xl text-white">{result.career.name}</h3>
                    <p className="mt-1 text-sm italic text-white/60">{result.career.tagline}</p>
                  </div>
                  <div className="text-center">
                    <div className="display text-5xl" style={{ color: result.career.color }}>
                      {result.match}
                      <span className="text-2xl">%</span>
                    </div>
                    <div className="mono mt-1 text-[0.56rem] tracking-[0.24em] text-white/40">
                      SIGNAL STRENGTH
                    </div>
                  </div>
                </div>

                <div className="glass-card result-card p-6">
                  <div className="flex items-center gap-2">
                    <Compass size={15} className="text-violet-400" />
                    <div className="mono text-[0.62rem] tracking-[0.28em] text-white/50">
                      MISSING SKILLS — PRIORITY ORDER
                    </div>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {result.missing.length === 0 && (
                      <p className="text-sm text-emerald-400">All core skills registered. You are ready to build.</p>
                    )}
                    {result.missing.map((m, i) => (
                      <div key={m.name} className="flex items-center gap-3">
                        <span className="mono w-5 text-[0.62rem]" style={{ color: result.career.color }}>
                          {String(m.priority).padStart(2, '0')}
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${100 - i * 10}%`,
                              background:
                                i === 0 ? result.career.color : 'rgba(255,255,255,0.22)',
                            }}
                          />
                        </div>
                        <span className="w-52 text-right text-sm text-white/75">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="result-card grid gap-4 md:grid-cols-3">
                  {result.phases.map((p) => (
                    <div key={p.phase} className="glass-card p-5">
                      <div className="flex items-center justify-between">
                        <span className="mono text-[0.6rem] tracking-[0.22em] text-violet-300">
                          {p.phase}
                        </span>
                        <span className="mono text-[0.58rem] text-white/40">{p.window}</span>
                      </div>
                      <div className="display mt-2 text-lg text-white">{p.focus}</div>
                      <ul className="mt-3 space-y-2">
                        {p.tasks.map((t, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs leading-relaxed text-white/65">
                            <Target size={11} className="mt-0.5 shrink-0 text-white/30" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="glass-card result-card relative overflow-hidden p-6">
                  <div
                    className="absolute -right-14 -top-14 h-40 w-40 rounded-full blur-3xl"
                    style={{ background: result.career.color + '22' }}
                  />
                  <div className="mono text-[0.6rem] tracking-[0.28em] text-white/40">
                    SUGGESTED PROJECT
                  </div>
                  <div className="display mt-2 text-2xl text-white">{result.projectTitle}</div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {result.projectTech.map((t) => (
                      <span key={t} className="chip on" style={{ borderColor: result.career.color + '40' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setResult(null)}
                  className="result-card inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/40 transition hover:text-white"
                >
                  <RotateCcw size={13} /> Rerun with different inputs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}