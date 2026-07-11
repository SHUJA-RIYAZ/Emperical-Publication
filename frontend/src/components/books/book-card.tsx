"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookCover } from "@/components/common/book-cover";
import { RatingStars } from "@/components/common/rating-stars";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Book } from "@/types";
import { WishlistButton } from "./wishlist-button";

interface BookCardProps {
  book: Book;
  layout?: "grid" | "list";
}

export function BookCard({ book, layout = "grid" }: BookCardProps) {
  if (layout === "list") {
    return (
      <motion.article
        whileHover={{ y: -2 }}
        className="group relative flex gap-5 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <Link href={`/books/${book.slug}`} className="w-24 shrink-0 sm:w-28" tabIndex={-1}>
          <BookCover book={book} />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Badge variant="secondary" className="mb-1.5">
                {book.category}
              </Badge>
              <h3 className="font-display text-base font-semibold leading-snug">
                <Link
                  href={`/books/${book.slug}`}
                  className="transition-colors hover:text-accent-foreground/80 dark:hover:text-accent"
                >
                  {book.title}
                </Link>
              </h3>
            </div>
            <WishlistButton book={book} />
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{book.description}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-xs text-muted-foreground">
            <RatingStars rating={book.rating} reviewsCount={book.reviewsCount} />
            <span>{book.publicationYear}</span>
            <span>{book.language}</span>
            <span className="ml-auto text-sm font-semibold text-foreground">
              {formatPrice(book.price)}
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group relative flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative">
        <Link href={`/books/${book.slug}`} tabIndex={-1}>
          <BookCover book={book} className="transition-transform duration-300" />
        </Link>
        <div className="absolute right-2 top-2">
          <WishlistButton book={book} />
        </div>
        {book.bestseller && (
          <Badge variant="accent" className="absolute left-2 top-2 shadow">
            Bestseller
          </Badge>
        )}
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {book.category}
        </p>
        <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold leading-snug">
          <Link
            href={`/books/${book.slug}`}
            className="transition-colors hover:text-accent-foreground/80 dark:hover:text-accent"
          >
            {book.title}
          </Link>
        </h3>
        <div className="mt-2">
          <RatingStars rating={book.rating} reviewsCount={book.reviewsCount} />
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm font-semibold">{formatPrice(book.price)}</span>
          <span className="text-xs text-muted-foreground">{book.publicationYear}</span>
        </div>
      </div>
    </motion.article>
  );
}
