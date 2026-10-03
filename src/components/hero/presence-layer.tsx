'use client';

import { useEffect, useRef } from 'react';
import { PresenceCursor } from './presence-cursor';

export const PEERS = [
  { name: 'Recruiter', color: '#7dd3fc', keyframes: 'peer-a', duration: '23s', className: '' },
  { name: 'Hiring manager', color: '#c4b5fd', keyframes: 'peer-b', duration: '29s', className: 'hidden md:block' },
] as const;

export const YOU_COLOR = '#86efac';

/**
 * Decorative multiplayer layer for the hero: roaming peers (pure CSS), a
 * "You" tag that follows the real pointer, and the dot-grid spotlight.
 * Pointer work is batched into one rAF write; everything pauses off-screen.
 */
export function PresenceLayer() {
  const layerRef = useRef<HTMLDivElement>(null);
  const youRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const section = layer?.parentElement;
    const you = youRef.current;
    if (!layer || !section || !you) return;

    const io = new IntersectionObserver(([entry]) => {
      layer.dataset.paused = String(!entry.isIntersecting);
    });
    io.observe(section);

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0;
    let px = 0;
    let py = 0;

    const write = () => {
      frame = 0;
      you.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      section.style.setProperty('--mx', `${px}px`);
      section.style.setProperty('--my', `${py}px`);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !fine.matches) return;
      const rect = section.getBoundingClientRect();
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
      you.style.opacity = '1';
      section.style.setProperty('--spot-o', '1');
      if (!frame) frame = requestAnimationFrame(write);
    };
    const onLeave = () => {
      you.style.opacity = '0';
      section.style.setProperty('--spot-o', '0');
    };

    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={layerRef} className="presence-layer pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {PEERS.map((peer) => (
        <div
          key={peer.name}
          className={`peer ${peer.className}`}
          style={{ animationName: peer.keyframes, animationDuration: peer.duration }}
        >
          <PresenceCursor name={peer.name} color={peer.color} />
        </div>
      ))}
      <div
        ref={youRef}
        className="you-tag absolute top-0 left-0 opacity-0 transition-opacity duration-300"
        style={{ willChange: 'transform' }}
      >
        <span
          className="absolute top-[22px] left-[16px] rounded-full rounded-tl-[4px] px-2 py-[3px] text-[11px] leading-none font-medium whitespace-nowrap text-[#0d1a10] shadow-[0_4px_14px_-4px_rgb(0_0_0/0.45)]"
          style={{ backgroundColor: YOU_COLOR }}
        >
          You
        </span>
      </div>
    </div>
  );
}
