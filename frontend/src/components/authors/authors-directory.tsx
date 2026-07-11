"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { staggerContainer, staggerItem } from "@/components/common/reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAsync } from "@/hooks/use-async";
import { useDebounce } from "@/hooks/use-debounce";
import { getAuthorCountries, getAuthors } from "@/services/authors.service";
import { AuthorCard } from "./author-card";
import { AuthorCardSkeleton } from "./author-card-skeleton";

export function AuthorsDirectory() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const debouncedSearch = useDebounce(search, 350);

  const countriesFetcher = useCallback(() => getAuthorCountries(), []);
  const { data: countries } = useAsync(countriesFetcher);

  const fetcher = useCallback(
    () => getAuthors({ search: debouncedSearch, country }),
    [debouncedSearch, country]
  );
  const { data: authors, loading, error, refetch } = useAsync(fetcher);

  return (
    <section className="container-page py-12 md:py-16">
      <div className="mb-8 rounded-xl border bg-card p-4 shadow-sm md:p-5">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div>
            <Label htmlFor="author-search" className="sr-only">
              Search authors
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="author-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, institution, or research interest…"
                className="pl-9"
              />
            </div>
          </div>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger aria-label="Filter by country">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {countries?.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="mt-4 border-t pt-4 text-sm text-muted-foreground" aria-live="polite">
          {loading ? "Loading directory…" : `${authors?.length ?? 0} author${authors?.length === 1 ? "" : "s"} found`}
        </p>
      </div>

      {error && <ErrorState onRetry={refetch} />}

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, i) => (
            <AuthorCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && !error && authors && authors.length === 0 && (
        <EmptyState
          title="No authors found"
          description="Try a different name, institution, or country."
          actionLabel="Clear search"
          onAction={() => {
            setSearch("");
            setCountry("all");
          }}
        />
      )}

      {!loading && !error && authors && authors.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {authors.map((author) => (
            <motion.div key={author.id} variants={staggerItem}>
              <AuthorCard author={author} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
