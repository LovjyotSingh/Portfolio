'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { PANE_HEIGHT, STAGE_GRID } from './layout';

function SyncDemoSkeleton() {
  return (
    <div>
      <p className="sr-only">Loading the live sync demo…</p>
      <div aria-hidden className="flex min-h-[3.75rem] items-center gap-3 border-b border-line px-4 sm:px-6">
        <span className="size-2 rounded-full bg-fg/15" />
        <span className="h-2.5 w-44 rounded-full bg-fg/10" />
      </div>
      <div aria-hidden className={STAGE_GRID}>
        {(['client', 'wire', 'room', 'wire', 'client'] as const).map((kind, i) =>
          kind === 'wire' ? (
            <div key={i} className="hidden lg:block" />
          ) : (
            <div key={i} className={cn('flex flex-col', kind === 'room' && 'max-lg:order-last')}>
              <div className="mb-2.5 flex h-10 items-center gap-2.5 px-1">
                <span className="size-7 rounded-full bg-fg/10" />
                <span className="h-2.5 w-24 rounded-full bg-fg/10" />
              </div>
              <div className={cn('animate-pulse rounded-2xl', kind === 'room' ? 'border border-line bg-bg/70' : 'bg-fg/[0.06]', PANE_HEIGHT)} />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

const SyncDemo = dynamic(() => import('./sync-demo'), { ssr: false, loading: SyncDemoSkeleton });

/** Fetches Yjs and the demo only as the reader approaches it. */
export function SyncDemoLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: '900px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{near ? <SyncDemo /> : <SyncDemoSkeleton />}</div>;
}
