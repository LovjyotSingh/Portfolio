'use client';

import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Drifts its child by ±`distance` px as it crosses the viewport. */
export function Parallax({ children, distance = 36, className }: { children: ReactNode; distance?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <m.div ref={ref} style={reduce ? undefined : { y }} className={cn('will-change-transform', className)}>
      {children}
    </m.div>
  );
}
