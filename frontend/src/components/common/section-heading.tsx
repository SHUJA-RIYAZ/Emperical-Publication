import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-10 max-w-2xl md:mb-14",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground/80 dark:text-accent">
          <span className="mr-2 inline-block h-px w-6 bg-accent align-middle" aria-hidden />
          {eyebrow}
          {align === "center" && (
            <span className="ml-2 inline-block h-px w-6 bg-accent align-middle" aria-hidden />
          )}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-muted-foreground text-balance">{description}</p>}
    </Reveal>
  );
}
