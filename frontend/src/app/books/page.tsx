import type { Metadata } from "next";
import { BooksDirectory } from "@/components/books/books-directory";
import { PageHeader } from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Books Catalogue",
  description:
    "Browse our peer-reviewed academic books across ten disciplines. Search, filter by category, language, and year, and preview sample chapters.",
};

export default function BooksPage() {
  return (
    <>
      <PageHeader
        title="Books Catalogue"
        description="Peer-reviewed monographs, textbooks, and edited volumes across ten disciplines."
        crumbs={[{ label: "Books" }]}
      />
      <BooksDirectory />
    </>
  );
}
