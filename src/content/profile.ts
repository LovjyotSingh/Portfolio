export const profile = {
  name: 'Lovjyot Singh',
  firstName: 'Lovjyot',
  lastName: 'Singh',
  initials: 'LS',
  role: 'Full-Stack Engineer',
  shortBio:
    'Full-stack engineer building real-time and AI-powered products with React, Next.js, Node.js and MongoDB.',
  location: 'Faridabad, Haryana (Delhi NCR), India',
  city: 'Faridabad',
  region: 'Delhi NCR',
  country: 'India',
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST',
  email: 'lovjyotsinghofficial@gmail.com',
  phoneDisplay: '+91 99584 73062',
  phoneHref: 'tel:+919958473062',
  availability: 'Immediate joiner',
  resume: {
    href: '/Lovjyot_Singh_Resume.pdf?v=20261004',
    fileName: 'Lovjyot_Singh_Resume.pdf',
  },
} as const;

export const socials = {
  github: { label: 'GitHub', handle: '@LovjyotSingh', href: 'https://github.com/LovjyotSingh' },
  linkedin: {
    label: 'LinkedIn',
    handle: 'in/lovjyotsingh',
    href: 'https://www.linkedin.com/in/lovjyotsingh',
  },
  email: {
    label: 'Email',
    handle: profile.email,
    href: `mailto:${profile.email}?subject=${encodeURIComponent('Hello Lovjyot')}`,
  },
} as const;

export const navItems = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = (typeof navItems)[number]['id'] | 'top';

/** Lightweight project links, safe to import from client components. */
export const projectLinks = [
  {
    id: 'offerforge',
    name: 'OfferForge AI',
    live: 'https://offer-forge-ai.vercel.app',
    code: 'https://github.com/LovjyotSingh/OfferForge-AI',
  },
  {
    id: 'syncflow',
    name: 'SyncFlow',
    live: 'https://syncflow-sss.vercel.app',
    code: 'https://github.com/LovjyotSingh/SyncFlow',
  },
] as const;

export const education = {
  degree: 'B.Tech, Computer Science & Engineering',
  school: 'University School of Information, Communication & Technology',
  schoolShort: 'USICT',
  university: 'Guru Gobind Singh Indraprastha University',
  universityShort: 'GGSIPU',
  place: 'New Delhi',
  start: 'Jul 2022',
  end: 'Jul 2026',
  coursework: [
    'Data Structures & Algorithms',
    'System Design (HLD / LLD)',
    'Database Management Systems',
    'Operating Systems',
    'Computer Networks',
  ],
} as const;
