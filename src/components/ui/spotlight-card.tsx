'use client';

import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** Card with a soft accent glow that tracks the pointer (one CSS-var write per move). */
export function SpotlightCard({ className, children, ...rest }: ComponentProps<'div'>) {
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  return (
    <div onPointerMove={onPointerMove} className={cn('spotlight-card relative', className)} {...rest}>
      {children}
    </div>
  );
}
