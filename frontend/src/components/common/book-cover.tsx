import type { Book } from "@/types";
import { cn, hashCode } from "@/lib/utils";

/**
 * Deterministic, CSS-generated book covers keep the catalogue fully
 * self-contained (no external image dependencies) while looking designed.
 */
const PALETTES = [
  { from: "#1d3557", to: "#2f4d7a", rule: "#d9b64c" },
  { from: "#432818", to: "#6f4518", rule: "#e6c979" },
  { from: "#1b4332", to: "#2d6a4f", rule: "#d8c07a" },
  { from: "#3d0b3d", to: "#5e2a6e", rule: "#dcbf6e" },
  { from: "#212738", to: "#3b4468", rule: "#c9a227" },
  { from: "#5f0f40", to: "#8a1c58", rule: "#e3bf5f" },
  { from: "#0b3948", to: "#155d75", rule: "#d9b64c" },
  { from: "#372e29", to: "#59504a", rule: "#d6b364" },
] as const;

interface BookCoverProps {
  book: Pick<Book, "id" | "title" | "subtitle" | "category">;
  className?: string;
  priority?: boolean;
}

export function BookCover({ book, className }: BookCoverProps) {
  const palette = PALETTES[hashCode(book.id) % PALETTES.length];
  return (
    <div
      role="img"
      aria-label={`Cover of ${book.title}`}
      className={cn(
        "relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-md p-[8%] text-left shadow-md",
        className
      )}
      style={{ background: `linear-gradient(150deg, ${palette.from}, ${palette.to})` }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-[6%] w-px opacity-60"
        style={{ background: palette.rule }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 15%, #ffffff 0%, transparent 45%), radial-gradient(circle at 20% 90%, #ffffff 0%, transparent 40%)",
        }}
        aria-hidden
      />
      <div className="relative pl-[6%]">
        <p
          className="mb-[6%] text-[0.5rem] font-semibold uppercase tracking-[0.18em] leading-tight sm:text-[0.55rem]"
          style={{ color: palette.rule }}
        >
          {book.category}
        </p>
        <p className="font-display text-sm font-semibold leading-snug text-white sm:text-base md:text-lg">
          {book.title}
        </p>
        {book.subtitle && (
          <p className="mt-[4%] text-[0.6rem] leading-snug text-white/75 sm:text-xs">
            {book.subtitle}
          </p>
        )}
      </div>
      <div className="relative flex items-center gap-1.5 pl-[6%]">
        <span
          className="inline-block h-3 w-3 rotate-45 border"
          style={{ borderColor: palette.rule }}
          aria-hidden
        />
        <span className="text-[0.5rem] font-medium uppercase tracking-[0.22em] text-white/85">
          Emperical
        </span>
      </div>
    </div>
  );
}
