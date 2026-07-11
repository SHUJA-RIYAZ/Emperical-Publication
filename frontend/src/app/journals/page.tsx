import type { Metadata } from "next";
import { JournalsDirectory } from "@/components/journals/journals-directory";
import { PageHeader } from "@/components/common/page-header";
import { CallToAction } from "@/components/home/cta";

export const metadata: Metadata = {
  title: "Journals",
  description:
    "Fifteen international peer-reviewed journals — ten fully open access — indexed in Scopus, Web of Science, PubMed, and DOAJ.",
};

export default function JournalsPage() {
  return (
    <>
      <PageHeader
        title="Our Journals"
        description="Rigorous, indexed, and increasingly open access — journals for every discipline we serve."
        crumbs={[{ label: "Journals" }]}
      />
      <JournalsDirectory />
      <CallToAction />
    </>
  );
}
