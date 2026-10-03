'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  children: ReactNode;
  className?: string;
};

export function Switch({ checked, onCheckedChange, children, className }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn('group/switch inline-flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-fg', className)}
    >
      <span
        aria-hidden
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-300',
          checked ? 'border-transparent bg-accent' : 'border-line-strong bg-surface-3',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-3.5 rounded-full shadow-sm transition-[translate,background-color] duration-300 ease-spring',
            checked ? 'translate-x-4 bg-accent-ink' : 'bg-fg/80',
          )}
        />
      </span>
      {children}
    </button>
  );
}
