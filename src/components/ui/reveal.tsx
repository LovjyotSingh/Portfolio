'use client';

import { m, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

type Props = HTMLMotionProps<'div'> & {
  delay?: number;
  y?: number;
  as?: 'div' | 'li' | 'section' | 'article' | 'span';
};

export function Reveal({ delay = 0, y = 28, as = 'div', className, children, ...rest }: Props) {
  const Comp = m[as] as typeof m.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </Comp>
  );
}
