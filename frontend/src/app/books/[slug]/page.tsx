import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Calendar, FileText, Globe2, Hash, Layers } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { PdfPreviewModal } from "@/components/books/pdf-preview-modal";
import { WishlistButton } from "@/components/books/wishlist-button";
import { BookCover } from "@/components/common/book-cover";
import { ProfileAvatar } from "@/components/common/profile-avatar";
import { RatingStars } from "@/components/common/rating-stars";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { ShareButtons } from "@/components/common/share-buttons";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPrice } from "@/lib/utils";
import { getAuthorsByIds } from "@/services/authors.service";
import { getBookBySlug, getRelatedBooks } from "@/services/books.service";

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

// Fully dynamic: content created in the admin panel appears immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return { title: "Book Not Found" };
  return {
    title: book.title,
    description: book.description.slice(0, 160),
    openGraph: { title: book.title, description: book.description.slice(0, 200), type: "book" },
  };
}

export default async function BookDetailsPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const [bookAuthors, related] = await Promise.all([
    getAuthorsByIds(book.authorIds),
    getRelatedBooks(book, 4),
  ]);

  const details = [
    { icon: Hash, label: "ISBN", value: book.isbn },
    { icon: Calendar, label: "Published", value: formatDate(book.publicationDate) },
    { icon: FileText, label: "Pages", value: String(book.pages) },
    { icon: Globe2, label: "Language", value: book.language },
    { icon: Layers, label: "Formats", value: book.formats.join(", ") },
    { icon: BookOpen, label: "Category", value: book.category },
  ];

  return (
    <>
      <section className="border-b bg-secondary/40">
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs
            items={[{ label: "Books", href: "/books" }, { label: book.title }]}
            className="mb-8"
          />
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            <Reveal direction="right" className="mx-auto w-56 sm:w-64 lg:w-full">
              <BookCover book={book} className="shadow-xl" />
            </Reveal>
            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{book.category}</Badge>
                {book.bestseller && <Badge variant="accent">Bestseller</Badge>}
                {book.featured && <Badge variant="outline">Editor&rsquo;s Pick</Badge>}
              </div>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="mt-2 text-lg text-muted-foreground">{book.subtitle}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                <RatingStars rating={book.rating} reviewsCount={book.reviewsCount} />
                <p className="text-sm text-muted-foreground">
                  by{" "}
                  {bookAuthors.map((a, i) => (
                    <span key={a.id}>
                      {i > 0 && ", "}
                      <Link
                        href={`/authors/${a.slug}`}
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        {a.name}
                      </Link>
                    </span>
                  ))}
                </p>
              </div>
              <p className="mt-6 max-w-3xl text-muted-foreground">{book.description}</p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {book.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="font-display text-3xl font-semibold">
                  {formatPrice(book.price)}
                </span>
                <Separator orientation="vertical" className="hidden h-8 sm:block" />
                <Button size="lg" variant="accent" asChild>
                  <Link href="/contact">Order Enquiry</Link>
                </Button>
                <PdfPreviewModal bookTitle={book.title} />
                <WishlistButton book={book} variant="full" />
              </div>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Share:</span>
                <ShareButtons title={book.title} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Bibliographic details */}
      <section className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold">Bibliographic information</h2>
            <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.label} className="flex items-start gap-3">
                  <d.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground/70 dark:text-accent" aria-hidden />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {d.label}
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium">{d.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
          <aside aria-label="About the authors">
            <h2 className="font-display text-2xl font-semibold">About the author{bookAuthors.length > 1 ? "s" : ""}</h2>
            <div className="mt-6 space-y-4">
              {bookAuthors.map((author) => (
                <Link
                  key={author.id}
                  href={`/authors/${author.slug}`}
                  className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <ProfileAvatar name={author.name} className="h-12 w-12" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{author.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{author.institution}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* Related books */}
      {related.length > 0 && (
        <section className="bg-secondary/40 py-14 md:py-20">
          <div className="container-page">
            <SectionHeading eyebrow="You May Also Like" title="Related titles" align="left" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
