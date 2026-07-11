"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Loader2, Search } from "lucide-react";
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
import { searchBooksQuick } from "@/services/books.service";
import type { Book } from "@/types";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(term, 300);

  useEffect(() => {
    if (!open) return;
    if (!debounced.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchBooksQuick(debounced).then((books) => {
      if (!cancelled) {
        setResults(books);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Search books (Ctrl+K)">
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className="top-[20%] translate-y-0">
        <DialogHeader>
          <DialogTitle>Search the catalogue</DialogTitle>
          <DialogDescription>Find books by title, topic, or keyword.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. quantum computing, ethics, ISBN…"
            className="pl-9"
            aria-label="Search books"
          />
        </div>
        <div className="min-h-[120px]" aria-live="polite">
          {loading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching…
            </div>
          )}
          {!loading && debounced.trim() && results.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No books found for &ldquo;{debounced}&rdquo;.
            </p>
          )}
          {!loading && results.length > 0 && (
            <ul className="divide-y">
              {results.map((book) => (
                <li key={book.id}>
                  <Link
                    href={`/books/${book.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-1 py-3 transition-colors hover:bg-secondary rounded-md"
                  >
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground/70 dark:text-accent" />
                    <span>
                      <span className="block text-sm font-medium">{book.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {book.category} · {book.publicationYear}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {!loading && !debounced.trim() && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Start typing to search 4,200+ titles.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
