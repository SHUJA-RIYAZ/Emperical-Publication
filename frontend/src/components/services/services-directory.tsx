"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { ServiceIcon } from "@/components/common/service-icon";
import { staggerContainer, staggerItem } from "@/components/common/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAsync } from "@/hooks/use-async";
import { getServices } from "@/services/content.service";
import type { Service } from "@/types";

const CATEGORIES: ("All" | Service["category"])[] = [
  "All",
  "Editorial",
  "Production",
  "Distribution",
  "Marketing",
  "Author Services",
];

export function ServicesDirectory() {
  const fetcher = useCallback(() => getServices(), []);
  const { data: services, loading, error, refetch } = useAsync(fetcher);
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(
    () => services?.filter((s) => category === "All" || s.category === category) ?? [],
    [services, category]
  );

  return (
    <section className="container-page py-14 md:py-20">
      <Tabs value={category} onValueChange={setCategory} className="mb-10">
        <TabsList className="h-auto flex-wrap justify-start gap-1">
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c} value={c} id={c === "Editorial" ? "editorial" : c === "Distribution" ? "distribution" : undefined}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {error && <ErrorState onRetry={refetch} />}

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6">
              <Skeleton className="h-11 w-11 rounded-lg" />
              <Skeleton className="mt-4 h-5 w-2/3" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title="No services in this category"
          description="Try selecting a different category above."
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <motion.div
          key={category}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {filtered.map((service) => (
            <motion.article
              key={service.id}
              id={service.slug}
              variants={staggerItem}
              whileHover={{ y: -5 }}
              className="flex h-full scroll-mt-24 flex-col rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-accent/15 dark:text-accent">
                  <ServiceIcon name={service.icon} />
                </div>
                {service.popular && <Badge variant="accent">Popular</Badge>}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{service.title}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {service.category}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{service.shortDescription}</p>
              <ul className="mt-4 space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-5">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/contact">
                    Enquire about this service <ArrowRight />
                  </Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  );
}
