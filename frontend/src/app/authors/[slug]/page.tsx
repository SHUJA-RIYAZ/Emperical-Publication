import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, GraduationCap, Mail, MapPin } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import {
  GoogleScholarIcon,
  LinkedInIcon,
  OrcidIcon,
  XTwitterIcon,
} from "@/components/common/brand-icons";
import { ProfileAvatar } from "@/components/common/profile-avatar";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAuthorBySlug, getBooksByAuthor } from "@/services/authors.service";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

// Fully dynamic: content created in the admin panel appears immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Author Not Found" };
  return {
    title: author.name,
    description: `${author.name}, ${author.title} at ${author.institution}. Publications, research interests, and books published with Emperical.`,
  };
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const authorBooks = await getBooksByAuthor(author);

  const socials = [
    { label: "ORCID profile", icon: OrcidIcon, href: author.social.orcid },
    { label: "Google Scholar profile", icon: GoogleScholarIcon, href: author.social.googleScholar },
    { label: "LinkedIn profile", icon: LinkedInIcon, href: author.social.linkedin },
    { label: "X (Twitter) profile", icon: XTwitterIcon, href: author.social.twitter },
  ].filter((s) => s.href);

  const stats = [
    { label: "Books with Emperical", value: authorBooks.length || author.booksPublished },
    { label: "h-index", value: author.hIndex },
    { label: "Citations", value: author.citations.toLocaleString() },
    { label: "Publications", value: author.publications.length },
  ];

  return (
    <>
      <section className="border-b bg-secondary/40">
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs
            items={[{ label: "Authors", href: "/authors" }, { label: author.name }]}
            className="mb-8"
          />
          <Reveal>
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
              <ProfileAvatar name={author.name} className="h-28 w-28 text-3xl md:h-32 md:w-32" />
              <div className="flex-1">
                <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                  {author.name}
                </h1>
                <p className="mt-1 text-lg text-muted-foreground">{author.title}</p>
                <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-accent-foreground/70 dark:text-accent" aria-hidden />
                    {author.institution}
                  </span>
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-accent-foreground/70 dark:text-accent" aria-hidden />
                    {author.department}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent-foreground/70 dark:text-accent" aria-hidden />
                    {author.country}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${author.email}`}
                    className="inline-flex h-9 items-center gap-2 rounded-md border bg-card px-3 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    <Mail className="h-4 w-4" aria-hidden /> Contact
                  </a>
                  {socials.map(({ label, icon: Icon, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-md border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
              <dl className="grid w-full grid-cols-2 gap-3 md:w-auto md:min-w-64">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border bg-card p-4 text-center">
                    <dd className="font-display text-xl font-semibold text-primary dark:text-accent">
                      {stat.value}
                    </dd>
                    <dt className="mt-1 text-xs text-muted-foreground">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page grid gap-12 py-12 md:py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-semibold">Biography</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{author.bio}</p>

          <h2 className="mt-12 font-display text-2xl font-semibold">Selected publications</h2>
          <div className="mt-4 overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Venue</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="text-right">Year</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {author.publications.map((pub) => (
                  <TableRow key={pub.title}>
                    <TableCell className="font-medium">{pub.title}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {pub.venue}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="font-normal">
                        {pub.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{pub.year}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <aside>
          <h2 className="font-display text-2xl font-semibold">Research interests</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {author.researchInterests.map((interest) => (
              <Badge key={interest} variant="secondary" className="px-3 py-1 font-normal">
                {interest}
              </Badge>
            ))}
          </div>
        </aside>
      </section>

      {authorBooks.length > 0 && (
        <section className="bg-secondary/40 py-14 md:py-20">
          <div className="container-page">
            <SectionHeading
              eyebrow="With Emperical"
              title={`Books by ${author.name.replace(/^(Dr|Prof)\.?\s+/, "")}`}
              align="left"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {authorBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
