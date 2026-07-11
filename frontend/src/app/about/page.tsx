import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Compass, Eye, Globe2, HeartHandshake, Scale, Sparkles } from "lucide-react";
import { AboutStats, MilestonesHeading } from "@/components/about/about-dynamic";
import { PageHeader } from "@/components/common/page-header";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { ProfileAvatar } from "@/components/common/profile-avatar";
import { Button } from "@/components/ui/button";
import { SITE } from "@/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE.name} — our history, mission, values, and the leadership team behind 27 years of scholarly publishing excellence.`,
};

const VALUES = [
  { icon: Scale, title: "Integrity First", description: "Double-blind peer review, transparent contracts, and zero tolerance for predatory practices. Our reputation is our product." },
  { icon: Globe2, title: "Global by Design", description: "Multilingual publishing, equitable pricing for the Global South, and distribution built for every continent." },
  { icon: HeartHandshake, title: "Authors as Partners", description: "Fair royalties, dedicated support, and mentorship. When our authors succeed, scholarship succeeds." },
  { icon: Sparkles, title: "Craft & Care", description: "Award-winning design and meticulous production. Books are cultural artefacts — we treat them that way." },
] as const;

const MILESTONES = [
  { year: 1998, event: "Founded in New York as a specialist science imprint with three journals." },
  { year: 2004, event: "First international office opens in London; book programme launches." },
  { year: 2010, event: "Open access programme established — among the first mid-size publishers to commit." },
  { year: 2015, event: "1,000th book published; distribution network reaches 60 countries." },
  { year: 2019, event: "Author mentorship programme launches; multilingual publishing expands to five languages." },
  { year: 2023, event: "Print-on-demand facilities open on three continents; 4,000th title released." },
  { year: 2026, event: "Fifteen journals, 4,200+ books, and a community of 1,800 authors across 92 countries." },
] as const;

const LEADERSHIP = [
  { name: "Dr. Helena Marchetti", role: "Chief Executive Officer", bio: "Former editorial director at a major European science publisher; 25 years in scholarly publishing." },
  { name: "Prof. Samuel Adeyinka", role: "Editor-in-Chief", bio: "Emeritus professor of chemistry and champion of open science across the Global South." },
  { name: "Margaret Chen", role: "Director of Open Research", bio: "Architect of our open access programme and Research4Life partnership." },
  { name: "Tomás Herrera", role: "Head of Production & Design", bio: "Leads the studio behind 14 international book design awards." },
  { name: "Rebecca Osei", role: "Director of Library Relations", bio: "Builds the library partnerships that carry our titles into 92 countries." },
  { name: "Dr. Jonathan Pierce", role: "Senior Commissioning Editor", bio: "Has shepherded over 400 monographs from proposal to publication." },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Emperical"
        description="Twenty-seven years of publishing rigorous, beautiful, globally accessible scholarship."
        crumbs={[{ label: "About" }]}
      />

      {/* Mission & vision */}
      <section className="container-page py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-xl border bg-card p-8 shadow-sm">
              <Compass className="h-8 w-8 text-accent-foreground/80 dark:text-accent" aria-hidden />
              <h2 className="mt-4 font-display text-2xl font-semibold">Our Mission</h2>
              <p className="mt-3 text-muted-foreground">
                To make rigorous research permanent, discoverable, and accessible — by publishing
                peer-reviewed books and journals of exceptional quality and placing them in the
                hands of readers everywhere, regardless of geography or institutional wealth.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-xl border bg-card p-8 shadow-sm">
              <Eye className="h-8 w-8 text-accent-foreground/80 dark:text-accent" aria-hidden />
              <h2 className="mt-4 font-display text-2xl font-semibold">Our Vision</h2>
              <p className="mt-3 text-muted-foreground">
                A world where the best ideas win on merit: where a brilliant monograph from Lagos
                or Lahore reaches the same shelves as one from London, and where authors are
                treated as partners in the scholarly record, not suppliers to it.
              </p>
            </div>
          </Reveal>
        </div>

        <AboutStats />
      </section>

      {/* Values */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="What Guides Us" title="Our values" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.07}>
                <div className="h-full rounded-xl border bg-card p-6 shadow-sm">
                  <value.icon className="h-7 w-7 text-accent-foreground/80 dark:text-accent" aria-hidden />
                  <h3 className="mt-4 font-display text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* History timeline */}
      <section className="container-page py-16 md:py-24">
        <MilestonesHeading />
        <ol className="relative mx-auto max-w-2xl border-l pl-8">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.year} delay={i * 0.04}>
              <li className="relative mb-8 last:mb-0">
                <span
                  className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-2 border-accent bg-background"
                  aria-hidden
                />
                <p className="font-display text-lg font-semibold text-primary dark:text-accent">
                  {m.year}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{m.event}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Leadership */}
      <section className="bg-secondary/40 py-16 md:py-24" id="careers">
        <div className="container-page">
          <SectionHeading
            eyebrow="Leadership"
            title="The people behind the imprint"
            description="A leadership team drawn from publishing, academia, and library science."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LEADERSHIP.map((person, i) => (
              <Reveal key={person.name} delay={(i % 3) * 0.07}>
                <div className="flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <ProfileAvatar name={person.name} className="h-14 w-14 text-lg" />
                    <div>
                      <h3 className="font-display text-base font-semibold">{person.name}</h3>
                      <p className="text-sm text-accent-foreground/80 dark:text-accent">{person.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{person.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 rounded-xl border bg-card p-8 text-center shadow-sm">
            <BookOpenCheck className="mx-auto h-8 w-8 text-accent-foreground/80 dark:text-accent" aria-hidden />
            <h3 className="mt-4 font-display text-xl font-semibold">Careers at Emperical</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              We hire editors, designers, and publishing professionals across our New York and
              London offices. Speculative applications are always welcome via our contact page.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/contact">
                Get in touch <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
