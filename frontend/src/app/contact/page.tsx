import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { FaqAccordion } from "@/components/common/faq-accordion";
import { PageHeader } from "@/components/common/page-header";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Emperical International Publication — editorial enquiries, author services, sales, rights, and media.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Editors, author-services managers, and support staff across three time zones."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <Reveal>
            <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
              <h2 className="font-display text-2xl font-semibold">Send us a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose the right department and we&rsquo;ll respond within one business day.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          <ContactInfo />
        </div>

        {/* Map placeholder */}
        <Reveal className="mt-12">
          <div
            className="relative flex h-72 items-center justify-center overflow-hidden rounded-xl border bg-secondary md:h-96"
            role="img"
            aria-label="Map showing the location of our New York headquarters"
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
              aria-hidden
            />
            <div className="relative z-10 flex flex-col items-center gap-3 rounded-xl border bg-card/95 px-8 py-6 text-center shadow-lg backdrop-blur">
              <MapPin className="h-8 w-8 text-accent-foreground/80 dark:text-accent" aria-hidden />
              <p className="font-display font-semibold">One Scholars Plaza, New York</p>
              <p className="text-sm text-muted-foreground">
                Interactive map will be embedded here on launch.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-secondary/40 py-14 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Answers to the questions we hear most from prospective authors."
          />
          <div className="mx-auto max-w-3xl">
            <FaqAccordion />
          </div>
        </div>
      </section>
    </>
  );
}
