'use client';

import { Check, Copy } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = { value: string; label?: string; className?: string; size?: 'sm' | 'md' };

export function CopyButton({ value, label = 'Copy', className, size = 'md' }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement('textarea');
      area.value = value;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        'relative inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/80 font-medium text-fg backdrop-blur transition-colors hover:border-fg/30 hover:bg-surface-2',
        size === 'sm' ? 'h-8 px-3 text-xs' : 'h-11 px-4 text-sm',
        className,
      )}
    >
      <span className="relative inline-flex size-4 items-center justify-center" aria-hidden>
        <AnimatePresence initial={false} mode="popLayout">
          {copied ? (
            <m.span key="ok" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
              <Check className="size-4 text-accent-text" />
            </m.span>
          ) : (
            <m.span key="copy" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
              <Copy className="size-4" />
            </m.span>
          )}
        </AnimatePresence>
      </span>
      <span>{copied ? 'Copied' : label}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? `${value} copied to clipboard` : ''}
      </span>
    </button>
  );
}
