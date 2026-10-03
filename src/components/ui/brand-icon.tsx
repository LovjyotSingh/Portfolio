import type { BrandIconData } from '@/components/icons/brand-icons';
import { cn } from '@/lib/utils';

type Props = {
  icon: BrandIconData;
  className?: string;
  /** Use the brand colour instead of `currentColor`. */
  colored?: boolean;
  title?: string;
};

export function BrandIcon({ icon, className, colored, title }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-4 shrink-0', className)}
      fill={colored ? icon.hex : 'currentColor'}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={icon.path} />
    </svg>
  );
}
