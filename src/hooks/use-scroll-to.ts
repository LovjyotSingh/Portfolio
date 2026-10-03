'use client';

import { useLenis } from 'lenis/react';

/** Scrolls through Lenis when it is running, so in-page jumps keep the same easing as wheel scrolling. */
export function useScrollTo() {
  const lenis = useLenis();

  return (target: string, opts?: { offset?: number; immediate?: boolean }) => {
    const id = target.replace(/^#/, '');
    const el = id === 'top' ? document.body : document.getElementById(id);
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (lenis) {
      lenis.scrollTo(id === 'top' ? 0 : el, {
        offset: opts?.offset ?? 0,
        immediate: opts?.immediate || reduce,
        duration: reduce ? 0 : 1.3,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
    if (id !== 'top') history.replaceState(null, '', `#${id}`);
    else history.replaceState(null, '', window.location.pathname);
  };
}
