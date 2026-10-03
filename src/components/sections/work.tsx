import { GradingDemo } from '@/components/demos/grading-demo';
import { SyncDemoLazy } from '@/components/demos/sync/sync-demo-lazy';
import { SectionHeader } from '@/components/ui/section-header';
import { DemoFrame } from '@/components/work/demo-frame';
import { ProjectShowcase } from '@/components/work/project-showcase';
import { projects, type Project } from '@/content/projects';

const demos: Record<Project['id'], React.ReactNode> = {
  offerforge: (
    <DemoFrame
      id="offerforge-demo"
      title="The grading engine, minus the model."
      description="Same roles, sections, rubrics, level calibration and score thresholds as production. Build a loop, then play the grader yourself, or knock the AI offline and watch it refuse to invent a score."
    >
      <GradingDemo />
    </DemoFrame>
  ),
  syncflow: (
    <DemoFrame
      id="syncflow-demo"
      title="Two screens, one document. Try to break it."
      description="Real Yjs documents synced through a simulated Socket.io room, with SyncFlow’s event names, Redis key, 700 ms save debounce and 30-day TTL. Slow the network down, cut a screen off, keep typing on both: they still end up identical."
    >
      <SyncDemoLazy />
    </DemoFrame>
  ),
};

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeader
          id="work-title"
          index="01"
          label="Selected work"
          title={
            <>
              Two products, <span className="font-accent text-accent-text">live</span> and built end to end.
            </>
          }
          aside="Not mockups. Both are deployed and open source, and each case study ends with a working piece of it you can play with right here."
        />

        <div className="mt-20 space-y-32 sm:mt-24 sm:space-y-40">
          {projects.map((project, i) => (
            <ProjectShowcase key={project.id} project={project} flip={i % 2 === 1} demo={demos[project.id]} />
          ))}
        </div>
      </div>
    </section>
  );
}
