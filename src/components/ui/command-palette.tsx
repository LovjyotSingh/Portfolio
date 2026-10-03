'use client';

import { useLenis } from 'lenis/react';
import {
  ArrowDownToLine,
  ArrowUpRight,
  AtSign,
  Code2,
  CornerDownLeft,
  Copy,
  Home,
  Layers,
  Mail,
  MousePointer2,
  Phone,
  Search,
  SunMoon,
  User,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { useEffect, useEffectEvent, useId, useRef, useState, type ReactNode } from 'react';
import { siGithub, siLinkedin } from '@/components/icons/brand-icons';
import { usePalette } from '@/components/providers/palette-context';
import { profile, projectLinks, socials } from '@/content/profile';
import { useScrollTo } from '@/hooks/use-scroll-to';
import { readTheme, switchTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { BrandIcon } from './brand-icon';
import { Kbd } from './kbd';

type Group = 'Navigate' | 'Actions' | 'Links';
type Command = {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  keywords?: string;
  icon: ReactNode;
  run: () => void;
};

const iconCls = 'size-4';

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
}

export function CommandPalette() {
  const { isOpen, open, close, toggle } = usePalette();

  const onShortcut = useEffectEvent((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggle();
    } else if (e.key === '/' && !isOpen && !isTypingTarget(e.target)) {
      e.preventDefault();
      open();
    }
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => onShortcut(e);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return <AnimatePresence>{isOpen ? <PalettePanel onClose={close} /> : null}</AnimatePresence>;
}

function PalettePanel({ onClose }: { onClose: () => void }) {
  const lenis = useLenis();
  const scrollTo = useScrollTo();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lenis?.stop();
    inputRef.current?.focus({ preventScroll: true });
    return () => {
      lenis?.start();
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [lenis]);

  const navigate = (id: string) => {
    onClose();
    window.setTimeout(() => scrollTo(id), 40);
  };
  const openExternal = (href: string) => {
    onClose();
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const commands: Command[] = [
    { id: 'nav-top', group: 'Navigate', label: 'Home', keywords: 'top hero start', icon: <Home className={iconCls} />, run: () => navigate('top') },
    { id: 'nav-work', group: 'Navigate', label: 'Selected work', keywords: 'projects portfolio', icon: <Layers className={iconCls} />, run: () => navigate('work') },
    { id: 'nav-offerforge', group: 'Navigate', label: 'OfferForge AI', hint: 'Case study', keywords: 'ai interview project gemini', icon: <Sparkles className={iconCls} />, run: () => navigate('offerforge') },
    { id: 'nav-syncflow', group: 'Navigate', label: 'SyncFlow', hint: 'Case study', keywords: 'realtime collaborative editor yjs project', icon: <Workflow className={iconCls} />, run: () => navigate('syncflow') },
    { id: 'nav-crdt', group: 'Navigate', label: 'Try the live CRDT demo', keywords: 'yjs sync demo play type', icon: <MousePointer2 className={iconCls} />, run: () => navigate('syncflow-demo') },
    { id: 'nav-grader', group: 'Navigate', label: 'Try the grading engine', keywords: 'rubric score demo offerforge', icon: <MousePointer2 className={iconCls} />, run: () => navigate('offerforge-demo') },
    { id: 'nav-about', group: 'Navigate', label: 'About', keywords: 'education bio story', icon: <User className={iconCls} />, run: () => navigate('about') },
    { id: 'nav-stack', group: 'Navigate', label: 'Stack & skills', keywords: 'skills technologies tools', icon: <Code2 className={iconCls} />, run: () => navigate('stack') },
    { id: 'nav-contact', group: 'Navigate', label: 'Contact', keywords: 'hire email reach', icon: <Mail className={iconCls} />, run: () => navigate('contact') },
    {
      id: 'act-copy',
      group: 'Actions',
      label: 'Copy email address',
      hint: profile.email,
      keywords: 'clipboard mail',
      icon: <Copy className={iconCls} />,
      run: () => {
        navigator.clipboard?.writeText(profile.email).catch(() => undefined);
        setFlash('act-copy');
        window.setTimeout(onClose, 650);
      },
    },
    {
      id: 'act-resume',
      group: 'Actions',
      label: 'Download résumé',
      hint: 'PDF',
      keywords: 'cv resume pdf',
      icon: <ArrowDownToLine className={iconCls} />,
      run: () => {
        const a = document.createElement('a');
        a.href = profile.resume.href;
        a.download = profile.resume.fileName;
        a.click();
        onClose();
      },
    },
    {
      id: 'act-theme',
      group: 'Actions',
      label: 'Switch theme',
      hint: 'Light / dark',
      keywords: 'dark light mode appearance',
      icon: <SunMoon className={iconCls} />,
      run: () => {
        onClose();
        window.setTimeout(() => switchTheme(readTheme() === 'dark' ? 'light' : 'dark'), 120);
      },
    },
    { id: 'act-mail', group: 'Actions', label: 'Write an email', hint: profile.email, keywords: 'contact message', icon: <AtSign className={iconCls} />, run: () => { onClose(); window.location.href = socials.email.href; } },
    { id: 'act-call', group: 'Actions', label: 'Call', hint: profile.phoneDisplay, keywords: 'phone mobile', icon: <Phone className={iconCls} />, run: () => { onClose(); window.location.href = profile.phoneHref; } },
    { id: 'link-github', group: 'Links', label: 'GitHub', hint: socials.github.handle, keywords: 'code repos', icon: <BrandIcon icon={siGithub} className={iconCls} />, run: () => openExternal(socials.github.href) },
    { id: 'link-linkedin', group: 'Links', label: 'LinkedIn', hint: socials.linkedin.handle, keywords: 'profile network', icon: <BrandIcon icon={siLinkedin} className={iconCls} />, run: () => openExternal(socials.linkedin.href) },
    ...projectLinks.flatMap((p) => [
      { id: `link-${p.id}-live`, group: 'Links' as const, label: `${p.name}: live site`, hint: p.live.replace('https://', ''), keywords: 'demo open app', icon: <ArrowUpRight className={iconCls} />, run: () => openExternal(p.live) },
      { id: `link-${p.id}-code`, group: 'Links' as const, label: `${p.name}: source code`, hint: 'GitHub', keywords: 'repo repository', icon: <BrandIcon icon={siGithub} className={iconCls} />, run: () => openExternal(p.code) },
    ]),
  ];

  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = tokens.length
    ? commands
        .map((c) => {
          const label = c.label.toLowerCase();
          const hay = `${label} ${c.keywords ?? ''} ${c.hint ?? ''} ${c.group}`.toLowerCase();
          if (!tokens.every((t) => hay.includes(t))) return null;
          const score = (label.startsWith(tokens[0]) ? 2 : 0) + (label.includes(tokens[0]) ? 1 : 0);
          return { c, score };
        })
        .filter((r): r is { c: Command; score: number } => r !== null)
        .sort((a, b) => b.score - a.score)
        .map((r) => r.c)
    : commands;

  const current = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${current}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [current]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
      e.preventDefault();
      setActive((current + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
      e.preventDefault();
      setActive((current - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      results[current]?.run();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[80]" data-lenis-prevent>
      <m.div
        className="absolute inset-0 bg-[rgb(8_6_4/0.55)] backdrop-blur-[6px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.18 } }}
        onClick={onClose}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-[10vh] flex justify-center px-4 sm:top-[14vh]">
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label="Command menu"
          className="pointer-events-auto w-full max-w-[620px] overflow-hidden rounded-2xl border border-line-strong bg-surface/95 shadow-float backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 420, damping: 32 } }}
          exit={{ opacity: 0, scale: 0.97, y: -6, transition: { duration: 0.16 } }}
          onKeyDown={onKeyDown}
        >
          <div className="flex items-center gap-3 border-b border-line px-4">
            <Search className="size-4 text-subtle" aria-hidden />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              placeholder="Jump to a section, copy email, open a project…"
              className="h-14 flex-1 bg-transparent text-[0.95rem] text-fg outline-none placeholder:text-subtle"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={results[current] ? `${listId}-${results[current].id}` : undefined}
              aria-autocomplete="list"
              autoComplete="off"
              spellCheck={false}
            />
            <Kbd>esc</Kbd>
          </div>

          <div ref={listRef} id={listId} role="listbox" aria-label="Commands" className="max-h-[min(420px,56vh)] overflow-y-auto overscroll-contain p-2">
            {results.length === 0 ? (
              <p className="px-3 py-10 text-center text-sm text-muted">
                Nothing matches “{query}”. Try <span className="text-fg">work</span>, <span className="text-fg">email</span> or{' '}
                <span className="text-fg">github</span>.
              </p>
            ) : (
              results.map((c, i) => {
                const header = i === 0 || results[i - 1].group !== c.group ? c.group : null;
                const selected = i === current;
                return (
                  <div key={c.id}>
                    {header ? <p className="text-eyebrow px-3 pt-3 pb-2 text-subtle">{header}</p> : null}
                    <div
                      id={`${listId}-${c.id}`}
                      role="option"
                      aria-selected={selected}
                      data-index={i}
                      onPointerMove={() => setActive(i)}
                      onClick={() => c.run()}
                      className={cn(
                        'flex h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm transition-colors duration-150',
                        selected ? 'bg-fg/[0.07] text-fg' : 'text-muted',
                      )}
                    >
                      <span className={cn('grid size-7 place-items-center rounded-lg border border-line bg-bg/50', selected && 'border-line-strong text-accent-text')}>
                        {c.icon}
                      </span>
                      <span className="flex-1 truncate">{c.label}</span>
                      {flash === c.id ? (
                        <span className="text-xs text-accent-text">Copied</span>
                      ) : c.hint ? (
                        <span className="hidden truncate font-mono text-[0.7rem] text-subtle sm:block">{c.hint}</span>
                      ) : null}
                      {selected ? <CornerDownLeft className="size-3.5 text-subtle" aria-hidden /> : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5 text-[0.7rem] text-subtle">
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> navigate <Kbd className="ml-2">↵</Kbd> select
            </span>
            <span className="font-mono">{profile.name.toLowerCase().replace(' ', '.')}</span>
          </div>
        </m.div>
      </div>
    </div>
  );
}
