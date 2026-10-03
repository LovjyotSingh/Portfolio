import { ArrowUpRight, Lock, MousePointer2 } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';

type Props = {
  href: string;
  host: string;
  name: string;
  image: StaticImageData;
  alt: string;
  /** Tall full-page captures scroll through on hover. */
  scrollable?: boolean;
  className?: string;
};

export function BrowserFrame({ href, host, name, image, alt, scrollable, className }: Props) {
  return (
    <div className={cn('overflow-hidden rounded-[1.35rem] border border-line-strong bg-surface shadow-float', className)}>
      <div className="flex h-11 items-center gap-3 border-b border-line bg-surface-2/80 px-4">
        <span className="flex shrink-0 gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-fg/15" />
          <span className="size-2.5 rounded-full bg-fg/15" />
          <span className="size-2.5 rounded-full bg-fg/15" />
        </span>
        <span className="mx-auto flex h-7 min-w-0 max-w-[22rem] flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-bg/60 px-3 font-mono text-[0.7rem] text-muted">
          <Lock className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{host}</span>
        </span>
        <span className="text-eyebrow flex shrink-0 items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <span className="relative flex size-1.5">
            <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-current" />
            <span className="relative inline-flex size-1.5 rounded-full bg-current" />
          </span>
          Live
        </span>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open the ${name} live site in a new tab`}
        className="group/frame relative block aspect-[16/10] overflow-hidden bg-bg-soft [container-type:size] focus-visible:rounded-none focus-visible:outline-offset-[-3px]"
      >
        <Image
          src={image}
          alt={alt}
          placeholder="blur"
          sizes="(min-width: 1320px) 740px, (min-width: 1024px) 56vw, 100vw"
          className={cn(
            'h-auto w-full',
            scrollable
              ? 'transition-[translate] duration-1400 ease-in-out-quart group-hover/frame:translate-y-[calc(-100%_+_100cqh)] group-hover/frame:duration-9000 group-focus-visible/frame:translate-y-[calc(-100%_+_100cqh)] group-focus-visible/frame:duration-9000'
              : 'transition-[scale] duration-1000 ease-out-expo group-hover/frame:scale-[1.025]',
          )}
        />
        {scrollable ? (
          <span className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-1.5 rounded-full border border-line bg-bg/75 px-3 py-1.5 text-[0.7rem] text-muted backdrop-blur-md transition-opacity duration-300 group-hover/frame:opacity-0 pointer-fine:inline-flex">
            <MousePointer2 className="size-3" aria-hidden /> Hover to scroll the page
          </span>
        ) : null}
        <span className="pointer-events-none absolute right-4 bottom-4 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-fg px-3.5 py-2 text-xs font-medium text-bg opacity-0 shadow-soft transition-[opacity,translate] duration-500 ease-out-expo group-hover/frame:translate-y-0 group-hover/frame:opacity-100 group-focus-visible/frame:translate-y-0 group-focus-visible/frame:opacity-100">
          Open live site <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      </a>
    </div>
  );
}
