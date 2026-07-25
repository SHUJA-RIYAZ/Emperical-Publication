"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookMarked, CalendarClock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Journal } from "@/types";

export function JournalCard({ journal }: { journal: Journal }) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-accent/15 dark:text-accent">
          <BookMarked className="h-5 w-5" aria-hidden />
        </div>
        {journal.openAccess && <Badge variant="success">Open Access</Badge>}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold leading-snug">
        <Link
          href={`/journals/${journal.slug}`}
          className="transition-colors hover:text-accent-foreground/80 dark:hover:text-accent"
        >
          {journal.title}
        </Link>
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        ISSN {journal.issn} · {journal.field}
      </p>
      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{journal.description}</p>
      <div className="mt-auto grid grid-cols-2 gap-3 border-t pt-4 text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent-foreground/70 dark:text-accent" aria-hidden />
          <span>
            IF <strong>{journal.impactFactor.toFixed(1)}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-accent-foreground/70 dark:text-accent" aria-hidden />
          <span>{journal.frequency}</span>
        </div>
      </div>
    </motion.article>
  );
}
