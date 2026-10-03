'use client';

import { RotateCcw, Unplug } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type Ref } from 'react';
import * as Y from 'yjs';
import { siRedis, siSocketdotio } from '@/components/icons/brand-icons';
import { BrandIcon } from '@/components/ui/brand-icon';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { LOCAL, ROOM_ID, SyncSim, Typist, type LogEntry, type Packet, type PeerId, type SimSnapshot, type Step } from './engine';
import { PANE_HEIGHT, STAGE_GRID } from './layout';

const SEED = 'Monday notes · sprint 14\n\n- Rotate share links when a member leaves';

const SCRIPT: Step[] = [
  { wait: 1100 },
  { type: '\n- Debounce Redis saves (700 ms quiet)' },
  { wait: 600 },
  { type: '\n- Fix caret jitter on slow netowrks' },
  { wait: 450 },
  { erase: 8 },
  { wait: 180 },
  { type: 'networks' },
  { wait: 1300 },
  { type: '\n\nYour turn: type anywhere, even on my line.' },
];

const REPLY: Step[] = [{ wait: 1500 }, { type: '\nI can see your cursor, by the way.' }];

/** Caret colours on the paper, which stays light in both themes. */
const INK: Record<PeerId, string> = { asha: '#db2777', you: '#16a34a' };

type Mark = { index: number | null; name: string; color: string; self?: boolean };

/** Renders text with zero-width caret markers; the trailing ZWSP keeps a final empty line measurable. */
function paint(el: HTMLElement, text: string, marks: Mark[]) {
  const placed = marks
    .filter((m): m is Mark & { index: number } => m.index !== null)
    .map((m) => ({ ...m, index: Math.min(m.index, text.length) }))
    .sort((a, b) => a.index - b.index);
  const frag = document.createDocumentFragment();
  let from = 0;
  for (const m of placed) {
    if (m.index > from) frag.append(text.slice(from, m.index));
    const caret = document.createElement('span');
    caret.className = 'caret';
    caret.setAttribute('aria-hidden', 'true');
    caret.dataset.name = m.name;
    if (m.self) caret.dataset.self = '';
    caret.style.setProperty('--c', m.color);
    frag.append(caret);
    from = m.index;
  }
  frag.append(`${text.slice(from)}\u200b`);
  el.replaceChildren(frag);
}

/** Smallest single splice that turns `a` into `b`, never splitting a surrogate pair. */
function diff(a: string, b: string) {
  if (a === b) return null;
  let start = 0;
  const max = Math.min(a.length, b.length);
  while (start < max && a.charCodeAt(start) === b.charCodeAt(start)) start++;
  if (start > 0 && /[\uD800-\uDBFF]/.test(a[start - 1])) start--;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a.charCodeAt(endA - 1) === b.charCodeAt(endB - 1)) {
    endA--;
    endB--;
  }
  if (endA < a.length && /[\uDC00-\uDFFF]/.test(a[endA])) {
    endA++;
    endB++;
  }
  return { index: start, remove: endA - start, insert: b.slice(start, endB) };
}

const head = (ta: HTMLTextAreaElement) => (ta.selectionDirection === 'backward' ? ta.selectionStart : ta.selectionEnd);

const formatBytes = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);
const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

function describe(s: SimSnapshot): { tone: 'ok' | 'busy' | 'warn' | 'idle'; text: string } {
  if (!s.online.asha || !s.online.you) {
    return s.converged ? { tone: 'idle', text: 'Offline · nothing to merge yet' } : { tone: 'warn', text: 'Diverged · reconnect to merge' };
  }
  if (!s.live.asha || !s.live.you) return { tone: 'busy', text: 'Joining the room…' };
  if (!s.settled || !s.converged) return { tone: 'busy', text: 'Syncing…' };
  return { tone: 'ok', text: 'In sync · identical on both screens' };
}

const toneDot = { ok: 'bg-emerald-500 dark:bg-emerald-400', busy: 'bg-amber-500 dark:bg-amber-400', warn: 'bg-accent', idle: 'bg-subtle' };

