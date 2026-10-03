'use client';

import { CloudOff, FileText, SlidersHorizontal } from 'lucide-react';
import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import {
  interviewLevels,
  interviewRoles,
  interviewSections,
  type InterviewLevelId,
  type SectionKey,
} from '@/content/offerforge-catalog';
import {
  answerScore,
  calibrationFor,
  graderPrompt,
  hireRecommendation,
  UNGRADED_MESSAGE,
  verdictFor,
} from '@/lib/offerforge-grading';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const roleLabels: Record<string, string> = {
  sde: 'SDE',
  frontend: 'Frontend',
  backend: 'Backend',
  'data-analyst': 'Data Analyst',
  'data-scientist': 'Data Scientist',
  'business-analyst': 'Business Analyst',
  'product-manager': 'Product Manager',
};

const verdictBands = [
  { label: 'Weak', from: 0, to: 50 },
  { label: 'Partial', from: 50, to: 70 },
  { label: 'Solid', from: 70, to: 85 },
  { label: 'Strong', from: 85, to: 101 },
];

type View = 'rubric' | 'prompt';
const views: { id: View; label: string; icon: ReactNode }[] = [
  { id: 'rubric', label: 'Score it', icon: <SlidersHorizontal className="size-3.5" aria-hidden /> },
  { id: 'prompt', label: 'Grader prompt', icon: <FileText className="size-3.5" aria-hidden /> },
];

const pad = (n: number) => n.toString().padStart(2, '0');

function StepLabel({ n, children }: { n: number; children: ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-sm font-medium">
      <span className="grid size-6 place-items-center rounded-full border border-line-strong font-mono text-[0.65rem] text-muted">{n}</span>
      {children}
    </p>
  );
}

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'h-9 rounded-full border px-3.5 text-[0.8125rem] transition-[background-color,border-color,color] duration-200',
        pressed ? 'border-transparent bg-fg text-bg' : 'border-line-strong text-muted hover:border-fg/30 hover:text-fg',
      )}
    >
      {children}
    </button>
  );
}

