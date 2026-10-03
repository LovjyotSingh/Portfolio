'use client';

import { useSyncExternalStore } from 'react';
import { profile } from '@/content/profile';
import { getClock, getServerClock, subscribeClock } from '@/lib/clock-store';

const formatter = new Intl.DateTimeFormat('en-IN', {
  timeZone: profile.timeZone,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
});

function format(ms: number, withSeconds: boolean) {
  const parts = formatter.formatToParts(new Date(ms));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('hour')}:${get('minute')}${withSeconds ? `:${get('second')}` : ''} ${get('dayPeriod').toUpperCase()}`;
}

/** Live clock in Lovjyot's time zone. The server renders a placeholder, so there is no hydration drift. */
export function LocalTime({ withSeconds = true, className }: { withSeconds?: boolean; className?: string }) {
  const now = useSyncExternalStore(subscribeClock, getClock, getServerClock);
  const text = now ? format(now, withSeconds) : withSeconds ? '--:--:-- --' : '--:-- --';

  return (
    <time className={className} dateTime={now ? new Date(now).toISOString() : undefined}>
      <span className="tabular-nums">{text}</span> {profile.timeZoneLabel}
    </time>
  );
}
