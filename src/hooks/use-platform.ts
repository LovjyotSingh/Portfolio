'use client';

import { useSyncExternalStore } from 'react';

const noop = () => () => {};

function detectMac() {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? '';
  return /mac|iphone|ipad|ipod/i.test(platform);
}

/** The modifier key label for keyboard shortcuts ("⌘" on Apple platforms, "Ctrl" elsewhere). */
export function useModKey() {
  return useSyncExternalStore(noop, () => (detectMac() ? '⌘' : 'Ctrl'), () => '⌘');
}
