import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="Emperical International Publication — home"
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-md bg-primary font-display text-lg font-bold text-primary-foreground transition-transform group-hover:scale-105 dark:bg-accent dark:text-accent-foreground"
        aria-hidden
      >
        E
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-semibold tracking-tight">
          Emperical
        </span>
        <span className="block text-[0.6rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          International Publication
        </span>
      </span>
    </Link>
  );
}
