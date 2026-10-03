import type { StaticImageData } from 'next/image';
import offerforgeShot from '@/assets/work/offerforge-landing.webp';
import syncflowShot from '@/assets/work/syncflow-landing.webp';
import { projectLinks } from './profile';

export type ProjectHighlight = { title: string; body: string };
export type ProjectMetric = { value: string; label: string };
export type ArchNode = { id: string; title: string; detail: string; tone?: 'accent' | 'muted' };

export type Project = {
  id: 'offerforge' | 'syncflow';
  index: string;
  name: string;
  kind: string;
  year: string;
  tagline: string;
  summary: string;
  live: string;
  code: string;
  host: string;
  screenshot: StaticImageData;
  screenshotAlt: string;
  /** Tall screenshots scroll inside the browser frame on hover. */
  scrollable: boolean;
  stack: string[];
  metrics: ProjectMetric[];
  highlights: ProjectHighlight[];
  architecture: { flow: ArchNode[]; stores: ArchNode[]; caption: string };
};

const links = Object.fromEntries(projectLinks.map((p) => [p.id, p]));

export const projects: Project[] = [
  {
    id: 'offerforge',
    index: '01',
    name: 'OfferForge AI',
    kind: 'Full-stack AI mock-interview platform',
    year: '2026',
    tagline: 'Structured mock interviews that feel like the real thing.',
    summary:
      'Pick a role and a level, and OfferForge runs a complete interview loop split into the same sections a real panel uses. Every answer is graded against its own section’s rubric, and the round ends with per-section scores, a hire call and a list of what to practise next.',
    live: links.offerforge.live,
    code: links.offerforge.code,
    host: 'offer-forge-ai.vercel.app',
    screenshot: offerforgeShot,
    screenshotAlt: 'OfferForge AI landing page: “Interviews that feel real.”',
    scrollable: true,
    stack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Gemini', 'OpenRouter', 'Vercel'],
    metrics: [
      { value: '7', label: 'role tracks' },
      { value: '3', label: 'seniority levels' },
      { value: '4', label: 'rubric criteria per answer' },
      { value: '0', label: 'made-up scores' },
    ],
    highlights: [
      {
        title: 'Structured interview loops',
        body: 'Role-specific rounds for 7 tracks, from SDE, frontend and backend to data, business analysis and product. Each one is an ordered set of sections such as DSA, system design, OOP, SQL and behavioral, with a fixed question count at entry, mid or senior level.',
      },
      {
        title: 'Rubric grading pipeline',
        body: 'A Gemini and OpenRouter pipeline scores every answer on a 4-criterion section rubric, then returns strengths, gaps, a model answer and a hire recommendation. If the model is down, it falls back to a curated question bank and marks answers “Not graded” instead of inventing a score.',
      },
      {
        title: 'Session integrity',
        body: 'JWT auth on MongoDB and a server-held question flow with atomic submit, skip and complete, plus a dashboard of per-section averages and score trends. The React/Vite client and the Express API both ship on Vercel.',
      },
    ],
    architecture: {
      caption: 'The server holds the pending question and claims it atomically, so a refresh can’t skip ahead and a double submit can’t grade an answer twice.',
      flow: [
        { id: 'client', title: 'React + Vite client', detail: 'Role picker · timed answers · dashboard' },
        { id: 'api', title: 'Express API', detail: 'JWT guard · atomic submit / skip / complete', tone: 'accent' },
        { id: 'ai', title: 'Gemini · OpenRouter', detail: '4-criterion rubric · debrief' },
      ],
      stores: [
        { id: 'mongo', title: 'MongoDB', detail: 'users · interviews · responses' },
        { id: 'bank', title: 'Curated question bank', detail: 'fallback when the model is down', tone: 'muted' },
      ],
    },
  },
  {
    id: 'syncflow',
    index: '02',
    name: 'SyncFlow',
    kind: 'Real-time collaborative workspace',
    year: '2026',
    tagline: 'The same sentence, on two screens, at once.',
    summary:
      'A multiplayer block editor. Sign in, write on the same page as other people, and the document stays in sync for everyone in the room, with live cursors, presence, rotatable share links and file sharing for members.',
    live: links.syncflow.live,
    code: links.syncflow.code,
    host: 'syncflow-sss.vercel.app',
    screenshot: syncflowShot,
    screenshotAlt: 'SyncFlow sign-in page: “The same sentence, on two screens, at once.”',
    scrollable: false,
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'BlockNote', 'Yjs', 'Socket.io', 'Express 5', 'Redis', 'MongoDB', 'JWT', 'Tailwind CSS 4'],
    metrics: [
      { value: '700ms', label: 'quiet period before a save' },
      { value: '30d', label: 'Redis TTL on live docs' },
      { value: '10MB', label: 'member-only upload cap' },
      { value: '1', label: 'JWT check on every join' },
    ],
    highlights: [
      {
        title: 'Real-time sync',
        body: 'A multiplayer block editor in Next.js 16, TypeScript and BlockNote. Concurrent edits merge through Yjs and broadcast over Socket.io, and the server verifies a JWT on every room join, admitting only the page owner or a collaborator.',
      },
      {
        title: 'Persistence that survives a reload',
        body: 'Live document state is written to Redis after a 700 ms quiet period with a 30-day TTL. Membership, share tokens and files live in MongoDB, so a reload restores the page exactly as everyone left it.',
      },
      {
        title: 'Sharing and access',
        body: 'Rotatable share links, email invites, live presence and member-only uploads capped at 10 MB on Express. The web app runs on Vercel, and the Socket.io API runs as a long-lived Node server.',
      },
    ],
    architecture: {
      caption: 'Edits are CRDT updates, so the server only relays and persists them. Merging happens identically on every client.',
      flow: [
        { id: 'client', title: 'Next.js + BlockNote', detail: 'Yjs doc · awareness cursors' },
        { id: 'socket', title: 'Socket.io room', detail: 'JWT on join-document · y-update relay', tone: 'accent' },
        { id: 'peers', title: 'Every peer in the room', detail: 'y-sync on join · live presence' },
      ],
      stores: [
        { id: 'redis', title: 'Redis', detail: 'ydoc:<id> · 700ms debounce · 30d TTL' },
        { id: 'mongo', title: 'MongoDB', detail: 'pages · members · share tokens · files' },
      ],
    },
  },
];
