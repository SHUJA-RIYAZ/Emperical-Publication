import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { TrustedBy } from "@/components/home/trusted-by";
import { FeaturedServices } from "@/components/home/featured-services";
import { FeaturedBooks } from "@/components/home/featured-books";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { FeaturedAuthors } from "@/components/home/featured-authors";
import { JournalsSection } from "@/components/home/journals-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { LatestBlogs } from "@/components/home/latest-blogs";
import { NewsletterSection, CallToAction } from "@/components/home/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <TrustedBy />
      <FeaturedServices />
      <FeaturedBooks />
      <WhyChooseUs />
      <ProcessTimeline />
      <FeaturedAuthors />
      <JournalsSection />
      <TestimonialsSection />
      <LatestBlogs />
      <NewsletterSection />
      <CallToAction />
    </>
  );
}
