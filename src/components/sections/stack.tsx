import { BookOpen, BrainCircuit, Cloud, Code2, Database, LayoutTemplate, RadioTower, Server, type LucideIcon } from 'lucide-react';
import { BrandIcon } from '@/components/ui/brand-icon';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeader } from '@/components/ui/section-header';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { StackFilter } from '@/components/stack/stack-filter';
import { fundamentals, languages, skillGroups, type ProjectId, type Skill } from '@/content/skills';
import { cn } from '@/lib/utils';

const groupIcons: Record<string, LucideIcon> = {
  frontend: LayoutTemplate,
  realtime: RadioTower,
  backend: Server,
  data: Database,
  ai: BrainCircuit,
  cloud: Cloud,
};

const spans: Record<string, string> = {
  frontend: 'lg:col-span-7',
  realtime: 'lg:col-span-5',
  backend: 'lg:col-span-4',
  data: 'lg:col-span-4',
  ai: 'lg:col-span-4',
  cloud: 'lg:col-span-5',
};

/** Near-black brand marks would vanish on the dark theme, so they hover to the text colour instead. */
function hoverColor(hex: string) {
  const n = Number.parseInt(hex.replace('#', ''), 16);
  const luminance = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return luminance < 0.2 ? 'var(--fg)' : hex;
}

function Chip({ skill }: { skill: Skill }) {
  return (
    <li
      data-chip
      data-used={skill.usedIn?.join(' ') ?? ''}
      style={skill.icon ? ({ '--brand': hoverColor(skill.icon.hex) } as React.CSSProperties) : undefined}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-bg/50 px-3.5 text-sm text-muted hover:border-line-strong hover:text-fg"
    >
      {skill.icon ? <BrandIcon icon={skill.icon} /> : <span className="size-1.5 rounded-full bg-line-strong" aria-hidden />}
      {skill.name}
    </li>
  );
}

function CardHead({ icon: Icon, title, index }: { icon: LucideIcon; title: string; index: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h3 className="flex items-center gap-3 text-lg font-semibold tracking-[-0.02em]">
        <span className="grid size-9 place-items-center rounded-xl border border-line-strong bg-bg/60 text-accent-text">
          <Icon className="size-[1.05rem]" aria-hidden />
        </span>
        {title}
      </h3>
      <span className="font-mono text-xs text-subtle">{String(index).padStart(2, '0')}</span>
    </div>
  );
}

const usedCount = (project: ProjectId) =>
  [...skillGroups.flatMap((g) => g.skills), ...languages].filter((s) => s.usedIn?.includes(project)).length;

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeader
          id="stack-title"
          index="03"
          label="Stack"
          title={
            <>
              The tools, and <span className="font-accent text-accent-text">where</span> they earned their place.
            </>
          }
          aside="Picked per job: CRDTs for shared state, Redis for hot documents, MongoDB for everything that has to outlive a session."
        />

        <StackFilter counts={{ offerforge: usedCount('offerforge'), syncflow: usedCount('syncflow') }} className="mt-14 sm:mt-20">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
            {skillGroups.map((group, i) => (
              <Reveal key={group.id} delay={0.04 * (i % 3)} className={cn(spans[group.id])}>
                <SpotlightCard className="flex h-full flex-col rounded-3xl border border-line bg-surface/60 p-6 sm:p-7">
                  <CardHead icon={groupIcons[group.id] ?? Code2} title={group.title} index={i + 1} />
                  <p className="mt-3 max-w-md text-[0.95rem] text-muted">{group.blurb}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                    {group.skills.map((skill) => (
                      <Chip key={skill.name} skill={skill} />
                    ))}
                  </ul>
                </SpotlightCard>
              </Reveal>
            ))}

            <Reveal delay={0.04} className="lg:col-span-3">
              <SpotlightCard className="flex h-full flex-col rounded-3xl border border-line bg-surface/60 p-6 sm:p-7">
                <CardHead icon={Code2} title="Languages" index={skillGroups.length + 1} />
                <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                  {languages.map((skill) => (
                    <Chip key={skill.name} skill={skill} />
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-4">
              <SpotlightCard className="flex h-full flex-col rounded-3xl border border-line bg-surface/60 p-6 sm:p-7">
                <CardHead icon={BookOpen} title="Fundamentals" index={skillGroups.length + 2} />
                <ul className="mt-6 divide-y divide-line">
                  {fundamentals.map((f) => (
                    <li key={f.name} className="flex items-baseline justify-between gap-4 py-2.5 text-[0.95rem]">
                      <span>{f.name}</span>
                      {f.note ? <span className="shrink-0 font-mono text-xs text-accent-text">{f.note}</span> : null}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          </div>
        </StackFilter>
      </div>
    </section>
  );
}
