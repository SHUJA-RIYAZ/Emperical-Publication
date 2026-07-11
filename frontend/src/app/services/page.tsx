import type { Metadata } from "next";
import { ServicesDirectory } from "@/components/services/services-directory";
import { PageHeader } from "@/components/common/page-header";
import { CallToAction } from "@/components/home/cta";

export const metadata: Metadata = {
  title: "Publishing Services",
  description:
    "Twenty end-to-end publishing services — editorial, production, distribution, marketing, and author services — from an internationally recognised academic publisher.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Publishing Services"
        description="Everything your manuscript needs, from first evaluation to bookshelves in 92 countries."
        crumbs={[{ label: "Services" }]}
      />
      <ServicesDirectory />
      <CallToAction />
    </>
  );
}
