import * as Y from 'yjs';

/**
 * A browser-only model of SyncFlow's sync layer: two Yjs clients and a room
 * that relays `y-update`s over a simulated socket with adjustable delay, using
 * the same event names, Redis key, 700 ms save debounce and 30-day TTL as the
 * real server. Reconnecting clients exchange state vectors, so edits made while
 * offline are merged instead of dropped.
 */

export type PeerId = 'asha' | 'you';
export type Endpoint = PeerId | 'room';

export const ROOM_ID = 'monday-notes';
export const LOCAL = 'local';
const REMOTE = 'remote';
const SAVE_DEBOUNCE_MS = 700;
const REDIS_TTL_S = 60 * 60 * 24 * 30;
const SETTLE_MS = 450;
const LOG_LIMIT = 40;

export const PEER_LABEL: Record<PeerId, string> = { asha: 'Asha', you: 'You' };

export type LogKind = 'join' | 'sync' | 'update' | 'presence' | 'save' | 'status';

export type LogEntry = {
  id: number;
  at: number;
  lastAt: number;
  kind: LogKind;
  author?: PeerId;
  route: string;
  event: string;
  detail?: string;
  bytes?: number;
  count: number;
};

export type Packet = { from: Endpoint; to: Endpoint; ms: number; author?: PeerId; heavy?: boolean };

export type SimSnapshot = {
  online: Record<PeerId, boolean>;
  live: Record<PeerId, boolean>;
  offlineEdits: Record<PeerId, boolean>;
  latency: number;
  log: readonly LogEntry[];
  settled: boolean;
  bytes: number;
  converged: boolean;
  lastSave: { at: number; bytes: number } | null;
};

class Peer {
  readonly doc = new Y.Doc();
  readonly text = this.doc.getText('notes');
  online = true;
  /** Joined the room and holding the server state. */
  live = false;
  /** Has received the document at least once. */
  synced = false;
  /** Bumped on every connect and disconnect so stale deliveries are dropped. */
  session = 0;
  offlineEdits = false;
  caret: Y.RelativePosition | null = null;
  readonly remote = new Map<PeerId, Y.RelativePosition>();

  constructor(readonly id: PeerId) {}
}

type Timer = ReturnType<typeof setTimeout>;

export class SyncSim {
  readonly peers: Record<PeerId, Peer> = { asha: new Peer('asha'), you: new Peer('you') };
  private readonly room = new Y.Doc();
  private readonly inRoom = new Set<PeerId>();
  private latency: number;
  private running = false;
  private t0 = 0;
  private seq = 0;
  private log: LogEntry[] = [];
  private inFlight = 0;
  private settled = false;
  private bytes = 0;
  private lastSave: SimSnapshot['lastSave'] = null;
  private readonly timers = new Set<Timer>();
  private saveTimer: Timer | undefined;
  private settleTimer: Timer | undefined;
  private frame = 0;
  private snapshot: SimSnapshot;
  private readonly listeners = new Set<() => void>();
  private readonly packetListeners = new Set<(packet: Packet) => void>();
  private readonly caretListeners = new Set<() => void>();

  constructor(seed: string, latency = 250) {
    this.latency = latency;
    this.room.getText('notes').insert(0, seed);
    for (const peer of this.list()) {
      peer.doc.on('update', (update: Uint8Array, origin: unknown) => {
        if (origin === LOCAL) this.sendUpdate(peer, update);
      });
    }
    this.snapshot = this.build();
  }

  // ---- lifecycle ---------------------------------------------------------

  start() {
    if (this.running) return;
    this.running = true;
    if (!this.t0) this.t0 = performance.now();
    const { asha, you } = this.peers;
    if (asha.online) this.connect(asha);
    if (you.online) this.after(320, () => you.online && !you.live && this.connect(you));
  }

