import type { Metadata } from "next";
import { AuthorsDirectory } from "@/components/authors/authors-directory";
import { PageHeader } from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Author Directory",
  description:
    "Meet the 1,800+ researchers who publish with Emperical International Publication — professors, clinicians, and scholars from the world's leading institutions.",
};

export default function AuthorsPage() {
  return (
    <>
      <PageHeader
        title="Author Directory"
        description="The researchers and scholars behind our catalogue, from 25 countries and counting."
        crumbs={[{ label: "Authors" }]}
      />
      <AuthorsDirectory />
    </>
  );
}
