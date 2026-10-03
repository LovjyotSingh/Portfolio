import { ArrowDown, ArrowDownToLine } from 'lucide-react';
import { education, profile } from '@/content/profile';
import { ButtonLink } from '@/components/ui/button';
import { LocalTime } from '@/components/ui/local-time';
import { Magnetic } from '@/components/ui/magnetic';
import { PresenceAvatars } from '@/components/hero/presence-avatars';
import { PresenceLayer } from '@/components/hero/presence-layer';
import { TypedRole } from '@/components/hero/typed-role';

function Line({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  // Padding + negative margin keeps descenders (j, y, g) inside the clip box.
  return (
    <span className={`-my-[0.16em] block overflow-hidden py-[0.16em] ${className ?? ''}`}>
      <span className="enter-rise block" style={{ '--d': `${delay}ms` } as React.CSSProperties}>
        {children}
      </span>
    </span>
  );
}

const meta = [
  { label: 'Based in', value: `${profile.city}, ${profile.region}` },
  { label: 'Local time', value: <LocalTime /> },
  { label: 'Education', value: `B.Tech CSE · ${education.universityShort} ’26` },
  { label: 'Focus', value: 'Full-stack · Real-time · AI' },
];

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 sm:pt-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="dot-grid mask-radial absolute inset-0 opacity-80" />
        <div className="hero-spotlight absolute inset-0" />
        <div className="hero-glow enter-fade absolute -top-[38%] -right-[18%] size-[80vmax] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-bg to-transparent" />
      </div>
      <PresenceLayer />

      <div className="container-page relative z-10 flex flex-1 flex-col">
        <div className="enter-fade-up flex items-center justify-between gap-4" style={{ '--d': '250ms' } as React.CSSProperties}>
          <p className="text-eyebrow flex items-center gap-2.5 text-muted">
            <span className="relative flex size-2">
              <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-emerald-400" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Open to work · {profile.availability}
          </p>
          <PresenceAvatars />
        </div>

        <div className="relative mt-[clamp(2.25rem,8svh,5.5rem)]">
          <h1 id="hero-title" className="text-hero font-semibold">
            <span className="sr-only">
              {profile.name}, {profile.role}
            </span>
            <span aria-hidden className="block">
              <Line>{profile.firstName}</Line>
              <Line delay={110} className="md:text-right">
                {profile.lastName}
                <span className="text-accent">.</span>
              </Line>
            </span>
          </h1>
          <p
            className="enter-fade-up mt-6 max-w-[19rem] text-[0.95rem] leading-snug text-muted md:absolute md:bottom-[0.55em] md:left-0 md:mt-0 md:text-base lg:max-w-[21rem]"
            style={{ '--d': '520ms' } as React.CSSProperties}
          >
            <span className="font-accent text-[1.2em] text-fg">Full-stack engineer</span> and CSE ’26 graduate from {education.schoolShort},{' '}
            {education.universityShort}. Two products live, built end to end.
          </p>
        </div>

        <div className="mt-auto grid gap-8 pt-12 pb-8 sm:pt-16 lg:grid-cols-12 lg:items-end lg:gap-12">
          <p
            className="enter-fade-up text-title min-h-[2.1em] font-medium text-balance lg:col-span-7"
            style={{ '--d': '640ms' } as React.CSSProperties}
          >
            <span className="text-muted">I build </span>
            <TypedRole className="text-fg" />
          </p>

          <div className="enter-fade-up flex flex-col gap-6 lg:col-span-5 lg:items-end" style={{ '--d': '760ms' } as React.CSSProperties}>
            <p className="max-w-md text-pretty text-muted lg:text-right">
              Shipping on React, Next.js, Node.js and MongoDB, from WebSocket rooms and CRDT merges to rubric-graded AI and the last pixel of the UI.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <ButtonLink href="#work" size="lg" icon={<ArrowDown className="size-4 transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0.5" />}>
                  See selected work
                </ButtonLink>
              </Magnetic>
              <Magnetic strength={0.2}>
                <ButtonLink
                  href={profile.resume.href}
                  download={profile.resume.fileName}
                  variant="secondary"
                  size="lg"
                  icon={<ArrowDownToLine className="size-4" />}
                >
                  Résumé
                </ButtonLink>
              </Magnetic>
            </div>
          </div>
        </div>

        <dl
          className="enter-fade grid grid-cols-2 gap-px border-t border-line bg-line md:grid-cols-4"
          style={{ '--d': '900ms' } as React.CSSProperties}
        >
          {meta.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5 bg-bg py-4 pr-3 max-md:even:pl-4 sm:py-5 md:not-first:pl-6">
              <dt className="text-eyebrow text-subtle">{item.label}</dt>
              <dd className="text-sm text-fg">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
