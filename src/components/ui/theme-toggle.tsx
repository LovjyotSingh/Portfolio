'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { switchTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fromPointer = e.clientX !== 0 || e.clientY !== 0;
    switchTheme(next, {
      x: fromPointer ? e.clientX : rect.left + rect.width / 2,
      y: fromPointer ? e.clientY : rect.top + rect.height / 2,
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cn(
        'relative inline-flex size-9 items-center justify-center overflow-hidden rounded-full text-muted transition-colors hover:bg-fg/6 hover:text-fg',
        className,
      )}
    >
      <Sun
        className={cn(
          'absolute size-[1.05rem] transition-all duration-500 ease-out-expo',
          theme === 'dark' ? 'translate-y-0 rotate-0 opacity-100' : 'translate-y-5 rotate-90 opacity-0',
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          'absolute size-[1.05rem] transition-all duration-500 ease-out-expo',
          theme === 'light' ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-5 -rotate-90 opacity-0',
        )}
        aria-hidden
      />
    </button>
  );
}
