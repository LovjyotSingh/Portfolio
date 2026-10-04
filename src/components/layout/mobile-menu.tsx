'use client';

import { useLenis } from 'lenis/react';
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { useEffect, useEffectEvent, useRef } from 'react';
import { navItems, profile, socials } from '@/content/profile';
import { LocalTime } from '@/components/ui/local-time';

type Props = {
  open: boolean;
  onClose: () => void;
  onNavigate: (e: React.MouseEvent, id: string) => void;
};

const ease = [0.16, 1, 0.3, 1] as const;

export function MobileMenu({ open, onClose, onNavigate }: Props) {
  const lenis = useLenis();
  const firstLink = useRef<HTMLAnchorElement>(null);
  const onEscape = useEffectEvent(() => onClose());

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const t = window.setTimeout(() => firstLink.current?.focus({ preventScroll: true }), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      lenis?.start();
    };
  }, [open, lenis]);

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="pointer-events-auto fixed inset-0 z-40 bg-bg/95 backdrop-blur-2xl md:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.7, ease } }}
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="container-page flex h-full flex-col justify-between pt-24 pb-8">
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {navItems.map((item, i) => (
                  <li key={item.id} className="overflow-hidden border-b border-line">
                    <m.a
                      ref={i === 0 ? firstLink : undefined}
                      href={`#${item.id}`}
                      onClick={(e) => onNavigate(e, item.id)}
                      className="group flex items-baseline justify-between py-4"
                      initial={{ y: '110%' }}
                      animate={{ y: 0, transition: { duration: 0.8, delay: 0.12 + i * 0.06, ease } }}
                      exit={{ y: '110%', transition: { duration: 0.3, ease } }}
                    >
                      <span className="text-[clamp(2.75rem,14vw,4.5rem)] leading-none font-semibold tracking-[-0.05em]">
                        {item.label}
                      </span>
                      <span className="text-eyebrow text-subtle">0{i + 1}</span>
                    </m.a>
                  </li>
                ))}
              </ul>
            </nav>

            <m.div
              className="space-y-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4, ease } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <a
                href={profile.resume.href}
                download={profile.resume.fileName}
                className="flex h-13 items-center justify-center gap-2 rounded-full bg-accent font-medium text-accent-ink"
              >
                Download resume <ArrowDownToLine className="size-4" aria-hidden />
              </a>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                {[socials.github, socials.linkedin].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-fg">
                    {s.label} <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                ))}
                <a href={socials.email.href} className="inline-flex items-center gap-1 text-muted hover:text-fg">
                  Email <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </div>
              <p className="text-eyebrow flex items-center justify-between text-subtle">
                <span>
                  {profile.city}, {profile.region}
                </span>
                <LocalTime withSeconds={false} />
              </p>
            </m.div>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
