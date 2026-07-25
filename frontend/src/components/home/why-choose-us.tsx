"use client";

import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { ServiceIcon } from "@/components/common/service-icon";
import { useSettings } from "@/hooks/use-settings";

export function WhyChooseUs() {
  const { reasons } = useSettings();
  if (reasons.length === 0) return null;

  return (
    <section className="bg-primary py-16 text-primary-foreground dark:bg-card dark:text-card-foreground md:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why Emperical"
          title="Why the world's researchers publish with us"
          description="Decades of scholarly publishing, distilled into the commitments we make to every author."
          className="[&_p]:text-primary-foreground/70 dark:[&_p]:text-muted-foreground [&_h2]:text-primary-foreground dark:[&_h2]:text-foreground"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={(i % 3) * 0.08}>
              <div className="h-full rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur-sm transition-colors hover:bg-primary-foreground/10 dark:border-border dark:bg-secondary/40 dark:hover:bg-secondary/70">
                <ServiceIcon name={reason.icon} className="h-7 w-7 text-accent" />
                <h3 className="mt-4 font-display text-lg font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm text-primary-foreground/70 dark:text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
