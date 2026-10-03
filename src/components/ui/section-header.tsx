import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from './reveal';

type Props = {
  index: string;
  label: string;
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
  id?: string;
};

export function SectionHeader({ index, label, title, aside, className, id }: Props) {
  return (
    <header className={cn('grid gap-8 lg:grid-cols-12 lg:items-end', className)}>
      <div className="lg:col-span-8">
        <Reveal>
          <p className="text-eyebrow flex items-center gap-3 text-muted">
            <span className="text-accent-text">({index})</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden />
            {label}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 id={id} className="text-display mt-6 font-semibold text-balance">
            {title}
          </h2>
        </Reveal>
      </div>
      {aside ? (
        <Reveal delay={0.12} className="text-pretty text-muted lg:col-span-4 lg:pb-3">
          {aside}
        </Reveal>
      ) : null}
    </header>
  );
}
