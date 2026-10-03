'use client';

import { useSyncExternalStore } from 'react';
import { readTheme, type Theme } from '@/lib/theme';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => 'dark');
}
