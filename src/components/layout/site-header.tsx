'use client';

import { ArrowDownToLine, Command } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { navItems, profile } from '@/content/profile';
import { useActiveSection } from '@/hooks/use-active-section';
import { useModKey } from '@/hooks/use-platform';
import { useScrollTo } from '@/hooks/use-scroll-to';
import { useScrolled } from '@/hooks/use-scrolled';
import { cn } from '@/lib/utils';
import { usePalette } from '@/components/providers/palette-context';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MobileMenu } from './mobile-menu';

const island =
  'pointer-events-auto rounded-full border border-line bg-bg/65 shadow-soft backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color] duration-500';

export function SiteHeader() {
  const sectionIds = navItems.map((n) => n.id);
  const active = useActiveSection(sectionIds);
  const scrollTo = useScrollTo();
  const palette = usePalette();
  const mod = useModKey();
  const scrolled = useScrolled(24);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  const target = hovered ?? active;

  useLayoutEffect(() => {
    const pill = pillRef.current;
    const nav = navRef.current;
    if (!pill || !nav) return;
    const link = target ? nav.querySelector<HTMLElement>(`[data-nav="${target}"]`) : null;
    if (!link) {
      pill.style.opacity = '0';
      return;
    }
    pill.style.opacity = '1';
    pill.style.width = `${link.offsetWidth}px`;
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [target]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollTo(id);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="container-page relative z-50 flex items-center justify-between gap-3 pt-3 sm:pt-5">
        <a
          href="#top"
          onClick={(e) => go(e, 'top')}
          className={cn(island, 'group flex h-11 items-center gap-2.5 pr-4 pl-1.5', scrolled && 'bg-bg/80')}
          aria-label={`${profile.name}, back to top`}
        >
          <span className="relative grid size-8 place-items-center overflow-hidden rounded-full bg-fg text-[0.7rem] font-semibold tracking-tight text-bg">
            <span className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-8">LS</span>
            <span className="absolute translate-y-8 transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
              ↑
            </span>
          </span>
          <span className="text-sm font-medium tracking-tight">
            {profile.firstName}
            <span className="hidden xs:inline"> {profile.lastName}</span>
          </span>
        </a>

        <nav
          ref={navRef}
          aria-label="Primary"
          onMouseLeave={() => setHovered(null)}
          className={cn(island, 'relative hidden h-11 items-center px-1.5 md:flex', scrolled && 'bg-bg/80')}
        >
          <span
            ref={pillRef}
            aria-hidden
            className="absolute top-1.5 left-0 h-8 rounded-full bg-fg/8 opacity-0 ring-1 ring-line transition-[transform,width,opacity] duration-500 ease-out-expo"
          />
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-nav={item.id}
              onClick={(e) => go(e, item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onFocus={() => setHovered(item.id)}
              onBlur={() => setHovered(null)}
              aria-current={active === item.id ? 'true' : undefined}
              className={cn(
                'relative z-10 inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-sm transition-colors duration-300',
                active === item.id ? 'text-fg' : 'text-muted hover:text-fg',
              )}
            >
              {active === item.id ? <span className="size-1.5 rounded-full bg-accent" aria-hidden /> : null}
              {item.label}
            </a>
          ))}
        </nav>

        <div className={cn(island, 'flex h-11 items-center gap-0.5 px-1', scrolled && 'bg-bg/80')}>
          <button
            type="button"
            onClick={palette.open}
            className="hidden h-9 items-center gap-2 rounded-full pr-2 pl-3 text-sm text-muted transition-colors hover:bg-fg/6 hover:text-fg sm:inline-flex"
            aria-label="Open command menu"
            aria-keyshortcuts="Meta+K Control+K"
          >
            <Command className="size-3.5" aria-hidden />
            <span className="font-mono text-[0.7rem] tracking-wide">{mod === '⌘' ? '⌘K' : 'Ctrl K'}</span>
          </button>
          <ThemeToggle />
          <a
            href={profile.resume.href}
            download={profile.resume.fileName}
            className="ml-0.5 hidden h-9 items-center gap-1.5 rounded-full bg-fg px-4 text-sm font-medium text-bg transition-[background-color,transform] duration-300 hover:bg-accent hover:text-accent-ink active:scale-95 sm:inline-flex"
          >
            Résumé
            <ArrowDownToLine className="size-3.5" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="relative inline-flex size-9 items-center justify-center rounded-full text-fg transition-colors hover:bg-fg/6 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span
              aria-hidden
              className={cn(
                'absolute h-[1.5px] w-4 rounded-full bg-current transition-transform duration-500 ease-out-expo',
                menuOpen ? 'rotate-45' : '-translate-y-[3.5px]',
              )}
            />
            <span
              aria-hidden
              className={cn(
                'absolute h-[1.5px] w-4 rounded-full bg-current transition-transform duration-500 ease-out-expo',
                menuOpen ? '-rotate-45' : 'translate-y-[3.5px]',
              )}
            />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onNavigate={go} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
