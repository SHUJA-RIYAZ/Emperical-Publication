"use client";

import { useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AuthorCard } from "@/components/authors/author-card";
import { AuthorCardSkeleton } from "@/components/authors/author-card-skeleton";
import { Reveal, staggerContainer, staggerItem } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/use-async";
import { getFeaturedAuthors } from "@/services/authors.service";

export function FeaturedAuthors() {
  const fetcher = useCallback(() => getFeaturedAuthors(), []);
  const { data: authors, loading } = useAsync(fetcher);

  return (
    <section className="bg-secondary/40 py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Our Authors"
          title="The minds behind the books"
          description="Emperical authors hold positions at the world's leading universities and research institutes."
        />
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <AuthorCardSkeleton key={i} />
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
            {authors?.map((author) => (
              <motion.div key={author.id} variants={staggerItem}>
                <AuthorCard author={author} />
              </motion.div>
            ))}
          </motion.div>
        )}
        <Reveal className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/authors">
              Browse the author directory <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
