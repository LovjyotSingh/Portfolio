'use client';

import { useEffect, useState } from 'react';

/** Reports which section currently crosses the middle of the viewport. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(',');

  useEffect(() => {
    const sectionIds = key.split(',');
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        setActive(sectionIds.find((id) => visible.get(id)) ?? null);
      },
      { rootMargin: '-45% 0px -54% 0px', threshold: 0 },
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [key]);

  return active;
}
