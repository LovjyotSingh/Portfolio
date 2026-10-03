import { ArrowDownToLine, ArrowUpRight, Clock3, MapPin, Phone, Zap } from 'lucide-react';
import { siGithub, siLinkedin } from '@/components/icons/brand-icons';
import { BrandIcon } from '@/components/ui/brand-icon';
import { ButtonLink } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { LocalTime } from '@/components/ui/local-time';
import { Magnetic } from '@/components/ui/magnetic';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeader } from '@/components/ui/section-header';
import { profile, socials } from '@/content/profile';

const [mailbox, domain] = profile.email.split('@');

export function Contact() {
  const details = [
    { icon: Zap, label: 'Availability', value: `${profile.availability}, open to full-time roles` },
    { icon: MapPin, label: 'Based in', value: `${profile.city}, ${profile.region}, ${profile.country}` },
    { icon: Clock3, label: 'Local time', value: <LocalTime withSeconds={false} /> },
    {
      icon: Phone,
      label: 'Phone',
      value: (
        <a href={profile.phoneHref} className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-text hover:decoration-current">
          {profile.phoneDisplay}
        </a>
      ),
    },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeader
          id="contact-title"
          index="04"
          label="Contact"
          title={
            <>
              Let’s build something <span className="font-accent text-accent-text">real</span>.
            </>
          }
          aside="Hiring for a full-stack, real-time or AI product role? I can start immediately. Email is the fastest way to reach me."
        />

        <Reveal className="mt-14 sm:mt-20">
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-surface/60 p-6 sm:p-10 lg:p-14">
            <div
              aria-hidden
              className="absolute -top-1/2 -right-1/4 -z-10 size-[70vmax] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent_70%)] opacity-70"
            />
            <div aria-hidden className="dot-grid mask-fade-b absolute inset-0 -z-10 opacity-40" />

            <p className="text-eyebrow text-muted">Write to me</p>
            <a
              href={socials.email.href}
              className="group mt-5 inline-block text-[clamp(1.45rem,6.3vw,4.4rem)] leading-[1.04] font-semibold tracking-[-0.045em]"
            >
              <span className="inline-block">{mailbox}</span>
              <span className="inline-block text-muted transition-colors duration-500 group-hover:text-accent-text">@{domain}</span>
              <ArrowUpRight
                className="ml-[0.1em] inline size-[0.62em] -translate-y-[0.06em] text-accent-text transition-transform duration-500 ease-out-expo group-hover:translate-x-[0.08em] group-hover:-translate-y-[0.14em]"
                aria-hidden
              />
            </a>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <CopyButton value={profile.email} label="Copy email" />
              <Magnetic strength={0.18}>
                <ButtonLink href={socials.linkedin.href} target="_blank" rel="noopener noreferrer" variant="secondary" iconPosition="start" icon={<BrandIcon icon={siLinkedin} />}>
                  LinkedIn
                </ButtonLink>
              </Magnetic>
              <Magnetic strength={0.18}>
                <ButtonLink href={socials.github.href} target="_blank" rel="noopener noreferrer" variant="secondary" iconPosition="start" icon={<BrandIcon icon={siGithub} />}>
                  GitHub
                </ButtonLink>
              </Magnetic>
              <Magnetic strength={0.18}>
                <ButtonLink href={profile.resume.href} download={profile.resume.fileName} variant="secondary" icon={<ArrowDownToLine className="size-4" />}>
                  Résumé (PDF)
                </ButtonLink>
              </Magnetic>
            </div>

            <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
              {details.map((d) => (
                <div key={d.label} className="flex flex-col gap-2 bg-bg/90 p-4 sm:p-5">
                  <dt className="text-eyebrow flex items-center gap-2 text-subtle">
                    <d.icon className="size-3.5 text-accent-text" aria-hidden />
                    {d.label}
                  </dt>
                  <dd className="text-[0.95rem] text-fg">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
