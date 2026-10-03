import { About } from '@/components/sections/about';
import { Contact } from '@/components/sections/contact';
import { Hero } from '@/components/sections/hero';
import { Stack } from '@/components/sections/stack';
import { Work } from '@/components/sections/work';
import { Marquee } from '@/components/ui/marquee';
import { PauseOffscreen } from '@/components/ui/pause-offscreen';
import { education, profile, socials } from '@/content/profile';
import { marqueeItems } from '@/content/skills';
import { siteUrl } from '@/lib/utils';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  description: profile.shortBio,
  url: siteUrl(),
  email: `mailto:${profile.email}`,
  sameAs: [socials.github.href, socials.linkedin.href],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: `${education.school}, ${education.university}`,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: profile.city,
    addressRegion: 'Haryana',
    addressCountry: 'IN',
  },
  knowsAbout: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Socket.io', 'Yjs', 'CRDTs', 'Redis', 'System design'],
};

export default function Home() {
  return (
    <>
      <Hero />
      <PauseOffscreen>
        <Marquee items={marqueeItems} />
      </PauseOffscreen>
      <Work />
      <About />
      <Stack />
      <Contact />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
