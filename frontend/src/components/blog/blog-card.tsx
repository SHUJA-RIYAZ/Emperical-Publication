"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import { ProfileAvatar } from "@/components/common/profile-avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, hashCode } from "@/lib/utils";
import type { BlogPost } from "@/types";

const BANNER_GRADIENTS = [
  "linear-gradient(135deg, #1d3557, #457b9d)",
  "linear-gradient(135deg, #432818, #99582a)",
  "linear-gradient(135deg, #1b4332, #40916c)",
  "linear-gradient(135deg, #5f0f40, #9a1750)",
  "linear-gradient(135deg, #0b3948, #087e8b)",
  "linear-gradient(135deg, #3a0ca3, #7209b7)",
] as const;

export function BlogBanner({
  post,
  className,
}: {
  post: Pick<BlogPost, "id" | "category">;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ background: BANNER_GRADIENTS[hashCode(post.id) % BANNER_GRADIENTS.length] }}
      aria-hidden
    >
      <div className="flex h-full items-end p-4">
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {post.category}
        </span>
      </div>
    </div>
  );
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-lg"
    >
      <Link href={`/blog/${post.slug}`} tabIndex={-1}>
        <BlogBanner post={post} className="h-36 w-full" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            {formatDate(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {post.readTimeMinutes} min read
          </span>
        </div>
        <h3 className="mt-3 line-clamp-2 font-display text-lg font-semibold leading-snug">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-accent-foreground/80 dark:hover:text-accent"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2.5">
            <ProfileAvatar name={post.authorName} className="h-8 w-8 text-xs" />
            <div className="text-xs">
              <p className="font-medium">{post.authorName}</p>
              <p className="text-muted-foreground">{post.authorRole}</p>
            </div>
          </div>
          {post.featured && <Badge variant="accent">Featured</Badge>}
        </div>
      </div>
    </motion.article>
  );
}
