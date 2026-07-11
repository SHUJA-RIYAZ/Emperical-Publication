import type { Metadata } from "next";
import { Clock3, MessageSquareText, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Reveal } from "@/components/common/reveal";
import { PublishForm } from "@/components/forms/publish-form";

export const metadata: Metadata = {
  title: "Publish Your Book",
  description:
    "Submit your manuscript to Emperical International Publication. Editorial decision within six weeks, transparent contracts, and global distribution.",
};

const ASSURANCES = [
  { icon: Clock3, title: "Decision in 4–6 weeks", description: "Every submission is acknowledged within two business days and reviewed by subject experts." },
  { icon: ShieldCheck, title: "Your work stays yours", description: "Submissions are confidential. We never share manuscripts outside the review process." },
  { icon: MessageSquareText, title: "Feedback either way", description: "Even declined manuscripts receive constructive reviewer comments — no silent rejections." },
] as const;

export default function PublishPage() {
  return (
    <>
      <PageHeader
        title="Publish Your Book"
        description="Five short steps to put your manuscript in front of our editorial board."
        crumbs={[{ label: "Publish Your Book" }]}
      />
      <section className="container-page py-12 md:py-16">
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {ASSURANCES.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07}>
              <div className="flex h-full items-start gap-4 rounded-xl border bg-card p-5 shadow-sm">
                <item.icon className="mt-0.5 h-6 w-6 shrink-0 text-accent-foreground/80 dark:text-accent" aria-hidden />
                <div>
                  <h2 className="text-sm font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <PublishForm />
      </section>
    </>
  );
}
