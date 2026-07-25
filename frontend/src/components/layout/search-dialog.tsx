"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookMarked, BookOpen, Loader2, Newspaper, Search, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { searchSite, type SearchHit, type SearchResults } from "@/services/search.service";

const GROUPS = [
  { key: "books", label: "Books", icon: BookOpen, path: "/books" },
  { key: "authors", label: "Authors", icon: UserRound, path: "/authors" },
  { key: "journals", label: "Journals", icon: BookMarked, path: "/journals" },
  { key: "blogs", label: "Articles", icon: Newspaper, path: "/blog" },
] as const;

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(term, 300);

  useEffect(() => {
    if (!open) return;
    if (!debounced.trim()) {
      setResults(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchSite(debounced).then((data) => {
      if (!cancelled) {
        setResults(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [debounced, open]);

  // Ctrl/Cmd+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const renderGroup = (label: string, Icon: typeof BookOpen, path: string, hits: SearchHit[]) => {
    if (hits.length === 0) return null;
    return (
      <div key={label} className="py-2">
        <p className="px-1 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <ul>
          {hits.map((hit) => (
            <li key={`${hit.type}-${hit.slug}`}>
              <Link
                href={`${path}/${hit.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 rounded-md px-1 py-2.5 transition-colors hover:bg-secondary"
              >
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground/70 dark:text-accent"
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{hit.title}</span>
                  {hit.subtitle && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {hit.subtitle}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Search the site (Ctrl+K)">
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className="top-[12%] translate-y-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle>Search Emperical</DialogTitle>
          <DialogDescription>
            Books, authors, journals, and articles — all in one place.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. quantum computing, Whitfield, open access…"
            className="pl-9"
            aria-label="Search the site"
          />
        </div>
        <div className="max-h-[46vh] min-h-[140px] divide-y overflow-y-auto" aria-live="polite">
          {loading && (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching…
            </div>
          )}

          {!loading && !debounced.trim() && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Start typing to search the catalogue, author directory, journals, and blog.
            </p>
          )}

          {!loading && results && results.total === 0 && debounced.trim() && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nothing found for &ldquo;{debounced}&rdquo;.
            </p>
          )}

          {!loading &&
            results &&
            results.total > 0 &&
            GROUPS.map((group) =>
              renderGroup(group.label, group.icon, group.path, results[group.key])
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
