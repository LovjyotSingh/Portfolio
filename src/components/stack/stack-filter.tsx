'use client';

import { useState, type ReactNode } from 'react';
import type { ProjectId } from '@/content/skills';
import { cn } from '@/lib/utils';

type Filter = 'all' | ProjectId;

const options: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'offerforge', label: 'OfferForge AI' },
  { id: 'syncflow', label: 'SyncFlow' },
];

/** Dims every chip a project doesn't use. The grid stays server-rendered; only this toggle ships JS. */
export function StackFilter({ counts, children, className }: { counts: Record<ProjectId, number>; children: ReactNode; className?: string }) {
  const [filter, setFilter] = useState<Filter>('all');

  return (
    <div data-filter={filter} className={className}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Highlight the stack of a project" className="flex rounded-full border border-line-strong p-1">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={filter === o.id}
              onClick={() => setFilter(o.id)}
              className={cn(
                'h-9 rounded-full px-4 text-[0.8125rem] transition-colors duration-200',
                filter === o.id ? 'bg-fg text-bg' : 'text-muted hover:text-fg',
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs text-subtle" aria-live="polite">
          {filter === 'all' ? 'Highlight a project to see what it runs on' : `${counts[filter]} of these power ${filter === 'offerforge' ? 'OfferForge AI' : 'SyncFlow'}`}
        </p>
      </div>
      {children}
    </div>
  );
}
