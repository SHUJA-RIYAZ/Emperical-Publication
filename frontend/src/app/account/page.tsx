"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleCheck, CircleDashed, CircleX, Clock, FileText, Paperclip } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMySubmissions } from "@/services/account.service";
import { formatDate } from "@/lib/utils";
import type { MySubmission, SubmissionStatus } from "@/types/account";

const STATUS_META: Record<
  SubmissionStatus,
  { label: string; variant: "accent" | "secondary" | "success" | "outline"; icon: typeof Clock; help: string }
> = {
  pending: {
    label: "Pending",
    variant: "accent",
    icon: CircleDashed,
    help: "Received — awaiting initial editorial screening.",
  },
  in_review: {
    label: "In review",
    variant: "secondary",
    icon: Clock,
    help: "With our peer reviewers. Decisions typically take 4–6 weeks.",
  },
  accepted: {
    label: "Accepted",
    variant: "success",
    icon: CircleCheck,
    help: "Congratulations — our team will be in touch about next steps.",
  },
  rejected: {
    label: "Not accepted",
    variant: "outline",
    icon: CircleX,
    help: "This submission was not taken forward. See reviewer notes below.",
  },
};

export default function AccountSubmissionsPage() {
  const [rows, setRows] = useState<MySubmission[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    getMySubmissions()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load submissions"));
  }, []);

  useEffect(load, [load]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">My Submissions</h2>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {rows ? `${rows.length} submission${rows.length === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/publish">
            New submission <ArrowRight />
          </Link>
        </Button>
      </div>

      {error && <ErrorState className="mt-6" description={error} onRetry={load} />}

      {!error && rows === null && (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      )}

      {rows?.length === 0 && (
        <EmptyState
          className="mt-6"
          icon={<FileText className="h-6 w-6" />}
          title="No submissions yet"
          description="When you submit a manuscript it will appear here, and you can follow its progress through review."
        />
      )}

      {rows && rows.length > 0 && (
        <ul className="mt-6 space-y-4">
          {rows.map((submission) => {
            const meta = STATUS_META[submission.status] ?? STATUS_META.pending;
            const StatusIcon = meta.icon;
            return (
              <li key={submission.id} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-semibold">{submission.bookTitle}</h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {submission.referenceId} · submitted {formatDate(submission.createdAt)}
                    </p>
                  </div>
                  <Badge variant={meta.variant} className="shrink-0 gap-1.5">
                    <StatusIcon className="h-3.5 w-3.5" aria-hidden />
                    {meta.label}
                  </Badge>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">{meta.help}</p>

                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-muted-foreground">
                  <div className="flex gap-1.5">
                    <dt>Category:</dt>
                    <dd className="font-medium text-foreground">{submission.category || "—"}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt>Language:</dt>
                    <dd className="font-medium text-foreground">{submission.language}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt>Length:</dt>
                    <dd className="font-medium text-foreground">{submission.wordCount || "—"}</dd>
                  </div>
                  {submission.manuscriptFileName && (
                    <div className="flex items-center gap-1.5">
                      <Paperclip className="h-3 w-3" aria-hidden />
                      <dd className="font-medium text-foreground">{submission.manuscriptFileName}</dd>
                    </div>
                  )}
                </dl>

                {submission.reviewerNotes && (
                  <div className="mt-4 rounded-lg border bg-secondary/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Reviewer notes
                    </p>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm">{submission.reviewerNotes}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
