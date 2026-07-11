"use client";

import { useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal, staggerContainer, staggerItem } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { ServiceIcon } from "@/components/common/service-icon";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { getFeaturedServices } from "@/services/content.service";

export function FeaturedServices() {
  const fetcher = useCallback(() => getFeaturedServices(6), []);
  const { data: services, loading } = useAsync(fetcher);

  return (
    <section className="bg-secondary/40 py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="What We Do"
          title="End-to-end publishing services"
          description="From manuscript evaluation to global distribution, every stage of your book's journey is handled by specialists."
        />
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="rounded-xl border bg-card p-6">
                <Skeleton className="h-11 w-11 rounded-lg" />
                <Skeleton className="mt-4 h-5 w-2/3" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-4/5" />
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
            {services?.map((service) => (
              <motion.article
                key={service.id}
                variants={staggerItem}
                whileHover={{ y: -5 }}
                className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground dark:bg-accent/15 dark:text-accent dark:group-hover:bg-accent dark:group-hover:text-accent-foreground">
                  <ServiceIcon name={service.icon} />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.shortDescription}</p>
                <Link
                  href={`/services#${service.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80 dark:text-accent"
                >
                  Learn more <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
        <Reveal className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/services">
              View all 20 services <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
