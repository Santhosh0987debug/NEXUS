import { useCallback, useEffect, useRef, useState } from 'react';
import { Aperture, Menu, X } from 'lucide-react';
import { scrollToTarget, getScrollY } from '../utils/scroll';

const NAV = [
  { id: 'home', label: 'NEXUS' },
  { id: 'careers', label: 'Careers' },
  { id: 'skills', label: 'Skills' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'projects', label: 'Projects' },
  { id: 'advisor', label: 'Advisor' },
];

export default function Navbar() {
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const updateProgress = () => {
      const y = getScrollY();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${p})`;
      }
      raf = requestAnimationFrame(updateProgress);
    };
    raf = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const go = useCallback((id: string) => {
    setMenuOpen(false);
    window.setTimeout(() => scrollToTarget(id === 'home' ? '#home' : `#${id}`, 0), 40);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="relative border-b border-white/[0.06] bg-[rgba(5,6,10,0.55)] backdrop-blur-md">
          <div className="container-nx flex h-16 items-center justify-between">
            <button
              onClick={() => go('home')}
              className="group flex items-center gap-2.5 text-white"
              aria-label="NEXUS home"
            >
              <Aperture
                size={20}
                className="text-violet-400 transition group-hover:rotate-90"
              />
              <span className="display text-lg tracking-[0.14em]">NEXUS</span>
            </button>

            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  className={`rounded-full px-3.5 py-1.5 text-[0.72rem] uppercase tracking-[0.16em] transition ${
                    active === n.id
                      ? 'bg-white/[0.07] text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-full border border-white/10 p-2 text-white/80 transition hover:border-white/30 hover:text-white md:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>

          <div className="h-px w-full">
            <div
              ref={progressRef}
              className="h-px origin-left"
              style={{
                transform: 'scaleX(0)',
                background: 'linear-gradient(90deg, #7c3aed, #3b82f6 60%, #22d3ee)',
                boxShadow: '0 0 12px rgba(124,58,237,0.8)',
              }}
            />
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-[rgba(4,5,9,0.92)] backdrop-blur-xl transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="container-nx flex h-16 items-center justify-between">
          <span className="display text-lg tracking-[0.14em] text-white">NEXUS</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-full border border-white/10 p-2 text-white/80"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="container-nx mt-10 flex flex-col gap-3">
          {NAV.map((n, i) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className="group flex items-center gap-5 border-b border-white/[0.06] pb-4 text-left"
            >
              <span className="mono text-[0.6rem] text-violet-400/70">0{i + 1}</span>
              <span className="display text-4xl text-white/85 transition group-hover:text-white">
                {n.label}
              </span>
            </button>
          ))}
        </nav>
        <p className="mono container-nx mt-12 text-[0.56rem] tracking-[0.3em] text-white/30">
          YOUR FUTURE IS BUILT, NOT PREDICTED.
        </p>
      </div>
    </>
  );
}