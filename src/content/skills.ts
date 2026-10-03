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

export type Skill = { name: string; icon?: BrandIconData; note?: string };
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
      { name: 'React', icon: siReact },
      { name: 'Next.js', icon: siNextdotjs },
      { name: 'TypeScript', icon: siTypescript },
      { name: 'Tailwind CSS', icon: siTailwindcss },
      { name: 'Framer Motion', icon: siFramer },
      { name: 'Vite', icon: siVite },
    ],
  },
  {
    id: 'realtime',
    title: 'Real-time',
    blurb: 'Rooms, presence and conflict-free merging over WebSockets.',
    skills: [
      { name: 'Socket.io', icon: siSocketdotio },
      { name: 'Yjs (CRDT)' },
      { name: 'Live presence' },
      { name: 'BlockNote' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    blurb: 'APIs that stay correct when requests race each other.',
    skills: [
      { name: 'Node.js', icon: siNodedotjs },
      { name: 'Express.js', icon: siExpress },
      { name: 'REST APIs' },
      { name: 'JWT auth', icon: siJsonwebtokens },
      { name: 'Webhooks' },
      { name: 'Microservices' },
    ],
  },
  {
    id: 'data',
    title: 'Data',
    blurb: 'Choosing the right store for each kind of state.',
    skills: [
      { name: 'MongoDB', icon: siMongodb },
      { name: 'Redis', icon: siRedis },
      { name: 'MySQL', icon: siMysql },
      { name: 'SQL' },
    ],
  },
  {
    id: 'ai',
    title: 'Applied AI',
    blurb: 'LLM pipelines with rubrics, guardrails and honest fallbacks.',
    skills: [
      { name: 'Gemini API', icon: siGooglegemini },
      { name: 'OpenRouter', icon: siOpenrouter },
      { name: 'Rubric evaluation' },
      { name: 'Prompt-injection fencing' },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud & tooling',
    blurb: 'Shipping and keeping it running.',
    skills: [
      { name: 'Docker', icon: siDocker },
      { name: 'Vercel', icon: siVercel },
      { name: 'Render', icon: siRender },
      { name: 'CI/CD', icon: siGithubactions },
      { name: 'Git', icon: siGit },
      { name: 'Postman', icon: siPostman },
    ],
  },
];

export const languages: Skill[] = [
  { name: 'Java', icon: siOpenjdk },
  { name: 'TypeScript', icon: siTypescript },
  { name: 'JavaScript', icon: siJavascript },
  { name: 'SQL' },
  { name: 'HTML', icon: siHtml5 },
  { name: 'CSS', icon: siCss },
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
