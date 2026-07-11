import { Award, Clock3, Globe2, HandCoins, ShieldCheck, Users2 } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Uncompromising Peer Review",
    description:
      "Every title is vetted by at least two subject experts through a double-blind process overseen by our 300-member editorial board.",
  },
  {
    icon: Globe2,
    title: "Genuinely Global Reach",
    description:
      "Distribution partnerships in 92 countries, print-on-demand on three continents, and e-books on every major platform.",
  },
  {
    icon: HandCoins,
    title: "Fair, Transparent Royalties",
    description:
      "Up to 25% royalties on net receipts, quarterly statements, and a real-time sales dashboard — no fine print.",
  },
  {
    icon: Clock3,
    title: "Predictable Timelines",
    description:
      "Editorial decisions in 4–6 weeks and publication within 6–9 months of contract. We publish on schedule, every time.",
  },
  {
    icon: Users2,
    title: "Author-First Support",
    description:
      "A dedicated author-services manager from submission to post-launch, plus mentorship for first-time academic authors.",
  },
  {
    icon: Award,
    title: "Award-Winning Production",
    description:
      "Our design studio has won 14 international book design awards. Complex equations, figures, and multilingual text — handled.",
  },
] as const;

export function WhyChooseUs() {
  return (
    <section className="bg-primary py-16 text-primary-foreground dark:bg-card dark:text-card-foreground md:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why Emperical"
          title="Why the world's researchers publish with us"
          description="Twenty-seven years of scholarly publishing, distilled into six commitments we make to every author."
          className="[&_p]:text-primary-foreground/70 dark:[&_p]:text-muted-foreground [&_h2]:text-primary-foreground dark:[&_h2]:text-foreground"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => (
            <Reveal key={reason.title} delay={(i % 3) * 0.08}>
              <div className="h-full rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur-sm transition-colors hover:bg-primary-foreground/10 dark:border-border dark:bg-secondary/40 dark:hover:bg-secondary/70">
                <reason.icon className="h-7 w-7 text-accent" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm text-primary-foreground/70 dark:text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