function VerdictMeter({ score }: { score: number | null }) {
  return (
    <div aria-hidden>
      <div className="relative flex h-2 gap-1">
        {verdictBands.map((band) => {
          const active = score !== null && score >= band.from && score < band.to;
          return (
            <span
              key={band.label}
              style={{ flexGrow: Math.min(band.to, 100) - band.from }}
              className={cn('rounded-full transition-colors duration-300', active ? 'bg-accent' : 'bg-line-strong')}
            />
          );
        })}
        <span
          className={cn(
            'absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-surface bg-fg shadow-sm transition-[left,opacity] duration-500 ease-out-expo',
            score === null && 'opacity-0',
          )}
          style={{ left: `${score ?? 0}%` }}
        />
      </div>
      <div className="mt-2 flex gap-1 font-mono text-[0.625rem] text-subtle">
        {verdictBands.map((band) => (
          <span key={band.label} style={{ flexGrow: Math.min(band.to, 100) - band.from }}>
            {band.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function GradingDemo() {
  const id = useId();
  const [roleId, setRoleId] = useState<string>('sde');
  const [level, setLevel] = useState<InterviewLevelId>('easy');
  const [picked, setPicked] = useState<SectionKey>('system-design');
  const [scores, setScores] = useState([8, 7, 6, 8]);
  const [outage, setOutage] = useState(false);
  const [view, setView] = useState<View>('rubric');

  const role = interviewRoles.find((r) => r.id === roleId) ?? interviewRoles[0];
  const sectionKey = role.sections.some((s) => s.key === picked) ? picked : role.sections[0].key;
  const section = interviewSections[sectionKey];
  const levelInfo = interviewLevels.find((l) => l.id === level) ?? interviewLevels[0];
  const totalQuestions = role.sections.reduce((n, s) => n + s.count, 0);
  const totalMinutes = role.sections.reduce((n, s) => n + interviewSections[s.key].minutes * s.count, 0);

  const score = outage ? null : answerScore(scores);
  const verdict = score === null ? 'Not graded' : verdictFor(score);
  const call = hireRecommendation(score);

  const prompt = graderPrompt({
    roleTitle: role.title,
    levelPrompt: levelInfo.prompt,
    sectionTitle: section.title,
    rubric: section.rubric,
    question: section.sample.question,
  });

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = views[(views.findIndex((v) => v.id === view) + 1) % views.length].id;
    setView(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <div className="grid lg:grid-cols-12">
      {/* 1 · Loop builder */}
      <div className="border-b border-line p-5 sm:p-7 lg:col-span-5 lg:border-r lg:border-b-0">
        <StepLabel n={1}>Pick a track and a level</StepLabel>

        <div role="group" aria-label="Role track" className="mt-5 flex flex-wrap gap-2">
          {interviewRoles.map((r) => (
            <Chip key={r.id} pressed={r.id === role.id} onClick={() => setRoleId(r.id)}>
              {roleLabels[r.id] ?? r.title}
            </Chip>
          ))}
        </div>

        <div role="group" aria-label="Level" className="mt-4 grid grid-cols-3 rounded-full border border-line-strong p-1">
          {interviewLevels.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={l.id === level}
              onClick={() => setLevel(l.id)}
              className={cn(
                'h-8 rounded-full text-[0.8125rem] transition-colors duration-200',
                l.id === level ? 'bg-accent text-accent-ink' : 'text-muted hover:text-fg',
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-subtle">
          {role.blurb} Graded as {levelInfo.prompt}.
        </p>

        <div className="mt-8 flex items-baseline justify-between gap-3 border-b border-line pb-3">
          <p className="text-eyebrow text-muted">The loop</p>
          <p className="font-mono text-xs text-muted">
            {totalQuestions} questions · ~{totalMinutes} min
          </p>
        </div>
        <ol key={role.id} className="mt-2 space-y-0.5" aria-label={`${role.title} interview loop`}>
          {role.sections.map((s, i) => {
            const sec = interviewSections[s.key];
            const active = s.key === sectionKey;
            return (
              <li key={s.key} className="enter-fade-up" style={{ '--d': `${i * 45}ms` } as React.CSSProperties}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPicked(s.key)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200',
                    active ? 'bg-accent-soft text-fg' : 'text-muted hover:bg-fg/[0.04] hover:text-fg',
                  )}
                >
                  <span className={cn('font-mono text-[0.7rem]', active ? 'text-accent-text' : 'text-subtle')}>{pad(i + 1)}</span>
                  <span className="min-w-0 flex-1 truncate text-sm">{sec.title}</span>
                  <span className="font-mono text-xs">×{s.count}</span>
                  <span className="w-12 text-right font-mono text-xs text-subtle">{sec.minutes * s.count}m</span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-xs text-subtle">Pick a section to grade an answer from it.</p>
      </div>

      {/* 2 · Grader */}
      <div className="flex flex-col p-5 sm:p-7 lg:col-span-7 lg:min-h-[44rem]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StepLabel n={2}>Grade an answer</StepLabel>
          <div role="tablist" aria-label="Grader view" className="flex rounded-full border border-line-strong p-1">
            {views.map((v) => (
              <button
                key={v.id}
                id={`${id}-tab-${v.id}`}
                type="button"
                role="tab"
                aria-selected={view === v.id}
                aria-controls={`${id}-panel-${v.id}`}
                tabIndex={view === v.id ? 0 : -1}
                onClick={() => setView(v.id)}
                onKeyDown={onTabKey}
                className={cn(
                  'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] transition-colors duration-200',
                  view === v.id ? 'bg-fg text-bg' : 'text-muted hover:text-fg',
                )}
              >
                {v.icon}
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-line bg-bg/40 p-4 sm:p-5">
          <p className="text-eyebrow flex flex-wrap items-center gap-x-2 gap-y-1 text-subtle">
            <span className="text-accent-text">{section.title}</span>
            <span aria-hidden>·</span>
            <span>{outage ? 'Served from the curated bank' : 'Sample from the question bank'}</span>
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed whitespace-pre-line">{section.sample.question}</p>
          <p className="mt-3 text-sm text-muted">
            <span className="font-accent text-[1.05em] text-fg">Hint:</span> {section.sample.hint}
          </p>
        </div>

        {view === 'rubric' ? (
          <div id={`${id}-panel-rubric`} role="tabpanel" aria-labelledby={`${id}-tab-rubric`} className="mt-6 flex flex-1 flex-col">
            <fieldset disabled={outage}>
              <legend className="text-eyebrow text-muted">You play the model: score each criterion 0 to 10</legend>
              <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {section.rubric.map((criterion, i) => {
                  const value = scores[i] ?? 0;
                  return (
                    <div key={criterion}>
                      <div className="flex items-baseline justify-between gap-3">
                        <label htmlFor={`${id}-c${i}`} className="text-sm font-medium">
                          {criterion}
                        </label>
                        <span aria-hidden className="font-mono text-sm text-muted tabular-nums">
                          {value}
                        </span>
                      </div>
                      <input
                        id={`${id}-c${i}`}
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={value}
                        aria-valuetext={`${value} of 10, ${calibrationFor(value)}`}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          setScores((prev) => prev.map((v, j) => (j === i ? next : v)));
                        }}
                        className="range mt-2"
                        style={{ '--p': `${value * 10}%` } as React.CSSProperties}
                      />
                      <p aria-hidden className="mt-1 text-xs text-subtle">
                        {calibrationFor(value)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-auto pt-7">
              <div className="grid gap-5 rounded-2xl border border-line bg-bg/40 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8 sm:p-5">
                <div>
                  <p className="text-eyebrow text-subtle">Answer score</p>
                  <p className="mt-2 text-[3.25rem] leading-none font-semibold tracking-[-0.05em] tabular-nums" aria-live="polite">
                    {score ?? '—'}
                    <span className="ml-1 text-lg font-normal tracking-normal text-subtle">/100</span>
                  </p>
                </div>
                <div>
                  <VerdictMeter score={score} />
                  <dl className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-eyebrow text-subtle">Verdict</dt>
                      <dd className="mt-1.5 text-sm font-medium">{verdict}</dd>
                    </div>
                    <div>
                      <dt className="text-eyebrow text-subtle">Round call at this average</dt>
                      <dd className="mt-1.5 text-sm font-medium">{call}</dd>
                    </div>
                  </dl>
                </div>
                {outage ? (
                  <p className="flex items-start gap-2.5 rounded-xl border border-dashed border-line-strong p-3 text-sm text-muted sm:col-span-2">
                    <CloudOff className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
                    <span>
                      “{UNGRADED_MESSAGE}” The answer is kept, it just isn’t given a number nobody can stand behind.
                    </span>
                  </p>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <Switch checked={outage} onCheckedChange={setOutage}>
                  Simulate an AI outage
                </Switch>
                <p className="font-mono text-[0.7rem] text-subtle">score = round(mean × 10)</p>
              </div>
            </div>
          </div>
        ) : (
          <div id={`${id}-panel-prompt`} role="tabpanel" aria-labelledby={`${id}-tab-prompt`} className="mt-6 flex flex-1 flex-col">
            <p className="text-sm text-muted">
              The exact prompt the grader gets for this role, level and section.{' '}
              <span className="text-accent-text">Highlighted</span> parts change as you pick.
            </p>
            <pre
              tabIndex={0}
              data-lenis-prevent
              aria-label="Grader prompt"
              className="mt-4 max-h-[30rem] flex-1 overflow-auto overscroll-contain rounded-2xl border border-line bg-bg/60 p-4 font-mono text-[0.72rem] leading-relaxed whitespace-pre-wrap text-muted sm:p-5"
            >
              {prompt.map((part, i) =>
                part.filled ? (
                  <mark key={i} className="rounded-[3px] bg-accent-soft px-0.5 text-accent-text">
                    {part.text}
                  </mark>
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )}
            </pre>
            <p className="mt-3 text-xs text-subtle">
              The candidate’s answer is fenced in tags and the model is told to ignore any instructions inside it, so an answer can’t grade itself.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
