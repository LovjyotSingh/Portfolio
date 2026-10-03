'use client';

import { ReactLenis } from 'lenis/react';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import type { ReactNode } from 'react';
import { PaletteProvider } from './palette-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        wheelMultiplier: 1,
        anchors: true,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
      }}
    >
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <PaletteProvider>{children}</PaletteProvider>
        </MotionConfig>
      </LazyMotion>
    </ReactLenis>
  );
}
