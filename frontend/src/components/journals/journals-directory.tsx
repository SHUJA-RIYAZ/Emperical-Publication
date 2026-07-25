"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarClock, Percent, Search, Timer, UserRound } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { staggerContainer, staggerItem } from "@/components/common/reveal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { useDebounce } from "@/hooks/use-debounce";
import { getJournals } from "@/services/journals.service";

export function JournalsDirectory() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);

  const fetcher = useCallback(() => getJournals(debouncedSearch), [debouncedSearch]);
  const { data: journals, loading, error, refetch } = useAsync(fetcher);

  return (
    <section className="container-page py-12 md:py-16">
      <div className="mb-8 rounded-xl border bg-card p-4 shadow-sm md:p-5">
        <Label htmlFor="journal-search" className="sr-only">
          Search journals
        </Label>
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id="journal-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search journals by title or field…"
            className="pl-9"
          />
        </div>
        <p className="mt-4 border-t pt-4 text-sm text-muted-foreground" aria-live="polite">
          {loading ? "Loading journals…" : `${journals?.length ?? 0} journal${journals?.length === 1 ? "" : "s"} found`}
        </p>
      </div>

      {error && <ErrorState onRetry={refetch} />}

      {loading && (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-2 h-3 w-1/2" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
              <div className="mt-5 grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }, (_, j) => (
                  <Skeleton key={j} className="h-14" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && journals && journals.length === 0 && (
        <EmptyState
          title="No journals found"
          description="Try a different journal title or research field."
          actionLabel="Clear search"
          onAction={() => setSearch("")}
        />
      )}

      {!loading && !error && journals && journals.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-6 lg:grid-cols-2"
        >
          {journals.map((journal) => (
            <motion.article
              key={journal.id}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-xl font-semibold leading-snug">
                    <Link
                      href={`/journals/${journal.slug}`}
                      className="transition-colors hover:text-accent-foreground/80 dark:hover:text-accent"
                    >
                      {journal.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ISSN {journal.issn} · e-ISSN {journal.eIssn} · Est. {journal.established}
                  </p>
                </div>
                <div className="flex gap-2">
                  {journal.openAccess && <Badge variant="success">Open Access</Badge>}
                  <Badge variant="secondary">{journal.field}</Badge>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{journal.description}</p>
              <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Percent, label: "Impact Factor", value: journal.impactFactor.toFixed(1) },
                  { icon: Timer, label: "Review Time", value: `${journal.reviewTimeWeeks} wks` },
                  { icon: CalendarClock, label: "Frequency", value: journal.frequency },
                  { icon: Percent, label: "Acceptance", value: `${journal.acceptanceRate}%` },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-secondary/60 p-3 text-center">
                    <dd className="text-sm font-semibold">{stat.value}</dd>
                    <dt className="mt-0.5 text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserRound className="h-4 w-4 text-accent-foreground/70 dark:text-accent" aria-hidden />
                  Editor-in-Chief: <span className="font-medium text-foreground">{journal.editorInChief}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {journal.indexing.map((index) => (
                    <Badge key={index} variant="outline" className="font-normal">
                      {index}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  );
}
