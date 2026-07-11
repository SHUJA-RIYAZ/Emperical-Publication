"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, LayoutGrid, List, Search } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BOOK_CATEGORIES, BOOK_LANGUAGES } from "@/constants";
import { useAsync } from "@/hooks/use-async";
import { useDebounce } from "@/hooks/use-debounce";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { getBooks, getBookYears } from "@/services/books.service";
import type { BookQuery } from "@/types";
import { BookCard } from "./book-card";
import { BookCardSkeleton } from "./book-card-skeleton";

const SORT_OPTIONS: { value: NonNullable<BookQuery["sort"]>; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
];

const PAGE_SIZE = 12;

export function BooksDirectory() {
  const searchParams = useSearchParams();
  const wishlistIds = useWishlist((s) => s.bookIds);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<NonNullable<BookQuery["sort"]>>("newest");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [wishlistOnly, setWishlistOnly] = useState(searchParams.get("view") === "wishlist");

  const debouncedSearch = useDebounce(search, 350);

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, language, year, sort, wishlistOnly]);

  const yearsFetcher = useCallback(() => getBookYears(), []);
  const { data: years } = useAsync(yearsFetcher);

  const fetcher = useCallback(
    () =>
      getBooks({
        search: debouncedSearch,
        category,
        language,
        year,
        sort,
        page: wishlistOnly ? 1 : page,
        pageSize: wishlistOnly ? 200 : PAGE_SIZE,
      }),
    [debouncedSearch, category, language, year, sort, page, wishlistOnly]
  );
  const { data, loading, error, refetch } = useAsync(fetcher);

  // Wishlist view filters the full result set client-side, then re-paginates.
  const view = useMemo(() => {
    if (!data) return null;
    if (!wishlistOnly) return data;
    const items = data.items.filter((b) => wishlistIds.includes(b.id));
    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    return {
      items: items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
      total: items.length,
      page: safePage,
      pageSize: PAGE_SIZE,
      totalPages,
    };
  }, [data, wishlistOnly, wishlistIds, page]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setLanguage("all");
    setYear("all");
    setSort("newest");
    setWishlistOnly(false);
  };

  return (
    <section className="container-page py-12 md:py-16">
      {/* Filter bar */}
      <div className="mb-8 rounded-xl border bg-card p-4 shadow-sm md:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            <Label htmlFor="book-search" className="sr-only">
              Search books
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="book-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, tag, or ISBN…"
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <Label className="sr-only">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger aria-label="Filter by category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {BOOK_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="sr-only">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger aria-label="Filter by language">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All languages</SelectItem>
                {BOOK_LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="sr-only">Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger aria-label="Filter by publication year">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All years</SelectItem>
                {years?.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="sr-only">Sort</Label>
            <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
              <SelectTrigger aria-label="Sort books">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {loading ? "Loading catalogue…" : `${view?.total ?? 0} title${view?.total === 1 ? "" : "s"} found`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant={wishlistOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setWishlistOnly((w) => !w)}
              aria-pressed={wishlistOnly}
            >
              <Heart className={cn(wishlistOnly && "fill-current")} /> Wishlist
              {wishlistIds.length > 0 && ` (${wishlistIds.length})`}
            </Button>
            <div className="flex rounded-md border" role="group" aria-label="Layout">
              <Button
                variant={layout === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={() => setLayout("grid")}
                aria-label="Grid view"
                aria-pressed={layout === "grid"}
              >
                <LayoutGrid />
              </Button>
              <Button
                variant={layout === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-l-none"
                onClick={() => setLayout("list")}
                aria-label="List view"
                aria-pressed={layout === "list"}
              >
                <List />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorState onRetry={refetch} />}

      {loading && (
        <div
          className={cn(
            layout === "grid"
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "flex flex-col gap-4"
          )}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <BookCardSkeleton key={i} layout={layout} />
          ))}
        </div>
      )}

      {!loading && !error && view && view.items.length === 0 && (
        <EmptyState
          icon={wishlistOnly ? <Heart className="h-6 w-6" /> : undefined}
          title={wishlistOnly ? "Your wishlist is empty" : "No books match your filters"}
          description={
            wishlistOnly
              ? "Tap the heart on any book to save it here for later."
              : "Try adjusting your search terms or clearing the filters."
          }
          actionLabel={wishlistOnly ? "Browse all books" : "Reset filters"}
          onAction={resetFilters}
        />
      )}

      {!loading && !error && view && view.items.length > 0 && (
        <>
          <div
            className={cn(
              layout === "grid"
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-4"
            )}
          >
            {view.items.map((book) => (
              <BookCard key={book.id} book={book} layout={layout} />
            ))}
          </div>
          <Pagination
            className="mt-10"
            page={view.page}
            totalPages={view.totalPages}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </section>
  );
}
