"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, MessageSquare, ShieldAlert, Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminFetch } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";

interface AdminComment {
  id: string;
  name: string;
  email: string;
  body: string;
  status: "pending" | "approved" | "spam";
  createdAt: string;
  postId: string;
  postTitle: string;
  postSlug: string;
}

const STATUS_VARIANT: Record<AdminComment["status"], "accent" | "success" | "outline"> = {
  pending: "accent",
  approved: "success",
  spam: "outline",
};

export default function AdminCommentsPage() {
  const [rows, setRows] = useState<AdminComment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "spam" | "all">("pending");
  const [deleting, setDeleting] = useState<AdminComment | null>(null);

  const load = useCallback(() => {
    setError(null);
    adminFetch<AdminComment[]>("/admin/comments")
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load comments"));
  }, []);

  useEffect(load, [load]);

  const visible = useMemo(
    () => (rows ?? []).filter((c) => filter === "all" || c.status === filter),
    [rows, filter]
  );

  const pendingCount = (rows ?? []).filter((c) => c.status === "pending").length;

  const setStatus = async (row: AdminComment, status: AdminComment["status"]) => {
    try {
      await adminFetch(`/admin/comments/${row.id}/status`, { method: "PATCH", body: { status } });
      toast.success(`Comment ${status === "approved" ? "approved and published" : `marked ${status}`}`);
      load();
    } catch (e) {
      toast.error("Update failed", { description: e instanceof Error ? e.message : undefined });
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await adminFetch(`/admin/comments/${deleting.id}`, { method: "DELETE" });
      toast.success("Comment deleted");
      setDeleting(null);
      load();
    } catch (e) {
      toast.error("Delete failed", { description: e instanceof Error ? e.message : undefined });
    }
  };

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-semibold">Blog Comments</h1>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {rows
            ? `${pendingCount} awaiting review · ${rows.length} total`
            : "Loading…"}
        </p>
      </div>

      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as typeof filter)}
        className="mt-6"
      >
        <TabsList>
          <TabsTrigger value="pending">Pending{pendingCount > 0 && ` (${pendingCount})`}</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="spam">Spam</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {error && <ErrorState className="mt-6" description={error} onRetry={load} />}

      {!error && rows === null && (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      )}

      {rows && visible.length === 0 && (
        <EmptyState
          className="mt-6"
          icon={<MessageSquare className="h-6 w-6" />}
          title={filter === "pending" ? "Nothing awaiting review" : "No comments here"}
          description={
            filter === "pending"
              ? "New comments will appear here for approval before they go live."
              : "Try a different filter."
          }
        />
      )}

      {visible.length > 0 && (
        <ul className="mt-6 space-y-4">
          {visible.map((comment) => (
            <li key={comment.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {comment.name}{" "}
                    <span className="font-normal text-muted-foreground">({comment.email})</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)} on{" "}
                    <Link
                      href={`/blog/${comment.postSlug}`}
                      target="_blank"
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      {comment.postTitle}
                    </Link>
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[comment.status]} className="shrink-0 font-normal">
                  {comment.status}
                </Badge>
              </div>

              <p className="mt-3 whitespace-pre-wrap rounded-lg bg-secondary/40 p-3 text-sm">
                {comment.body}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {comment.status !== "approved" && (
                  <Button size="sm" onClick={() => setStatus(comment, "approved")}>
                    <Check /> Approve
                  </Button>
                )}
                {comment.status === "approved" && (
                  <Button size="sm" variant="outline" onClick={() => setStatus(comment, "pending")}>
                    <Undo2 /> Unpublish
                  </Button>
                )}
                {comment.status !== "spam" && (
                  <Button size="sm" variant="outline" onClick={() => setStatus(comment, "spam")}>
                    <ShieldAlert /> Mark spam
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleting(comment)}
                >
                  <Trash2 /> Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete comment?</DialogTitle>
            <DialogDescription>
              This permanently removes {deleting?.name}&rsquo;s comment. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
