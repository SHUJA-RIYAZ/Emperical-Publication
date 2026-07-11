import type { Metadata } from "next";
import { BlogDirectory } from "@/components/blog/blog-directory";
import { PageHeader } from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Publishing guidance, research integrity, open access policy, and industry analysis from the Emperical editorial team.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="Blog & Insights"
        description="Practical publishing guidance and industry perspective from our editors."
        crumbs={[{ label: "Blog" }]}
      />
      <BlogDirectory />
    </>
  );
}
