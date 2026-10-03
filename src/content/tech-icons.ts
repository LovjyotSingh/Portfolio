import {
  siExpress,
  siFramer,
  siGooglegemini,
  siJsonwebtokens,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siOpenrouter,
  siReact,
  siRedis,
  siSocketdotio,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
  type BrandIconData,
} from '@/components/icons/brand-icons';

const icons: Record<string, BrandIconData> = {
  React: siReact,
  'Next.js': siNextdotjs,
  TypeScript: siTypescript,
  Vite: siVite,
  'Tailwind CSS': siTailwindcss,
  'Framer Motion': siFramer,
  'Node.js': siNodedotjs,
  Express: siExpress,
  'Socket.io': siSocketdotio,
  MongoDB: siMongodb,
  Redis: siRedis,
  JWT: siJsonwebtokens,
  Gemini: siGooglegemini,
  OpenRouter: siOpenrouter,
  Vercel: siVercel,
};

/** Brand icon for a stack label, ignoring a trailing major version ("React 19"). */
export function techIcon(name: string): BrandIconData | undefined {
  return icons[name.replace(/\s+\d+$/, '')];
}
