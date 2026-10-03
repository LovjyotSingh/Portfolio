import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out-quart active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-ink shadow-[0_0_0_1px_rgb(255_255_255/0.12)_inset,0_10px_30px_-10px_var(--glow)] hover:bg-accent-2 hover:shadow-[0_0_0_1px_rgb(255_255_255/0.2)_inset,0_14px_40px_-8px_var(--glow)]',
  secondary:
    'border border-line-strong bg-surface/70 text-fg backdrop-blur-md hover:border-fg/30 hover:bg-surface-2',
  ghost: 'text-muted hover:bg-fg/5 hover:text-fg',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-13 px-6 text-base sm:h-14 sm:px-7',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = ComponentProps<'a'> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
};

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'end',
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a className={buttonClasses(variant, size, className)} {...rest}>
      {icon && iconPosition === 'start' ? <IconSlot>{icon}</IconSlot> : null}
      <span>{children}</span>
      {icon && iconPosition === 'end' ? <IconSlot>{icon}</IconSlot> : null}
    </a>
  );
}

function IconSlot({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex size-4 items-center justify-center overflow-hidden" aria-hidden>
      {children}
    </span>
  );
}
