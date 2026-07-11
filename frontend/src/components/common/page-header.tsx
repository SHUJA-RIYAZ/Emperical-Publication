import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumb";
import { Reveal } from "./reveal";

interface PageHeaderProps {
  title: string;
  description?: string;
  crumbs: Crumb[];
}

/** Shared hero band used at the top of every inner page. */
export function PageHeader({ title, description, crumbs }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b bg-primary text-primary-foreground dark:bg-card dark:text-card-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 20%, oklch(0.78 0.12 85) 0%, transparent 40%), radial-gradient(circle at 10% 90%, oklch(0.78 0.12 85) 0%, transparent 30%)",
        }}
        aria-hidden
      />
      <div className="container-page relative py-14 md:py-20">
        <Reveal direction="none">
          <Breadcrumbs
            items={crumbs}
            className="mb-5 [&_a]:text-primary-foreground/60 [&_a:hover]:text-primary-foreground [&_span[aria-current]]:text-primary-foreground dark:[&_a]:text-muted-foreground dark:[&_a:hover]:text-foreground dark:[&_span[aria-current]]:text-foreground"
          />
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-primary-foreground/75 dark:text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