  /** Cancels all traffic. `start()` reconnects both clients with their documents intact. */
  stop() {
    this.running = false;
    for (const t of this.timers) clearTimeout(t);
    this.timers.clear();
    clearTimeout(this.saveTimer);
    clearTimeout(this.settleTimer);
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.inFlight = 0;
    this.inRoom.clear();
    for (const peer of this.list()) {
      peer.session++;
      if (peer.live) peer.offlineEdits = true;
      peer.live = false;
      peer.remote.clear();
    }
  }

  // ---- external store ----------------------------------------------------

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.snapshot;

  onPacket(listener: (packet: Packet) => void) {
    this.packetListeners.add(listener);
    return () => {
      this.packetListeners.delete(listener);
    };
  }

  onCarets(listener: () => void) {
    this.caretListeners.add(listener);
    return () => {
      this.caretListeners.delete(listener);
    };
  }

  // ---- controls ----------------------------------------------------------

  setLatency(ms: number) {
    this.latency = ms;
    this.flush();
  }

  setOnline(id: PeerId, online: boolean) {
    const peer = this.peers[id];
    if (peer.online === online) return;
    peer.online = online;

    if (online) {
      if (this.running) this.connect(peer);
    } else {
      peer.session++;
      peer.live = false;
      peer.remote.clear();
      this.push({ kind: 'status', author: id, route: PEER_LABEL[id], event: 'disconnect', detail: 'edits stay local' });
      if (this.inRoom.delete(id)) {
        this.push({ kind: 'presence', route: 'room → all', event: 'presence', detail: `${this.inRoom.size} online` });
        for (const other of this.others(id)) {
          if (!this.inRoom.has(other.id)) continue;
          this.deliverQuietly(other, () => other.remote.delete(id));
        }
      }
      this.emitCarets();
    }
    this.flush();
  }

  /** Moves a client's caret; the room relays it like an awareness update. */
  setCaret(id: PeerId, index: number) {
    const peer = this.peers[id];
    const pos = Y.createRelativePositionFromTypeIndex(peer.text, index, -1);
    if (peer.caret && Y.compareRelativePositions(peer.caret, pos)) return;
    peer.caret = pos;
    this.sendCaret(peer);
    this.emitCarets();
  }

  /** Where `whose` caret sits inside `viewer`'s copy of the document, if `viewer` knows it yet. */
  caretIn(viewer: PeerId, whose: PeerId): number | null {
    const peer = this.peers[viewer];
    const pos = viewer === whose ? peer.caret : peer.remote.get(whose);
    if (!pos) return null;
    return Y.createAbsolutePositionFromRelativePosition(pos, peer.doc)?.index ?? null;
  }

  // ---- protocol ----------------------------------------------------------

  private connect(peer: Peer) {
    const session = ++peer.session;
    const name = PEER_LABEL[peer.id];
    this.push({ kind: 'join', author: peer.id, route: `${name} → room`, event: 'join-document', detail: ROOM_ID });

    this.transmit(peer.id, 'room', peer.id, 0, () => {
      if (peer.session !== session) return;
      this.inRoom.add(peer.id);
      this.push({ kind: 'presence', route: 'room → all', event: 'presence', detail: `${this.inRoom.size} online` });

      const state = Y.encodeStateAsUpdate(this.room);
      this.push({ kind: 'sync', author: peer.id, route: `room → ${name}`, event: 'y-sync', detail: 'full state', bytes: state.length });
      this.transmit(
        'room',
        peer.id,
        peer.id,
        state.length,
        () => {
          if (peer.session !== session) return;
          Y.applyUpdate(peer.doc, state, REMOTE);
          peer.live = true;
          peer.synced = true;
          if (peer.offlineEdits) {
            peer.offlineEdits = false;
            const missing = Y.encodeStateAsUpdate(peer.doc, Y.encodeStateVectorFromUpdate(state));
            this.sendUpdate(peer, missing, 'catch-up');
          }
          this.sendCaret(peer);
          this.emitCarets();
        },
        true,
      );
    });
  }

