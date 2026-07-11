import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";
import { BlogBanner, BlogCard } from "@/components/blog/blog-card";
import { CommentsSection } from "@/components/blog/comments-section";
import { ProfileAvatar } from "@/components/common/profile-avatar";
import { SectionHeading } from "@/components/common/section-heading";
import { ShareButtons } from "@/components/common/share-buttons";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { getBlogBySlug, getRelatedPosts } from "@/services/blog.service";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Fully dynamic: content created in the admin panel appears immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);

  return (
    <>
      <article className="container-page py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
            className="mb-8"
          />
          <Badge variant="secondary">{post.category}</Badge>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <ProfileAvatar name={post.authorName} className="h-10 w-10 text-sm" />
              <div>
                <p className="text-sm font-medium">{post.authorName}</p>
                <p className="text-xs text-muted-foreground">{post.authorRole}</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" aria-hidden />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" aria-hidden />
              {post.readTimeMinutes} min read
            </span>
          </div>

          <BlogBanner post={post} className="mt-8 h-56 w-full rounded-xl md:h-72" />

          <div className="prose-custom mt-8 space-y-5">
            {post.content.map((paragraph, i) => (
              <p key={i} className={i === 0 ? "text-lg font-medium leading-relaxed" : "leading-relaxed text-muted-foreground"}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal">
                #{tag}
              </Badge>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium">Found this useful? Share it:</p>
            <ShareButtons title={post.title} />
          </div>

          <div className="mt-10 rounded-xl border bg-secondary/50 p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold">Get articles like this monthly</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join 40,000+ researchers on the Emperical insights newsletter.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>

          <CommentsSection />
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-secondary/40 py-14 md:py-20">
          <div className="container-page">
            <SectionHeading eyebrow="Keep Reading" title="Related articles" align="left" />
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
            <p className="mt-8">
              <Link href="/blog" className="text-sm font-medium text-primary underline-offset-4 hover:underline dark:text-accent">
                ← Back to all articles
              </Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
}
