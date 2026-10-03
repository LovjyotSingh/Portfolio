import { cn } from '@/lib/utils';

type Props = { name: string; color: string; className?: string; style?: React.CSSProperties };

/** A multiplayer-style cursor with a name tag, as seen in SyncFlow. */
export function PresenceCursor({ name, color, className, style }: Props) {
  return (
    <div className={cn('pointer-events-none select-none', className)} style={style} aria-hidden>
      <svg width="20" height="20" viewBox="0 0 20 20" className="drop-shadow-[0_2px_6px_rgb(0_0_0/0.35)]">
        <path
          d="M3.3 2.1 17 8.1c.8.33.7 1.48-.13 1.68l-5.6 1.37a1 1 0 0 0-.72.66l-1.85 5.42c-.27.8-1.4.82-1.7.03L2.03 3.38c-.3-.79.48-1.56 1.27-1.28Z"
          fill={color}
          stroke="rgb(255 255 255 / 0.9)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="absolute top-[18px] left-[14px] rounded-full rounded-tl-[4px] px-2 py-[3px] text-[11px] leading-none font-medium whitespace-nowrap text-[#14100c] shadow-[0_4px_14px_-4px_rgb(0_0_0/0.45)]"
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
    </div>
  );
}
