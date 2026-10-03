import { GitMerge, GraduationCap, Rocket, ShieldCheck } from 'lucide-react';
import { education } from '@/content/profile';
import { CountUp } from '@/components/ui/count-up';
import { Reveal } from '@/components/ui/reveal';
import { ScrollLitText } from '@/components/ui/scroll-lit-text';
import { SectionHeader } from '@/components/ui/section-header';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const statement =
  'I’m Lovjyot, a full-stack engineer from Delhi NCR who gravitates to the parts most people avoid: keeping a document *consistent* while several people type into it at once, and making AI feedback something you can actually *trust*. I graduated in Computer Science & Engineering from USICT, GGSIPU in 2026, and I care about shipping *complete* products, from the schema and the socket server to the last pixel.';

const stats = [
  { to: 2, pad: 2, suffix: '', label: 'Products live', detail: 'Designed, built and deployed end to end' },
  { to: 150, pad: 0, suffix: '+', label: 'DSA problems solved', detail: 'Core data structures and algorithms practice' },
  { to: 7, pad: 2, suffix: '', label: 'Interview tracks', detail: 'Each with its own rubric, in OfferForge' },
  { to: 0, pad: 0, suffix: ' days', label: 'Notice period', detail: 'Immediate joiner, ready to start' },
];

const principles = [
  {
    icon: GitMerge,
    title: 'Correct under concurrency',
    body: 'Edits from different people merge through CRDTs, rooms are JWT-gated and writes are debounced. Real-time should never mean last-write-wins.',
  },
  {
    icon: ShieldCheck,
    title: 'Honest by design',
    body: 'When the AI provider fails, OfferForge says “not graded” instead of inventing a number. Good systems fail loudly, and gracefully.',
  },
  {
    icon: Rocket,
    title: 'Shipped, not just built',
    body: 'Both products are live: web apps on Vercel, plus a long-lived Node service where sockets need one. The deploy is part of the work.',
  },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeader
          id="about-title"
          index="02"
          label="About"
          title={
            <>
              I like the <span className="font-accent text-accent-text">hard</span> parts of the stack.
            </>
          }
        />

        <ScrollLitText
          text={statement}
          className="mt-14 max-w-5xl text-[clamp(1.45rem,3.1vw,2.6rem)] leading-[1.22] font-medium tracking-[-0.03em] sm:mt-20"
        />

        <div className="mt-20 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SpotlightCard className="flex h-full flex-col rounded-3xl border border-line bg-surface/60 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="text-eyebrow flex items-center gap-2 text-muted">
                  <GraduationCap className="size-4 text-accent-text" aria-hidden /> Education
                </p>
                <p className="font-mono text-xs text-subtle">
                  {education.start} — {education.end}
                </p>
              </div>
              <h3 className="mt-8 text-2xl leading-tight font-semibold tracking-[-0.03em] sm:text-[1.75rem]">{education.degree}</h3>
              <p className="mt-3 text-muted">
                {education.school} ({education.schoolShort}), {education.university}, {education.place}
              </p>
              <div className="mt-auto pt-8">
                <p className="text-eyebrow text-subtle">Core coursework</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {education.coursework.map((c) => (
                    <li key={c} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          </Reveal>

          <ul className="grid grid-cols-2 gap-4 lg:col-span-7">
            {stats.map((s, i) => (
              <Reveal as="li" key={s.label} delay={0.05 * i}>
                <SpotlightCard className="flex h-full flex-col rounded-3xl border border-line bg-surface/60 p-5 sm:p-7">
                  <CountUp
                    to={s.to}
                    pad={s.pad}
                    suffix={s.suffix}
                    className="block text-[clamp(2.6rem,6vw,4.75rem)] leading-none font-semibold tracking-[-0.05em] tabular-nums"
                  />
                  <p className="text-eyebrow mt-auto pt-8 text-muted">{s.label}</p>
                  <p className="mt-2 text-sm leading-snug text-subtle">{s.detail}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>
        </div>

        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.title} delay={0.06 * i}>
              <SpotlightCard className="h-full rounded-3xl border border-line bg-surface/60 p-6 sm:p-7">
                <span className="grid size-10 place-items-center rounded-xl border border-line-strong bg-bg/60 text-accent-text">
                  <p.icon className="size-[1.15rem]" aria-hidden />
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em]">{p.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
