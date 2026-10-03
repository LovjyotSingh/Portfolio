import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { siGithub } from '@/components/icons/brand-icons';
import { BrandIcon } from '@/components/ui/brand-icon';
import { ButtonLink } from '@/components/ui/button';
import { Parallax } from '@/components/ui/parallax';
import { Reveal } from '@/components/ui/reveal';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import type { Project } from '@/content/projects';
import { techIcon } from '@/content/tech-icons';
import { cn } from '@/lib/utils';
import { Architecture } from './architecture';
import { BrowserFrame } from './browser-frame';

type Props = { project: Project; flip?: boolean; demo: ReactNode };

export function ProjectShowcase({ project: p, flip, demo }: Props) {
  return (
    <article id={p.id} aria-labelledby={`${p.id}-title`} className="scroll-mt-24">
      <header className="flex flex-col gap-7 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <p className="text-eyebrow flex flex-wrap items-center gap-x-3 gap-y-2 text-muted">
              <span className="text-accent-text">{p.index}</span>
              <span className="h-px w-6 bg-line-strong" aria-hidden />
              <span>{p.kind}</span>
              <span aria-hidden>·</span>
              <span>{p.year}</span>
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h3 id={`${p.id}-title`} className="text-display mt-5 font-semibold">
              {p.name}
            </h3>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="flex flex-wrap gap-3">
          <ButtonLink
            href={p.live}
            target="_blank"
            rel="noopener noreferrer"
            icon={<ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />}
          >
            Visit live site
          </ButtonLink>
          <ButtonLink
            href={p.code}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            iconPosition="start"
            icon={<BrandIcon icon={siGithub} />}
          >
            Source
          </ButtonLink>
        </Reveal>
      </header>

      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14">
        <Reveal className={cn('lg:col-span-7', flip && 'lg:order-2')}>
          <Parallax distance={28}>
            <BrowserFrame href={p.live} host={p.host} name={p.name} image={p.screenshot} alt={p.screenshotAlt} scrollable={p.scrollable} />
          </Parallax>
        </Reveal>

        <div className="flex flex-col lg:col-span-5">
          <Reveal>
            <p className="font-accent text-[clamp(1.85rem,3.2vw,2.75rem)] leading-[1.05] text-balance">{p.tagline}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 leading-relaxed text-pretty text-muted">{p.summary}</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {p.metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col-reverse justify-end gap-1.5 bg-bg p-4 sm:p-5">
                  <dt className="text-[0.8125rem] leading-snug text-muted">{metric.label}</dt>
                  <dd className="text-[1.65rem] leading-none font-semibold tracking-[-0.04em] tabular-nums">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.15} className="mt-8 lg:mt-auto lg:pt-8">
            <p className="text-eyebrow text-subtle">Built with</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {p.stack.map((tech) => {
                const icon = techIcon(tech);
                return (
                  <li key={tech} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-[0.8125rem] text-muted">
                    {icon ? <BrandIcon icon={icon} className="size-3.5" /> : null}
                    {tech}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>

      <ol className="mt-14 grid gap-4 md:grid-cols-3 lg:mt-20">
        {p.highlights.map((h, i) => (
          <Reveal as="li" key={h.title} delay={0.06 * i}>
            <SpotlightCard className="h-full rounded-3xl border border-line bg-surface/60 p-6 sm:p-7">
              <p className="font-mono text-xs text-accent-text">{String(i + 1).padStart(2, '0')}</p>
              <h4 className="mt-5 text-lg font-semibold tracking-[-0.02em]">{h.title}</h4>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{h.body}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-4">
        <Architecture project={p} />
      </Reveal>

      <div className="mt-4">{demo}</div>
    </article>
  );
}
