'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

type Props = { to: number; pad?: number; suffix?: string; duration?: number; className?: string };

const format = (n: number, pad: number, suffix: string) => `${Math.round(n).toString().padStart(pad, '0')}${suffix}`;

/** Counts up once when scrolled into view. Server HTML holds the final value for no-JS and crawlers. */
export function CountUp({ to, pad = 0, suffix = '', duration = 1.6, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!inView) {
      el.textContent = format(0, pad, suffix);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = format(v, pad, suffix);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, pad, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {format(to, pad, suffix)}
    </span>
  );
}