  private sendUpdate(peer: Peer, update: Uint8Array, detail?: string) {
    if (!peer.online || !peer.live) {
      peer.offlineEdits = true;
      this.changed();
      return;
    }
    const session = peer.session;
    this.push({ kind: 'update', author: peer.id, route: `${PEER_LABEL[peer.id]} → room`, event: 'y-update', detail, bytes: update.length });
    this.transmit(peer.id, 'room', peer.id, update.length, () => {
      if (peer.session !== session) {
        // The socket closed with this in flight; the state-vector catch-up resends it.
        peer.offlineEdits = true;
        return;
      }
      this.relay(peer.id, update);
    });
  }

  private relay(from: PeerId, update: Uint8Array) {
    Y.applyUpdate(this.room, update, from);
    for (const other of this.others(from)) {
      if (!this.inRoom.has(other.id)) continue;
      const session = other.session;
      this.push({ kind: 'update', author: from, route: `room → ${PEER_LABEL[other.id]}`, event: 'y-update', bytes: update.length });
      this.transmit('room', other.id, from, update.length, () => {
        if (other.session !== session) return;
        Y.applyUpdate(other.doc, update, REMOTE);
        this.emitCarets();
      });
    }
    this.scheduleSave();
  }

  private sendCaret(peer: Peer) {
    if (!peer.online || !peer.live || !peer.caret) return;
    const caret = peer.caret;
    const session = peer.session;
    this.after(this.delay(), () => {
      if (peer.session !== session) return;
      for (const other of this.others(peer.id)) {
        if (this.inRoom.has(other.id)) this.deliverQuietly(other, () => other.remote.set(peer.id, caret));
      }
    });
  }

  private deliverQuietly(to: Peer, apply: () => void) {
    const session = to.session;
    this.after(this.delay(), () => {
      if (to.session !== session) return;
      apply();
      this.emitCarets();
    });
  }

  private scheduleSave() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      if (!this.running) return;
      const state = Y.encodeStateAsUpdate(this.room);
      const bytes = 4 * Math.ceil(state.length / 3); // stored base64-encoded
      this.lastSave = { at: this.now(), bytes };
      this.push({ kind: 'save', route: 'room → Redis', event: `SET ydoc:${ROOM_ID}`, detail: `EX ${REDIS_TTL_S}`, bytes });
    }, SAVE_DEBOUNCE_MS);
  }

  // ---- transport ---------------------------------------------------------

  private transmit(from: Endpoint, to: Endpoint, author: PeerId | undefined, bytes: number, deliver: () => void, heavy = false) {
    const ms = this.delay();
    this.inFlight++;
    this.bytes += bytes;
    this.settled = false;
    clearTimeout(this.settleTimer);
    for (const listener of this.packetListeners) listener({ from, to, ms, author, heavy });
    this.after(ms, () => {
      this.inFlight--;
      deliver();
      if (this.inFlight === 0) {
        this.settleTimer = setTimeout(() => {
          this.settled = true;
          this.changed();
        }, SETTLE_MS);
      }
      this.changed();
    });
    this.changed();
  }

  private delay() {
    return this.latency === 0 ? 0 : Math.round(this.latency * (0.85 + Math.random() * 0.3));
  }

  private after(ms: number, fn: () => void) {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      if (this.running) fn();
    }, ms);
    this.timers.add(timer);
  }

  // ---- bookkeeping -------------------------------------------------------

  private push(entry: Omit<LogEntry, 'id' | 'at' | 'lastAt' | 'count'>) {
    const now = this.now();
    if (entry.kind === 'update' && !entry.detail) {
      // Keystrokes stream as one line per route while someone is typing.
      const i = this.log.findIndex((e, index) => index < 4 && e.kind === 'update' && !e.detail && e.route === entry.route && now - e.lastAt < 900);
      if (i !== -1) {
        const prev = this.log[i];
        const merged = { ...prev, lastAt: now, count: prev.count + 1, bytes: (prev.bytes ?? 0) + (entry.bytes ?? 0) };
        this.log = this.log.map((e, index) => (index === i ? merged : e));
        this.changed();
        return;
      }
    }
    this.log = [{ ...entry, id: ++this.seq, at: now, lastAt: now, count: 1 }, ...this.log].slice(0, LOG_LIMIT);
    this.changed();
  }

  private build(): SimSnapshot {
    const { asha, you } = this.peers;
    return {
      online: { asha: asha.online, you: you.online },
      live: { asha: asha.live, you: you.live },
      offlineEdits: { asha: asha.offlineEdits, you: you.offlineEdits },
      latency: this.latency,
      log: this.log,
      settled: this.settled,
      bytes: this.bytes,
      converged: asha.text.toString() === you.text.toString(),
      lastSave: this.lastSave,
    };
  }

  /** Coalesces store updates to one per frame. */
  private changed() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.flush();
    });
  }

  /** Publishes immediately, so controlled inputs never render a stale value. */
  private flush() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.snapshot = this.build();
    for (const listener of this.listeners) listener();
  }

  private emitCarets() {
    for (const listener of this.caretListeners) listener();
  }

  private list() {
    return [this.peers.asha, this.peers.you];
  }

  private others(id: PeerId) {
    return this.list().filter((peer) => peer.id !== id);
  }

  private now() {
    return this.t0 ? performance.now() - this.t0 : 0;
  }
}

