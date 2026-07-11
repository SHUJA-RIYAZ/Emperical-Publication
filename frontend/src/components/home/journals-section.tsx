"use client";

import { useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal, staggerContainer, staggerItem } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { JournalCard } from "@/components/journals/journal-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { getFeaturedJournals } from "@/services/journals.service";

export function JournalsSection() {
  const fetcher = useCallback(() => getFeaturedJournals(6), []);
  const { data: journals, loading } = useAsync(fetcher);

  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeading
        eyebrow="Journals"
        title="Peer-reviewed journals across the disciplines"
        description="Fifteen international journals — ten fully open access — indexed in Scopus, Web of Science, and beyond."
      />
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6">
              <Skeleton className="h-11 w-11 rounded-lg" />
              <Skeleton className="mt-4 h-5 w-3/4" />
              <Skeleton className="mt-2 h-3 w-1/2" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {journals?.map((journal) => (
            <motion.div key={journal.id} variants={staggerItem}>
              <JournalCard journal={journal} />
            </motion.div>
          ))}
        </motion.div>
      )}
      <Reveal className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link href="/journals">
            View all journals <ArrowRight />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}
