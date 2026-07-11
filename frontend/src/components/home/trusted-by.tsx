"use client";

import { Landmark } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

export function TrustedBy() {
  const { trustedBy } = useSettings();
  const items = [...trustedBy, ...trustedBy]; // duplicated for a seamless marquee loop

  return (
    <section className="border-y bg-secondary/50 py-8" aria-label="Trusted by leading institutions">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Trusted by leading institutions worldwide
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" aria-hidden />
        <ul className="flex w-max animate-marquee items-center gap-12 hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:w-full">
          {items.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="flex shrink-0 items-center gap-2.5 text-sm font-medium text-muted-foreground"
              aria-hidden={i >= trustedBy.length}
            >
              <Landmark className="h-4 w-4 text-accent-foreground/60 dark:text-accent" aria-hidden />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
