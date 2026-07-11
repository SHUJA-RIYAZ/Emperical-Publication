"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, MapPin } from "lucide-react";
import { ProfileAvatar } from "@/components/common/profile-avatar";
import { Badge } from "@/components/ui/badge";
import type { Author } from "@/types";

export function AuthorCard({ author }: { author: Author }) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center gap-4">
        <ProfileAvatar name={author.name} className="h-14 w-14 text-lg" />
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold">
            <Link
              href={`/authors/${author.slug}`}
              className="transition-colors hover:text-accent-foreground/80 dark:hover:text-accent"
            >
              {author.name}
            </Link>
          </h3>
          <p className="truncate text-sm text-muted-foreground">{author.title}</p>
        </div>
      </div>
      <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{author.institution}</span>
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {author.country}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {author.researchInterests.slice(0, 3).map((interest) => (
          <Badge key={interest} variant="secondary" className="font-normal">
            {interest}
          </Badge>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-4 border-t pt-4 text-xs text-muted-foreground">
        <span>
          <strong className="text-foreground">{author.booksPublished}</strong> books
        </span>
        <span>
          h-index <strong className="text-foreground">{author.hIndex}</strong>
        </span>
        <span>
          <strong className="text-foreground">{author.citations.toLocaleString()}</strong> citations
        </span>
      </div>
    </motion.article>
  );
}
