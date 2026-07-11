"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookMarked,
  BookOpen,
  HelpCircle,
  Inbox,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Users,
  UsersRound,
  Wrench,
} from "lucide-react";
import { ErrorState } from "@/components/common/error-state";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminFetch } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";

interface DashboardData {
  books: number;
  authors: number;
  journals: number;
  blogPosts: number;
  services: number;
  testimonials: number;
  faqs: number;
  pendingRequests: number;
  totalRequests: number;
  newMessages: number;
  subscribers: number;
  recentRequests: { id: string; fullName: string; bookTitle: string; status: string; createdAt: string }[];
  recentMessages: { id: string; name: string; subject: string; status: string; createdAt: string }[];
}

const STATUS_VARIANT: Record<string, "secondary" | "accent" | "success" | "outline"> = {
  pending: "accent",
  in_review: "secondary",
  accepted: "success",
  rejected: "outline",
  new: "accent",
  responded: "success",
  archived: "outline",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    adminFetch<DashboardData>("/admin/dashboard")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load dashboard"));
  }, []);

  useEffect(load, [load]);

  const cards = data
    ? [
        { label: "Books", value: data.books, icon: BookOpen, href: "/admin/books" },
        { label: "Authors", value: data.authors, icon: Users, href: "/admin/authors" },
        { label: "Blog Posts", value: data.blogPosts, icon: Newspaper, href: "/admin/blogs" },
        { label: "Journals", value: data.journals, icon: BookMarked, href: "/admin/journals" },
        { label: "Services", value: data.services, icon: Wrench, href: "/admin/services" },
        { label: "Testimonials", value: data.testimonials, icon: MessageSquareQuote, href: "/admin/testimonials" },
        { label: "FAQs", value: data.faqs, icon: HelpCircle, href: "/admin/faqs" },
        { label: "Pending Submissions", value: data.pendingRequests, icon: Inbox, href: "/admin/submissions", highlight: true },
        { label: "New Messages", value: data.newMessages, icon: Mail, href: "/admin/messages", highlight: true },
        { label: "Subscribers", value: data.subscribers, icon: UsersRound, href: "/admin/subscribers" },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-muted-foreground">Content and submissions at a glance.</p>

      {error && <ErrorState className="mt-6" description={error} onRetry={load} />}

      {!error && !data && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 10 }, (_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      )}

      {data && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="group rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <card.icon
                    className={
                      card.highlight && card.value > 0
                        ? "h-5 w-5 text-accent-foreground/80 dark:text-accent"
                        : "h-5 w-5 text-muted-foreground"
                    }
                    aria-hidden
                  />
                  {card.highlight && card.value > 0 && <Badge variant="accent">{card.value} open</Badge>}
                </div>
                <p className="mt-3 font-display text-2xl font-semibold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <section className="overflow-hidden rounded-xl border bg-card">
              <div className="flex items-center justify-between border-b px-5 py-3.5">
                <h2 className="font-display text-base font-semibold">Recent submissions</h2>
                <Link href="/admin/submissions" className="text-xs font-medium text-primary hover:underline dark:text-accent">
                  View all
                </Link>
              </div>
              {data.recentRequests.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">No submissions yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.fullName}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {request.bookTitle}
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_VARIANT[request.status] ?? "secondary"} className="font-normal">
                            {request.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(request.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </section>

            <section className="overflow-hidden rounded-xl border bg-card">
              <div className="flex items-center justify-between border-b px-5 py-3.5">
                <h2 className="font-display text-base font-semibold">Recent messages</h2>
                <Link href="/admin/messages" className="text-xs font-medium text-primary hover:underline dark:text-accent">
                  View all
                </Link>
              </div>
              {data.recentMessages.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">No messages yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">{message.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {message.subject}
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_VARIANT[message.status] ?? "secondary"} className="font-normal">
                            {message.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(message.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
