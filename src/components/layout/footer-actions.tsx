'use client';

import { ArrowUp } from 'lucide-react';
import { usePalette } from '@/components/providers/palette-context';
import { Kbd } from '@/components/ui/kbd';
import { useModKey } from '@/hooks/use-platform';
import { useScrollTo } from '@/hooks/use-scroll-to';

export function FooterActions() {
  const scrollTo = useScrollTo();
  const palette = usePalette();
  const mod = useModKey();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={palette.open}
        className="hidden items-center gap-2 rounded-full px-3 py-2 text-xs text-subtle transition-colors hover:text-fg sm:inline-flex"
      >
        Press <Kbd>{mod}</Kbd>
        <Kbd>K</Kbd> to jump anywhere
      </button>
      <button
        type="button"
        onClick={() => scrollTo('top')}
        className="group inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm text-muted transition-colors hover:border-fg/30 hover:text-fg"
      >
        Back to top
        <ArrowUp className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" aria-hidden />
      </button>
    </div>
  );
}
