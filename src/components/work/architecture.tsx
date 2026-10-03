import type { ArchNode, Project } from '@/content/projects';
import { PauseOffscreen } from '@/components/ui/pause-offscreen';
import { cn } from '@/lib/utils';

function Node({ node, className }: { node: ArchNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border p-4 sm:p-5',
        node.tone === 'accent' && 'border-accent/45 bg-accent-soft shadow-[0_0_48px_-16px_var(--glow)]',
        node.tone === 'muted' && 'border-dashed border-line-strong',
        !node.tone && 'border-line-strong bg-surface',
        className,
      )}
    >
      <p className="font-medium tracking-[-0.015em]">{node.title}</p>
      <p className="mt-1.5 font-mono text-[0.7rem] leading-relaxed text-muted">{node.detail}</p>
    </div>
  );
}

/** One connector: vertical on small screens, horizontal from `lg` when `horizontal` is set. */
function Wire({ horizontal, delay = 0, className }: { horizontal?: boolean; delay?: number; className?: string }) {
  const packets = (
    <>
      <span className="packet" style={{ '--delay': `${delay}s` } as React.CSSProperties} />
      <span className="packet" data-reverse style={{ '--delay': `${delay + 1.4}s` } as React.CSSProperties} />
    </>
  );
  return (
    <div aria-hidden className={className}>
      <div className={cn('wire wire-v mx-auto h-9 w-6', horizontal && 'lg:hidden')}>{packets}</div>
      {horizontal ? <div className="wire wire-h hidden h-6 w-full lg:block">{packets}</div> : null}
    </div>
  );
}

export function Architecture({ project }: { project: Project }) {
  const { flow, stores, caption } = project.architecture;
  const [first, hub, last] = flow;

  return (
    <figure className="rounded-[1.75rem] border border-line bg-bg-soft/60 p-5 sm:p-8">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-eyebrow text-muted">How it’s wired</p>
        <p className="flex items-center gap-4 font-mono text-[0.7rem] text-subtle">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden /> request
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent-2" aria-hidden /> response
          </span>
        </p>
      </div>

      <PauseOffscreen className="grid items-center lg:grid-cols-[minmax(0,1fr)_clamp(2.5rem,5vw,4.5rem)_minmax(0,1fr)_clamp(2.5rem,5vw,4.5rem)_minmax(0,1fr)]">
        <Node node={first} />
        <Wire horizontal />
        <Node node={hub} />
        <Wire horizontal delay={0.7} />
        <Node node={last} />

        <Wire delay={0.35} className="max-lg:hidden lg:col-start-3" />
        <p className="text-eyebrow mt-8 mb-3 text-subtle lg:hidden">{hub.title} also talks to</p>
        <div className="rounded-[1.25rem] border border-line p-2 sm:p-2.5 lg:col-span-3 lg:col-start-2">
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-2.5">
            {stores.map((store) => (
              <Node key={store.id} node={store} />
            ))}
          </div>
        </div>
      </PauseOffscreen>

      <figcaption className="mt-8 max-w-3xl border-t border-line pt-6 text-pretty text-muted">
        <span className="font-accent mr-1.5 text-lg text-fg">Why it holds up:</span>
        {caption}
      </figcaption>
    </figure>
  );
}
