"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpenCheck, Globe2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/common/book-cover";
import { books } from "@/data/books";
import { useSettings } from "@/hooks/use-settings";

const HERO_BOOKS = books.filter((b) => b.featured).slice(0, 3);

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Rigorous double-blind peer review" },
  { icon: Globe2, label: "Distribution across 92 countries" },
  { icon: BookOpenCheck, label: "4,200+ scholarly titles published" },
] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { site } = useSettings();

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground dark:bg-background dark:text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 10%, oklch(0.78 0.12 85) 0%, transparent 42%), radial-gradient(circle at 5% 95%, oklch(0.78 0.12 85) 0%, transparent 32%)",
        }}
        aria-hidden
      />
      <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:py-28">
        <div>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-medium tracking-wide text-accent"
          >
            Trusted by scholars in 92 countries since {site.founded}
          </motion.p>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Where Rigorous Research Becomes{" "}
            <span className="text-accent">Lasting Knowledge</span>
          </motion.h1>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-base text-primary-foreground/75 dark:text-muted-foreground md:text-lg"
          >
            {site.name} partners with the world&rsquo;s leading researchers to publish
            peer-reviewed books and journals that shape their fields — with editorial care,
            global reach, and author-first values.
          </motion.p>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild size="lg" variant="accent">
              <Link href="/publish">
                Publish Your Book <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:border-border dark:text-foreground dark:hover:bg-secondary"
            >
              <Link href="/books">Browse Catalogue</Link>
            </Button>
          </motion.div>
          <motion.ul
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col gap-3 text-sm text-primary-foreground/70 dark:text-muted-foreground sm:flex-row sm:gap-6"
          >
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-accent" aria-hidden />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="relative mx-auto hidden h-[420px] w-full max-w-md lg:block" aria-hidden>
          {HERO_BOOKS.map((book, i) => (
            <motion.div
              key={book.id}
              initial={reduceMotion ? false : { opacity: 0, y: 40, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: (i - 1) * 7 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.15 }}
              whileHover={{ y: -12, rotate: 0, zIndex: 10 }}
              className="absolute w-52 cursor-pointer"
              style={{ left: `${i * 26}%`, top: `${i * 8}%` }}
            >
              <BookCover book={book} className="shadow-2xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
