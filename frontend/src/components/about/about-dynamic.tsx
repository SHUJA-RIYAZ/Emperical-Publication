"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { Counter } from "@/components/common/counter";
import { ProfileAvatar } from "@/components/common/profile-avatar";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { ServiceIcon } from "@/components/common/service-icon";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";

/** Stats grid, driven by admin-editable settings. */
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

export function AboutValues() {
  const { values } = useSettings();
  if (values.length === 0) return null;

  return (
    <section className="bg-secondary/40 py-16 md:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="What Guides Us" title="Our values" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={i * 0.07}>
              <div className="h-full rounded-xl border bg-card p-6 shadow-sm">
                <ServiceIcon
                  name={value.icon}
                  className="h-7 w-7 text-accent-foreground/80 dark:text-accent"
                />
                <h3 className="mt-4 font-display text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutMilestones() {
  const { site, milestones } = useSettings();

  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeading
        eyebrow="Our Story"
        title="Milestones along the way"
        description={`From a small imprint in ${site.founded} to a global publishing house.`}
      />
      {milestones.length > 0 && (
        <ol className="relative mx-auto max-w-2xl border-l pl-8">
          {milestones.map((m, i) => (
            <Reveal key={`${m.year}-${i}`} delay={i * 0.04}>
              <li className="relative mb-8 last:mb-0">
                <span
                  className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-2 border-accent bg-background"
                  aria-hidden
                />
                <p className="font-display text-lg font-semibold text-primary dark:text-accent">
                  {m.year}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{m.event}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      )}
    </section>
  );
}

export function AboutLeadership() {
  const { leadership } = useSettings();

  return (
    <section className="bg-secondary/40 py-16 md:py-24" id="careers">
      <div className="container-page">
        <SectionHeading
          eyebrow="Leadership"
          title="The people behind the imprint"
          description="A leadership team drawn from publishing, academia, and library science."
        />
        {leadership.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((person, i) => (
              <Reveal key={person.name} delay={(i % 3) * 0.07}>
                <div className="flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <ProfileAvatar name={person.name} className="h-14 w-14 text-lg" />
                    <div>
                      <h3 className="font-display text-base font-semibold">{person.name}</h3>
                      <p className="text-sm text-accent-foreground/80 dark:text-accent">
                        {person.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{person.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
        <Reveal className="mt-12 rounded-xl border bg-card p-8 text-center shadow-sm">
          <BookOpenCheck
            className="mx-auto h-8 w-8 text-accent-foreground/80 dark:text-accent"
            aria-hidden
          />
          <h3 className="mt-4 font-display text-xl font-semibold">Careers at Emperical</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            We hire editors, designers, and publishing professionals across our offices.
            Speculative applications are always welcome via our contact page.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/contact">
              Get in touch <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
