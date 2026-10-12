'use client';

import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  const query = window.matchMedia('(pointer: coarse)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** True on phones and other touch-first devices. Server render assumes a fine pointer. */
export function useCoarsePointer() {
  return useSyncExternalStore(subscribe, () => window.matchMedia('(pointer: coarse)').matches, () => false);
}