// ---- scripted collaborator -------------------------------------------------

export type Step = { wait: number } | { type: string } | { erase: number };

function keyDelay(ch: string) {
  const base = 34 + Math.random() * 62;
  if (ch === '\n') return base + 260;
  if (/[.,:)]/.test(ch)) return base + 170;
  if (ch === ' ') return base + Math.random() * 70;
  return base;
}

/** Types a script into one client's document at that client's own caret. */
export class Typist {
  private readonly steps: Step[];
  private step = 0;
  private char = 0;
  private timer: Timer | undefined;
  private playing = false;
  private waiting = false;

  constructor(
    private readonly sim: SyncSim,
    private readonly id: PeerId,
    script: Step[],
  ) {
    this.steps = [...script];
  }

  play() {
    if (this.playing) return;
    this.playing = true;
    this.schedule(300);
  }

  pause() {
    this.playing = false;
    clearTimeout(this.timer);
  }

  enqueue(steps: Step[]) {
    this.steps.push(...steps);
    if (this.playing && this.waiting) this.schedule(0);
  }

  private schedule(ms: number) {
    this.waiting = false;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.tick(), ms);
  }

  private tick() {
    if (!this.playing) return;
    const peer = this.sim.peers[this.id];
    if (!peer.synced) return this.schedule(250);

    const step = this.steps[this.step];
    if (!step) {
      this.waiting = true;
      return;
    }
    if ('wait' in step) {
      this.step++;
      return this.schedule(step.wait);
    }

    if (peer.caret === null) this.sim.setCaret(this.id, peer.text.length);
    const at = this.sim.caretIn(this.id, this.id) ?? peer.text.length;

    if ('type' in step) {
      const ch = Array.from(step.type)[this.char];
      peer.doc.transact(() => peer.text.insert(at, ch), LOCAL);
      this.sim.setCaret(this.id, at + ch.length);
      if (++this.char >= Array.from(step.type).length) this.next();
      return this.schedule(keyDelay(ch));
    }

    if (at > 0) {
      peer.doc.transact(() => peer.text.delete(at - 1, 1), LOCAL);
      this.sim.setCaret(this.id, at - 1);
    }
    if (++this.char >= step.erase) this.next();
    this.schedule(60 + Math.random() * 45);
  }

  private next() {
    this.step++;
    this.char = 0;
  }
}
