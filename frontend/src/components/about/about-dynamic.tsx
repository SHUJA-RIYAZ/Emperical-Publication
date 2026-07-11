"use client";

import { Counter } from "@/components/common/counter";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { useSettings } from "@/hooks/use-settings";

/** Stats grid on the About page, driven by admin-editable settings. */
export function AboutStats() {
  const { stats } = useSettings();
  return (
    <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Reveal key={stat.label} delay={i * 0.07}>
          <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
            <p className="font-display text-3xl font-semibold text-primary dark:text-accent">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Milestones heading whose copy references the (editable) founding year. */
export function MilestonesHeading() {
  const { site } = useSettings();
  return (
    <SectionHeading
      eyebrow="Our Story"
      title="Milestones along the way"
      description={`From a three-journal imprint in ${site.founded} to a global publishing house.`}
    />
  );
}
