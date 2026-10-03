'use client';

import { AnimatePresence, m } from 'motion/react';
import { useEffect, useState } from 'react';
import { PEERS, YOU_COLOR } from './presence-layer';

const people = [
  { initials: 'LS', name: 'Lovjyot', color: 'var(--accent)' },
  ...PEERS.map((p) => ({ initials: p.name[0], name: p.name, color: p.color })),
];

/** "Who's here" stack, like SyncFlow's presence chips. The visitor joins on first interaction. */
export function PresenceAvatars() {
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (joined) return;
    const join = () => setJoined(true);
    const timer = window.setTimeout(join, 2600);
    window.addEventListener('pointermove', join, { once: true, passive: true });
    window.addEventListener('scroll', join, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointermove', join);
      window.removeEventListener('scroll', join);
    };
  }, [joined]);

  const count = people.length + (joined ? 1 : 0);

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-1.5" role="img" aria-label={`${count} people viewing this page`}>
        {people.map((p) => (
          <span
            key={p.name}
            title={p.name}
            className="grid size-6 place-items-center rounded-full text-[0.6rem] font-semibold text-[#14100c] ring-2 ring-bg"
            style={{ backgroundColor: p.color }}
          >
            {p.initials}
          </span>
        ))}
        <AnimatePresence>
          {joined ? (
            <m.span
              key="you"
              title="You"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className="grid size-6 place-items-center rounded-full text-[0.55rem] font-semibold text-[#0d1a10] ring-2 ring-bg"
              style={{ backgroundColor: YOU_COLOR }}
            >
              You
            </m.span>
          ) : null}
        </AnimatePresence>
      </div>
      <span className="text-eyebrow hidden text-subtle sm:inline">
        <span className="tabular-nums">{count}</span> here now
      </span>
    </div>
  );
}
