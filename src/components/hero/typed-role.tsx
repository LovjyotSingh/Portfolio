'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const ROLES = [
  'real-time collaborative editors.',
  'AI interviewers that grade honestly.',
  'race-safe APIs on Node & MongoDB.',
  'interfaces that feel instant.',
];

const TYPE_MS = 46;
const DELETE_MS = 22;
const HOLD_MS = 2600;

/** Types each phrase behind a collaborator caret tagged "Lovjyot". */
export function TypedRole({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [state, setState] = useState({ index: 0, length: ROLES[0].length, deleting: false });
  const phrase = ROLES[state.index];
  const typing = state.deleting || state.length < phrase.length;

  useEffect(() => {
    if (reduce) return;
    const full = state.length === phrase.length;
    const empty = state.length === 0;
    const delay = state.deleting ? DELETE_MS : full ? HOLD_MS : TYPE_MS + Math.random() * 40;

    const t = window.setTimeout(() => {
      setState((s) => {
        if (!s.deleting && s.length === ROLES[s.index].length) return { ...s, deleting: true };
        if (s.deleting && s.length === 0) return { index: (s.index + 1) % ROLES.length, length: 0, deleting: false };
        return { ...s, length: s.length + (s.deleting ? -1 : 1) };
      });
    }, empty && state.deleting ? 250 : delay);
    return () => window.clearTimeout(t);
  }, [state, phrase.length, reduce]);

  return (
    <span className={cn('relative', className)}>
      <span className="sr-only">{ROLES.join(' ')}</span>
      <span aria-hidden>
        {phrase.slice(0, state.length)}
        <span className="relative inline-block h-[0.92em] w-0 align-[-0.1em]">
          <span
            className={cn(
              'absolute inset-y-0 -left-px w-[3px] rounded-full bg-accent',
              !typing && 'animate-blink',
            )}
          />
          <span className="absolute bottom-full left-[-1px] mb-1 rounded-[4px] rounded-bl-none bg-accent px-1.5 py-[3px] font-sans text-[11px] leading-none font-medium tracking-normal whitespace-nowrap text-accent-ink not-italic">
            Lovjyot
          </span>
        </span>
      </span>
    </span>
  );
}
