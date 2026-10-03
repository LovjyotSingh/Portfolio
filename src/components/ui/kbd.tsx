import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-strong bg-surface-2 px-1 font-mono text-[0.6875rem] leading-none text-muted shadow-[0_1px_0_var(--line-strong)]',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
