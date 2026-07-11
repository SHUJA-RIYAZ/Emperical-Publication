"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Counter } from "@/components/common/counter";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";

export function Intro() {
  const { site, stats } = useSettings();

  return (
    <section className="container-page py-16 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="right">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground/80 dark:text-accent">
            <span className="mr-2 inline-block h-px w-6 bg-accent align-middle" aria-hidden />
            Who We Are
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            A publishing house built on scholarly integrity
          </h2>
          <p className="mt-5 text-muted-foreground">
            Founded in {site.founded}, {site.name} has grown from a specialist science imprint
            into a full-service international publisher spanning ten disciplines. Our editorial
            boards include more than 300 active researchers from the world&rsquo;s leading
            universities.
          </p>
          <p className="mt-4 text-muted-foreground">
            We believe publishing should serve scholarship — not the other way around. That means
            rigorous double-blind peer review for every title, transparent author contracts, fair
            royalties, and a global distribution network that puts your work in the hands of
            readers on every continent.
          </p>
          <Button asChild variant="link" className="mt-4 px-0">
            <Link href="/about">
              Learn more about our story <ArrowRight />
            </Link>
          </Button>
        </Reveal>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="rounded-xl border bg-card p-6 text-center shadow-sm md:p-8">
                <p className="font-display text-3xl font-semibold text-primary dark:text-accent md:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