export default function SyncDemo() {
  const [sim, setSim] = useState(() => new SyncSim(SEED));
  const snap = useSyncExternalStore(sim.subscribe, sim.getSnapshot, sim.getSnapshot);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const ashaRef = useRef<HTMLDivElement>(null);
  const youRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const leftWireRef = useRef<HTMLDivElement>(null);
  const rightWireRef = useRef<HTMLDivElement>(null);

  // Join and let Asha type only while the demo is on screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const typist = new Typist(sim, 'asha', SCRIPT);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sim.start();
          typist.play();
        } else {
          typist.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(root);

    const you = sim.peers.you;
    const onFirstEdit = (_update: Uint8Array, origin: unknown) => {
      if (origin !== LOCAL) return;
      you.doc.off('update', onFirstEdit);
      typist.enqueue(REPLY);
    };
    you.doc.on('update', onFirstEdit);

    return () => {
      io.disconnect();
      typist.pause();
      you.doc.off('update', onFirstEdit);
      sim.stop();
    };
  }, [sim]);

  // Two-way binding between the textarea and its Y.Text, plus caret overlays.
  useEffect(() => {
    const ta = youRef.current;
    const mirror = mirrorRef.current;
    const ashaView = ashaRef.current;
    if (!ta || !mirror || !ashaView) return;
    const you = sim.peers.you;
    const asha = sim.peers.asha;

    ta.value = you.text.toString();
    let prev = ta.value;
    let saved: { start: Y.RelativePosition; end: Y.RelativePosition; dir: HTMLTextAreaElement['selectionDirection'] } | null = null;
    let frame = 0;

    const render = () => {
      frame = 0;
      paint(mirror, ta.value, [{ index: sim.caretIn('you', 'asha'), name: 'Asha', color: INK.asha }]);
      mirror.scrollTop = ta.scrollTop;
      paint(ashaView, asha.text.toString(), [
        { index: sim.caretIn('asha', 'asha'), name: 'Asha', color: INK.asha, self: true },
        { index: sim.caretIn('asha', 'you'), name: 'You', color: INK.you },
      ]);
      const own = ashaView.querySelector<HTMLElement>('[data-self]');
      if (own) {
        const top = own.offsetTop;
        const pad = 28;
        if (top < ashaView.scrollTop + pad) ashaView.scrollTop = top - pad;
        else if (top > ashaView.scrollTop + ashaView.clientHeight - pad * 2) ashaView.scrollTop = top - ashaView.clientHeight + pad * 2;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    // Remember the selection as Yjs positions before a remote change lands, then restore it.
    const beforeTransaction = (tr: Y.Transaction) => {
      saved =
        tr.origin !== LOCAL && document.activeElement === ta
          ? {
              start: Y.createRelativePositionFromTypeIndex(you.text, ta.selectionStart, ta.selectionStart === ta.selectionEnd ? -1 : 0),
              end: Y.createRelativePositionFromTypeIndex(you.text, ta.selectionEnd, -1),
              dir: ta.selectionDirection,
            }
          : null;
    };
    const onText = (_event: Y.YTextEvent, tr: Y.Transaction) => {
      if (tr.origin !== LOCAL) {
        const value = you.text.toString();
        if (value !== ta.value) {
          ta.value = value;
          prev = value;
          if (saved) {
            const start = Y.createAbsolutePositionFromRelativePosition(saved.start, you.doc)?.index ?? value.length;
            const end = Y.createAbsolutePositionFromRelativePosition(saved.end, you.doc)?.index ?? start;
            ta.setSelectionRange(Math.min(start, end), Math.max(start, end), saved.dir);
          }
        }
      }
      schedule();
    };
    const onInput = () => {
      const next = ta.value;
      const change = diff(prev, next);
      prev = next;
      if (change) {
        you.doc.transact(() => {
          if (change.remove) you.text.delete(change.index, change.remove);
          if (change.insert) you.text.insert(change.index, change.insert);
        }, LOCAL);
      }
      sim.setCaret('you', head(ta));
    };
    const onSelection = () => {
      if (document.activeElement === ta) sim.setCaret('you', head(ta));
    };
    const onScroll = () => {
      mirror.scrollTop = ta.scrollTop;
    };

    you.doc.on('beforeTransaction', beforeTransaction);
    you.text.observe(onText);
    asha.text.observe(schedule);
    const offCarets = sim.onCarets(schedule);
    ta.addEventListener('input', onInput);
    ta.addEventListener('focus', onSelection);
    ta.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('selectionchange', onSelection);
    const resize = new ResizeObserver(schedule);
    resize.observe(ta);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      you.doc.off('beforeTransaction', beforeTransaction);
      you.text.unobserve(onText);
      asha.text.unobserve(schedule);
      offCarets();
      ta.removeEventListener('input', onInput);
      ta.removeEventListener('focus', onSelection);
      ta.removeEventListener('scroll', onScroll);
      document.removeEventListener('selectionchange', onSelection);
      resize.disconnect();
    };
  }, [sim]);

  // Packets ride the wires for as long as the simulated hop takes.
  useEffect(() => {
    if (reduce) return;
    return sim.onPacket((p: Packet) => {
      if (p.ms < 60) return;
      const left = p.from === 'asha' || p.to === 'asha';
      const wire = left ? leftWireRef.current : rightWireRef.current;
      if (!wire || wire.offsetParent === null) return;
      const forward = p.from === 'asha' || p.to === 'you';
      const length = wire.clientWidth;
      const dot = document.createElement('span');
      dot.className = 'sync-packet';
      dot.style.setProperty('--c', p.author ? INK[p.author] : 'var(--accent)');
      if (p.heavy) dot.style.scale = '1.45';
      wire.append(dot);
      const animation = dot.animate(
        [{ transform: `translate3d(${forward ? 0 : length}px,0,0)` }, { transform: `translate3d(${forward ? length : 0}px,0,0)` }],
        { duration: p.ms, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
      );
      animation.onfinish = () => dot.remove();
      animation.oncancel = () => dot.remove();
    });
  }, [sim, reduce]);

  const status = describe(snap);

  return (
    <div ref={rootRef}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line px-4 py-3.5 sm:px-6">
        <p className="flex items-center gap-2.5 text-sm font-medium">
          <span className="relative flex size-2" aria-hidden>
            {status.tone === 'busy' ? <span className={cn('animate-pulse-ring absolute inset-0 rounded-full', toneDot.busy)} /> : null}
            <span className={cn('relative size-2 rounded-full transition-colors', toneDot[status.tone])} />
          </span>
          {status.text}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <label className="flex items-center gap-3 text-sm text-muted">
            <span className="whitespace-nowrap">Network delay</span>
            <input
              type="range"
              min={0}
              max={2000}
              step={50}
              value={snap.latency}
              onChange={(e) => sim.setLatency(Number(e.target.value))}
              aria-valuetext={`${snap.latency} milliseconds each way`}
              className="range w-28 sm:w-36"
              style={{ '--p': `${snap.latency / 20}%` } as React.CSSProperties}
            />
            <span className="w-14 font-mono text-xs text-fg tabular-nums">{snap.latency} ms</span>
          </label>
          <button
            type="button"
            onClick={() => setSim(new SyncSim(SEED, snap.latency))}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line-strong px-3 text-[0.8125rem] text-muted transition-colors hover:border-fg/30 hover:text-fg"
          >
            <RotateCcw className="size-3.5" aria-hidden /> Reset
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Asha is ${snap.online.asha ? 'online' : 'offline'}. You are ${snap.online.you ? 'online' : 'offline'}.`}
      </p>

      <div className={STAGE_GRID}>
        <Client
          id="asha"
          title="Asha’s screen"
          snap={snap}
          onToggle={(next) => sim.setOnline('asha', next)}
        >
          <div
            ref={ashaRef}
            role="textbox"
            aria-readonly="true"
            aria-multiline="true"
            aria-label="Asha’s copy of Monday notes"
            tabIndex={0}
            data-lenis-prevent
            className="paper-text scrollbar-none absolute inset-0 overflow-y-auto p-5 outline-none"
          />
        </Client>

        <WireTrack wireRef={leftWireRef} cut={!snap.online.asha} />

        <div className="flex min-w-0 flex-col max-lg:order-last">
          <div className="mb-2.5 flex h-10 items-center justify-between gap-3 px-1">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line-strong bg-surface-2">
                <BrandIcon icon={siSocketdotio} className="size-3.5" />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium">Socket.io room</p>
                <p className="truncate font-mono text-[0.68rem] text-subtle">ydoc:{ROOM_ID}</p>
              </div>
            </div>
            <p className="shrink-0 font-mono text-[0.68rem] text-subtle">{formatBytes(snap.bytes)} of updates</p>
          </div>
          <div className={cn('flex flex-col overflow-hidden rounded-2xl border border-line bg-bg/70', PANE_HEIGHT)}>
            <ol
              role="log"
              aria-live="off"
              aria-label="Sync events, newest first"
              tabIndex={0}
              data-lenis-prevent
              className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5 font-mono text-[0.68rem] leading-snug outline-none"
            >
              {snap.log.map((entry) => (
                <LogRow key={entry.id} entry={entry} />
              ))}
            </ol>
            <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-2.5 font-mono text-[0.65rem] text-subtle">
              <span className="flex min-w-0 items-center gap-1.5">
                <BrandIcon icon={siRedis} className="size-3 text-[#ff4438]" />
                <span className="truncate">
                  {snap.lastSave
                    ? `${formatBytes(snap.lastSave.bytes)} saved at ${formatTime(snap.lastSave.at)}`
                    : 'saves after 700 ms of quiet'}
                </span>
              </span>
              <span className="shrink-0">TTL 30d</span>
            </div>
          </div>
        </div>

        <WireTrack wireRef={rightWireRef} cut={!snap.online.you} />

        <Client id="you" title="Your screen" snap={snap} onToggle={(next) => sim.setOnline('you', next)}>
          <div ref={mirrorRef} aria-hidden className="paper-text scrollbar-none pointer-events-none absolute inset-0 overflow-hidden p-5 text-transparent" />
          <textarea
            ref={youRef}
            data-lenis-prevent
            spellCheck={false}
            maxLength={1500}
            aria-label="Your copy of Monday notes. Anything you type syncs to Asha."
            placeholder={snap.live.you ? 'Start typing…' : 'Joining the room…'}
            className="paper-text scrollbar-none absolute inset-0 size-full resize-none bg-transparent p-5 text-[var(--ink)] caret-[#16a34a] outline-none placeholder:text-[var(--ink-muted)]"
          />
        </Client>
      </div>
    </div>
  );
}

function Client({
  id,
  title,
  snap,
  onToggle,
  children,
}: {
  id: PeerId;
  title: string;
  snap: SimSnapshot;
  onToggle: (next: boolean) => void;
  children: ReactNode;
}) {
  const online = snap.online[id];
  const state = !online ? (snap.offlineEdits[id] ? 'Offline · edits kept locally' : 'Offline') : snap.live[id] ? 'Live' : 'Joining…';
  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-2.5 flex h-10 items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="grid size-7 shrink-0 place-items-center rounded-full text-[0.7rem] font-semibold text-white"
            style={{ backgroundColor: INK[id] }}
            aria-hidden
          >
            {id === 'asha' ? 'A' : 'Y'}
          </span>
          <p className="truncate text-sm font-medium">{title}</p>
        </div>
        <Switch checked={online} onCheckedChange={onToggle} className="shrink-0">
          <span className="sr-only">{id === 'asha' ? 'Asha' : 'You'}: </span>
          Online
        </Switch>
      </div>
      <div
        className={cn(
          'paper relative flex flex-col overflow-hidden rounded-2xl shadow-soft ring-1 ring-black/5 transition-[opacity] duration-300 focus-within:ring-2 focus-within:ring-accent',
          PANE_HEIGHT,
          !online && 'opacity-85',
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-2 text-[0.7rem] text-[var(--ink-muted)]">
          <span className="font-medium text-[var(--ink)]">Monday notes</span>
          <span className={cn('flex items-center gap-1.5', !online && 'text-[#c2410c]')}>
            <span className={cn('size-1.5 rounded-full', online ? (snap.live[id] ? 'bg-[#16a34a]' : 'bg-[#d97706]') : 'bg-[#c2410c]')} aria-hidden />
            {state}
          </span>
        </div>
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function WireTrack({ wireRef, cut }: { wireRef: Ref<HTMLDivElement>; cut: boolean }) {
  return (
    <div aria-hidden className="relative hidden pt-[3.125rem] lg:flex lg:flex-col">
      <div className="flex flex-1 items-center">
        <div ref={wireRef} className="relative mx-1 h-0 w-full">
          <span
            className={cn(
              'absolute inset-x-0 -top-px border-t border-dashed transition-colors duration-300',
              cut ? 'border-line' : 'border-line-strong',
            )}
          />
          {cut ? (
            <span className="absolute top-0 left-1/2 grid size-6 -translate-1/2 place-items-center rounded-full border border-line-strong bg-surface text-accent-text">
              <Unplug className="size-3" />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LogRow({ entry }: { entry: LogEntry }) {
  return (
    <li className="log-in grid grid-cols-[2.6rem_minmax(0,1fr)_auto] items-baseline gap-2 rounded-md px-2 py-[5px]">
      <span className="text-subtle tabular-nums">{formatTime(entry.at)}</span>
      <span className="min-w-0 break-words">
        <span className={entry.author ? undefined : 'text-muted'} style={entry.author ? { color: `var(--peer-${entry.author})` } : undefined}>
          {entry.route}
        </span>{' '}
        <span className={entry.kind === 'save' ? 'text-accent-text' : 'text-fg'}>{entry.event}</span>
        {entry.count > 1 ? <span className="text-subtle"> ×{entry.count}</span> : null}
        {entry.detail ? <span className="text-subtle"> · {entry.detail}</span> : null}
      </span>
      <span className="text-subtle tabular-nums">{entry.bytes ? formatBytes(entry.bytes) : ''}</span>
    </li>
  );
}
