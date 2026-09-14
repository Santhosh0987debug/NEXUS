import type Lenis from 'lenis';

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function getScrollY() {
  if (typeof window === 'undefined') return 0;
  return window.scrollY || document.documentElement.scrollTop || 0;
}

export function scrollToTarget(target: string | number, offset = 0) {
  const resolve = (): number => {
    if (typeof target === 'number') return target;
    const el = document.querySelector(target) as HTMLElement | null;
    if (!el) return 0;
    return el.getBoundingClientRect().top + getScrollY();
  };

  if (lenis && window.matchMedia('(prefers-reduced-motion: reduce)').matches === false) {
    lenis.scrollTo(resolve() + offset, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    const el = document.querySelector(typeof target === 'string' ? target : 'body');
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
}