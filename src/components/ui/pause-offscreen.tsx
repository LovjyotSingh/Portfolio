'use client';

import { useEffect, useRef, type ComponentProps } from 'react';

/** Sets `data-paused` while the element is off-screen so CSS loops inside it can rest. */
export function PauseOffscreen({ children, ...rest }: ComponentProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.paused = String(!entry.isIntersecting);
      },
      { rootMargin: '120px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-paused="true" {...rest}>
      {children}
    </div>
  );
}
