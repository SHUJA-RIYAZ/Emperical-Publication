"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/common/section-heading";
import { useSettings } from "@/hooks/use-settings";

export function ProcessTimeline() {
  const { process } = useSettings();

  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeading
        eyebrow="How It Works"
        title="Your publishing journey, step by step"
        description="A transparent, six-stage process — from first submission to bookshelves in 92 countries."
      />
      <ol className="relative mx-auto max-w-3xl">
        <div
          className="absolute left-5 top-2 h-[calc(100%-2rem)] w-px bg-border md:left-1/2"
          aria-hidden
        />
        {process.map((stage, i) => {
          const left = i % 2 === 0;
          return (
            <motion.li
              key={stage.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className={`relative mb-10 pl-14 last:mb-0 md:w-1/2 md:pl-0 ${
                left ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"
              }`}
            >
              <span
                className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground ring-4 ring-background dark:bg-accent dark:text-accent-foreground md:top-0 ${
                  left ? "md:left-auto md:-right-5" : "md:-left-5"
                }`}
                aria-hidden
              >
                {stage.step}
              </span>
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="font-display text-base font-semibold">
                  <span className="sr-only">Step {stage.step}: </span>
                  {stage.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{stage.description}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
