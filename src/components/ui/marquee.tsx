import { cn } from '@/lib/utils';

function Spark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('size-[0.42em] shrink-0', className)} aria-hidden>
      <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" fill="currentColor" />
    </svg>
  );
}

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn('group relative overflow-hidden border-y border-line py-5 sm:py-7', className)}>
      <p className="sr-only">Technologies I work with: {items.join(', ')}.</p>
      <div className="mask-fade-x" aria-hidden>
        <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {items.map((item, i) => (
                <li
                  key={`${copy}-${item}`}
                  className="flex items-center gap-[0.55em] pr-[0.55em] text-[clamp(1.6rem,4.2vw,3.4rem)] leading-none tracking-[-0.035em]"
                >
                  <span className={i % 2 === 1 ? 'font-accent text-muted' : 'font-medium'}>{item}</span>
                  <Spark className="text-accent" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
