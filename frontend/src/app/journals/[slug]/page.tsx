import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookMarked,
  CalendarClock,
  Percent,
  Timer,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { ShareButtons } from "@/components/common/share-buttons";
import { JournalCard } from "@/components/journals/journal-card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getFeaturedJournals, getJournalBySlug } from "@/services/journals.service";

interface JournalPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: JournalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const journal = await getJournalBySlug(slug);
  if (!journal) return { title: "Journal Not Found" };
  return {
    title: journal.title,
    description: journal.description.slice(0, 160),
  };
}

export default async function JournalDetailsPage({ params }: JournalPageProps) {
  const { slug } = await params;
  const journal = await getJournalBySlug(slug);
  if (!journal) notFound();

  const related = (await getFeaturedJournals(4)).filter((j) => j.id !== journal.id).slice(0, 3);

  const metrics = [
    { icon: TrendingUp, label: "Impact Factor", value: journal.impactFactor.toFixed(1) },
    { icon: Percent, label: "CiteScore", value: journal.citeScore.toFixed(1) },
    { icon: Timer, label: "Review Time", value: `${journal.reviewTimeWeeks} weeks` },
    { icon: Percent, label: "Acceptance Rate", value: `${journal.acceptanceRate}%` },
    { icon: CalendarClock, label: "Frequency", value: journal.frequency },
    { icon: BookMarked, label: "Established", value: String(journal.established) },
  ];

  return (
    <>
      <section className="border-b bg-secondary/40">
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs
            items={[{ label: "Journals", href: "/journals" }, { label: journal.title }]}
            className="mb-8"
          />
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{journal.field}</Badge>
              {journal.openAccess && <Badge variant="success">Open Access</Badge>}
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {journal.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              ISSN {journal.issn} · e-ISSN {journal.eIssn}
            </p>
            <p className="mt-6 max-w-3xl text-muted-foreground">{journal.description}</p>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <UserRound className="h-4 w-4 text-accent-foreground/70 dark:text-accent" aria-hidden />
              Editor-in-Chief:{" "}
              <span className="font-medium text-foreground">{journal.editorInChief}</span>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/publish">
                  Submit to this journal <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact the editorial office</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Share:</span>
              <ShareButtons title={journal.title} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        <h2 className="font-display text-2xl font-semibold">Journal metrics</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border bg-card p-5 shadow-sm">
              <metric.icon
                className="h-5 w-5 text-accent-foreground/70 dark:text-accent"
                aria-hidden
              />
              <dd className="mt-3 font-display text-2xl font-semibold">{metric.value}</dd>
              <dt className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
                {metric.label}
              </dt>
            </div>
          ))}
        </dl>

        <h2 className="mt-12 font-display text-2xl font-semibold">Abstracting &amp; indexing</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {journal.indexing.map((index) => (
            <Badge key={index} variant="outline" className="px-3 py-1 font-normal">
              {index}
            </Badge>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-secondary/40 py-14 md:py-20">
          <div className="container-page">
            <SectionHeading eyebrow="Explore More" title="Other journals" align="left" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((j) => (
                <JournalCard key={j.id} journal={j} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
