"use client";

import { useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { Reveal, staggerContainer, staggerItem } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { getLatestBlogs } from "@/services/blog.service";

export function LatestBlogs() {
  const fetcher = useCallback(() => getLatestBlogs(3), []);
  const { data: posts, loading } = useAsync(fetcher);

  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeading
        eyebrow="Insights"
        title="From the Emperical blog"
        description="Publishing guidance, industry analysis, and behind-the-scenes perspectives from our editorial team."
      />
      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border bg-card">
              <Skeleton className="h-36 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {posts?.map((post) => (
            <motion.div key={post.id} variants={staggerItem}>
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}
      <Reveal className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link href="/blog">
            Read all articles <ArrowRight />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}
