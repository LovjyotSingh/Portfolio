'use client';

import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

type Token = { text: string; accent: boolean };

/** `*word*` marks an accent word (serif italic, accent colour). */
function tokenize(source: string): Token[] {
  return source.split(/\s+/).map((raw) => {
    const accent = /^\*.+\*[.,;:!?]?$/.test(raw);
    return { text: accent ? raw.replace(/\*/g, '') : raw, accent };
  });
}

/** Paragraph whose words light up as it scrolls through the viewport. */
export function ScrollLitText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.5'] });
  const tokens = tokenize(text);

  return (
    <p ref={ref} className={cn('text-pretty', className)}>
      {tokens.map((token, i) => {
        const start = i / tokens.length;
        const end = Math.min(1, start + 2.5 / tokens.length);
        return (
          <Word key={i} token={token} progress={scrollYProgress} range={[start, end]} still={!!reduce} />
        );
      })}
    </p>
  );
}

function Word({
  token,
  progress,
  range,
  still,
}: {
  token: Token;
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <>
      <m.span
        style={still ? undefined : { opacity }}
        className={token.accent ? 'font-accent text-[1.08em] text-accent-text' : undefined}
      >
        {token.text}
      </m.span>{' '}
    </>
  );
}
