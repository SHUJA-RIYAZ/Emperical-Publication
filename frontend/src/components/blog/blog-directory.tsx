"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Search, Tag } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { staggerContainer, staggerItem } from "@/components/common/reveal";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAsync } from "@/hooks/use-async";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { getBlogCategories, getBlogTags, getBlogs } from "@/services/blog.service";
import { BlogCard } from "./blog-card";

export function BlogDirectory() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");
  const debouncedSearch = useDebounce(search, 350);

  const categoriesFetcher = useCallback(() => getBlogCategories(), []);
  const { data: categories } = useAsync(categoriesFetcher);
  const tagsFetcher = useCallback(() => getBlogTags(), []);
  const { data: tags } = useAsync(tagsFetcher);

  const fetcher = useCallback(
    () => getBlogs({ search: debouncedSearch, category, tag }),
    [debouncedSearch, category, tag]
  );
  const { data: posts, loading, error, refetch } = useAsync(fetcher);

  return (
    <section className="container-page py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_290px]">
        <div>
          <div className="mb-6">
            <Label htmlFor="blog-search" className="sr-only">
              Search articles
            </Label>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="blog-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="pl-9"
              />
            </div>
          </div>

          <Tabs value={category} onValueChange={setCategory} className="mb-8">
            <TabsList className="h-auto flex-wrap justify-start gap-1">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories?.map((c) => (
                <TabsTrigger key={c} value={c}>
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {error && <ErrorState onRetry={refetch} />}

          {loading && (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }, (_, i) => (
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
          )}

          {!loading && !error && posts && posts.length === 0 && (
            <EmptyState
              title="No articles found"
              description="Try different keywords or clear the filters."
              actionLabel="Clear filters"
              onAction={() => {
                setSearch("");
                setCategory("all");
                setTag("all");
              }}
            />
          )}

          {!loading && !error && posts && posts.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2"
            >
              {posts.map((post) => (
                <motion.div key={post.id} variants={staggerItem}>
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <aside className="space-y-8">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Tag className="h-4 w-4 text-accent-foreground/70 dark:text-accent" aria-hidden />
              Browse by tag
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setTag("all")}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                  tag === "all"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                )}
                aria-pressed={tag === "all"}
              >
                All
              </button>
              {tags?.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t === tag ? "all" : t)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    t === tag
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  )}
                  aria-pressed={t === tag}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Subscribe to insights</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One email a month. Publishing guidance, calls for papers, no noise.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Popular categories</h2>
            <ul className="mt-4 space-y-2">
              {categories?.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setCategory(c)}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                  >
                    {c}
                    <Badge variant="secondary" className="font-normal">
                      →
                    </Badge>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
