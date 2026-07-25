import type { Metadata } from "next";
import { Compass, Eye } from "lucide-react";
import {
  AboutLeadership,
  AboutMilestones,
  AboutStats,
  AboutValues,
} from "@/components/about/about-dynamic";
import { PageHeader } from "@/components/common/page-header";
import { Reveal } from "@/components/common/reveal";
import { SITE } from "@/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE.name} — our history, mission, values, and the leadership team behind our scholarly publishing programme.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Emperical"
        description="Publishing rigorous, beautiful, globally accessible scholarship."
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

      <AboutValues />
      <AboutMilestones />
      <AboutLeadership />
    </>
  );
}
