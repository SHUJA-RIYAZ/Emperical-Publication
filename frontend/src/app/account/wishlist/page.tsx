"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { BookCardSkeleton } from "@/components/books/book-card-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { getServerWishlist } from "@/services/account.service";
import { getBooks } from "@/services/books.service";
import type { Book } from "@/types";

export default function AccountWishlistPage() {
  const bookIds = useWishlist((s) => s.bookIds);
  const replaceAll = useWishlist((s) => s.replaceAll);
  const [books, setBooks] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setBooks(null);
    try {
      // Trust the server copy, then resolve the ids to full book records.
      const ids = await getServerWishlist();
      replaceAll(ids);
      if (ids.length === 0) {
        setBooks([]);
        return;
      }
      const result = await getBooks({ pageSize: 200 });
      setBooks(result.items.filter((b) => ids.includes(b.id)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load your wishlist");
    }
  }, [replaceAll]);

  useEffect(() => {
    load();
  }, [load]);

  // Reflect removals made from a card without a full refetch.
  const visible = books?.filter((b) => bookIds.includes(b.id)) ?? null;

  return (
    <div>
      <h2 className="font-display text-xl font-semibold">Wishlist</h2>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {visible ? `${visible.length} saved title${visible.length === 1 ? "" : "s"}` : "Loading…"}
        {" — synced to your account."}
      </p>

      {error && <ErrorState className="mt-6" description={error} onRetry={load} />}

      {!error && visible === null && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      )}

      {visible?.length === 0 && (
        <EmptyState
          className="mt-6"
          icon={<Heart className="h-6 w-6" />}
          title="Your wishlist is empty"
          description="Tap the heart on any title in the catalogue to save it here."
        />
      )}

      {visible && visible.length > 0 && (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <Button asChild variant="outline" className="mt-8">
            <Link href="/books">Browse more titles</Link>
          </Button>
        </>
      )}
    </div>
  );
}
