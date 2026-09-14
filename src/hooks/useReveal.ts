import { useEffect, useRef } from 'react';
import { gsap } from '../utils/gsap';

export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        const dir = el.dataset.reveal || 'up';
        const delay = parseFloat(el.dataset.delay || '0');
        const from: gsap.TweenVars = { opacity: 0, duration: 1.05, delay };
        if (dir === 'up') from.y = 56;
        else if (dir === 'down') from.y = -56;
        else if (dir === 'left') from.x = 70;
        else if (dir === 'right') from.x = -70;
        else if (dir === 'zoom') from.scale = 0.92;

        gsap.fromTo(
          el,
          from,
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return ref;
}