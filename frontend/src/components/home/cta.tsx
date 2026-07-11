import Link from "next/link";
import { ArrowRight, MailOpen } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  return (
    <section className="border-y bg-secondary/40 py-16 md:py-20">
      <div className="container-page">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-accent/15 dark:text-accent">
            <MailOpen className="h-6 w-6" aria-hidden />
          </div>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Never miss a call for papers
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Join 40,000+ researchers receiving our monthly digest — new titles, journal calls,
            publishing tips, and early-bird conference discounts.
          </p>
          <div className="mt-7 w-full max-w-md">
            <NewsletterForm className="mx-auto" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            No spam. Unsubscribe anytime. We never share your address.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground dark:bg-card dark:text-card-foreground md:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, oklch(0.78 0.12 85) 0%, transparent 40%), radial-gradient(circle at 90% 85%, oklch(0.78 0.12 85) 0%, transparent 35%)",
        }}
        aria-hidden
      />
      <div className="container-page relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-5xl">
            Ready to share your research with the world?
          </h2>
          <p className="mt-4 text-primary-foreground/75 dark:text-muted-foreground md:text-lg">
            Submit your manuscript today and receive an editorial decision within six weeks — with
            constructive feedback either way.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="accent">
              <Link href="/publish">
                Start Your Submission <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:border-border dark:text-foreground dark:hover:bg-secondary"
            >
              <Link href="/contact">Talk to an Editor</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
