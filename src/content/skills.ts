import {
  siCss,
  siDocker,
  siExpress,
  siFramer,
  siGit,
  siGithubactions,
  siGooglegemini,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siOpenrouter,
  siPostman,
  siReact,
  siRedis,
  siRender,
  siSocketdotio,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
  type BrandIconData,
} from '@/components/icons/brand-icons';

export type ProjectId = 'offerforge' | 'syncflow';
export type Skill = { name: string; icon?: BrandIconData; note?: string; usedIn?: ProjectId[] };
export type SkillGroup = {
  id: string;
  title: string;
  blurb: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    blurb: 'Interfaces that feel instant, from component architecture to motion.',
    skills: [
      { name: 'React', icon: siReact, usedIn: ['offerforge', 'syncflow'] },
      { name: 'Next.js', icon: siNextdotjs, usedIn: ['syncflow'] },
      { name: 'TypeScript', icon: siTypescript, usedIn: ['syncflow'] },
      { name: 'Tailwind CSS', icon: siTailwindcss, usedIn: ['offerforge', 'syncflow'] },
      { name: 'Framer Motion', icon: siFramer, usedIn: ['offerforge'] },
      { name: 'Vite', icon: siVite, usedIn: ['offerforge'] },
    ],
  },
  {
    id: 'realtime',
    title: 'Real-time',
    blurb: 'Rooms, presence and conflict-free merging over WebSockets.',
    skills: [
      { name: 'Socket.io', icon: siSocketdotio, usedIn: ['syncflow'] },
      { name: 'Yjs (CRDT)', usedIn: ['syncflow'] },
      { name: 'Live presence', usedIn: ['syncflow'] },
      { name: 'BlockNote', usedIn: ['syncflow'] },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    blurb: 'APIs that stay correct when requests race each other.',
    skills: [
      { name: 'Node.js', icon: siNodedotjs, usedIn: ['offerforge', 'syncflow'] },
      { name: 'Express.js', icon: siExpress, usedIn: ['offerforge', 'syncflow'] },
      { name: 'REST APIs', usedIn: ['offerforge', 'syncflow'] },
      { name: 'JWT auth', icon: siJsonwebtokens, usedIn: ['offerforge', 'syncflow'] },
      { name: 'Webhooks' },
      { name: 'Microservices' },
    ],
  },
  {
    id: 'data',
    title: 'Data',
    blurb: 'Choosing the right store for each kind of state.',
    skills: [
      { name: 'MongoDB', icon: siMongodb, usedIn: ['offerforge', 'syncflow'] },
      { name: 'Redis', icon: siRedis, usedIn: ['syncflow'] },
      { name: 'MySQL', icon: siMysql },
      { name: 'SQL' },
    ],
  },
  {
    id: 'ai',
    title: 'Applied AI',
    blurb: 'LLM pipelines with rubrics, guardrails and honest fallbacks.',
    skills: [
      { name: 'Gemini API', icon: siGooglegemini, usedIn: ['offerforge'] },
      { name: 'OpenRouter', icon: siOpenrouter, usedIn: ['offerforge'] },
      { name: 'Rubric evaluation', usedIn: ['offerforge'] },
      { name: 'Prompt-injection fencing', usedIn: ['offerforge'] },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud & tooling',
    blurb: 'Shipping and keeping it running.',
    skills: [
      { name: 'Docker', icon: siDocker, usedIn: ['syncflow'] },
      { name: 'Vercel', icon: siVercel, usedIn: ['offerforge', 'syncflow'] },
      { name: 'Render', icon: siRender, usedIn: ['offerforge', 'syncflow'] },
      { name: 'CI/CD', icon: siGithubactions },
      { name: 'Git', icon: siGit, usedIn: ['offerforge', 'syncflow'] },
      { name: 'Postman', icon: siPostman },
    ],
  },
];

export const languages: Skill[] = [
  { name: 'Java', icon: siOpenjdk },
  { name: 'TypeScript', icon: siTypescript, usedIn: ['syncflow'] },
  { name: 'JavaScript', icon: siJavascript, usedIn: ['offerforge'] },
  { name: 'SQL' },
  { name: 'HTML', icon: siHtml5, usedIn: ['offerforge', 'syncflow'] },
  { name: 'CSS', icon: siCss, usedIn: ['offerforge', 'syncflow'] },
];

export const fundamentals = [
  { name: 'Data Structures & Algorithms', note: '150+ problems solved' },
  { name: 'System Design', note: 'HLD / LLD' },
  { name: 'Database Management Systems' },
  { name: 'Operating Systems' },
  { name: 'Computer Networks' },
];

/** Marquee strip under the hero. */
export const marqueeItems = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Socket.io',
  'Yjs',
  'Redis',
  'MongoDB',
  'Express',
  'Tailwind CSS',
  'Gemini',
  'Docker',
  'Vercel',
  'Java',
  'SQL',
];
