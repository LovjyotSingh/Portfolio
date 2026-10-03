import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  id: string;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Outer chrome shared by the interactive demos inside each case study. */
export function DemoFrame({ id, title, description, children, className }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('scroll-mt-24 rounded-[1.75rem] border border-line bg-bg-soft/80 p-1.5 shadow-soft sm:p-2', className)}
    >
      <header className="flex flex-col gap-3 px-4 pt-5 pb-5 sm:px-6 sm:pt-6">
        <p className="text-eyebrow flex items-center gap-2.5 text-accent-text">
          <span className="relative flex size-1.5">
            <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-accent" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
          </span>
          Try it · runs in your browser
        </p>
        <h4 id={`${id}-title`} className="text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight font-semibold tracking-[-0.035em] text-balance">
          {title}
        </h4>
        <p className="max-w-3xl text-[0.95rem] text-pretty text-muted">{description}</p>
      </header>
      <div className="overflow-hidden rounded-[1.35rem] border border-line bg-surface">{children}</div>
    </section>
  );
}
