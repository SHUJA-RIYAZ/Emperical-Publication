"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Eye, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch, getAdminToken } from "@/lib/admin-api";
import { API_BASE_URL } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

interface Submission {
  id: string;
  referenceId: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  affiliation: string;
  bookTitle: string;
  category: string;
  language: string;
  wordCount: string;
  synopsis: string;
  manuscriptFileName?: string | null;
  manuscriptFilePath?: string | null;
  userId?: string | null;
  reviewerNotes?: string | null;
  status: string;
  createdAt: string;
}

const STATUSES = ["pending", "in_review", "accepted", "rejected"] as const;
const VARIANT: Record<string, "accent" | "secondary" | "success" | "outline"> = {
  pending: "accent",
  in_review: "secondary",
  accepted: "success",
  rejected: "outline",
};

export default function AdminSubmissionsPage() {
  const [rows, setRows] = useState<Submission[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Submission | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const load = useCallback(() => {
    setError(null);
    adminFetch<Submission[]>("/admin/publishing-requests")
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  useEffect(load, [load]);

  const openViewer = (row: Submission) => {
    setViewing(row);
    setNotes(row.reviewerNotes ?? "");
  };

  const saveNotes = async () => {
    if (!viewing) return;
    setSavingNotes(true);
    try {
      await adminFetch(`/admin/publishing-requests/${viewing.id}/notes`, {
        method: "PATCH",
        body: { reviewerNotes: notes },
      });
      toast.success("Reviewer notes saved", {
        description: "The author can now see them in their account.",
      });
      setViewing(null);
      load();
    } catch (e) {
      toast.error("Could not save notes", { description: e instanceof Error ? e.message : undefined });
    } finally {
      setSavingNotes(false);
    }
  };

  /** Downloads through an authenticated fetch, since the endpoint needs a bearer token. */
  const downloadManuscript = async (row: Submission) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/publishing-requests/${row.id}/manuscript`,
        { headers: { Authorization: `Bearer ${getAdminToken() ?? ""}` } }
      );
      if (!response.ok) throw new Error(`Download failed (${response.status})`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = row.manuscriptFileName ?? "manuscript";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error("Could not download manuscript", {
        description: e instanceof Error ? e.message : undefined,
      });
    }
  };

  const setStatus = async (row: Submission, status: string) => {
    try {
      await adminFetch(`/admin/publishing-requests/${row.id}/status`, {
        method: "PATCH",
        body: { status },
      });
      toast.success(`Marked ${row.referenceId} as ${status.replace("_", " ")}`);
      load();
    } catch (e) {
      toast.error("Update failed", { description: e instanceof Error ? e.message : undefined });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Publishing Submissions</h1>
      <p className="text-sm text-muted-foreground">
        Manuscript submissions from the Publish Your Book form.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border bg-card">
        {error ? (
          <ErrorState className="m-4" description={error} onRetry={load} />
        ) : rows === null ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            className="m-4 border-0"
            title="No submissions yet"
            description="New manuscript submissions will appear here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Book title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.referenceId}</TableCell>
                  <TableCell>
                    <p className="font-medium">{row.fullName}</p>
                    <p className="text-xs text-muted-foreground">{row.email}</p>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate">{row.bookTitle}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {row.category || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(row.createdAt)}</TableCell>
                  <TableCell>
                    <Select value={row.status} onValueChange={(v) => setStatus(row, v)}>
                      <SelectTrigger
                        className="h-8 w-32 text-xs"
                        aria-label={`Status for ${row.referenceId}`}
                      >
                        <SelectValue>
                          <Badge variant={VARIANT[row.status]} className="font-normal">
                            {row.status.replace("_", " ")}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {row.manuscriptFilePath && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Download manuscript for ${row.referenceId}`}
                          title="Download manuscript"
                          onClick={() => downloadManuscript(row)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`View submission ${row.referenceId}`}
                        onClick={() => openViewer(row)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{viewing?.bookTitle}</DialogTitle>
            <DialogDescription>
              {viewing?.referenceId} · submitted {viewing && formatDate(viewing.createdAt)}
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <dl className="divide-y rounded-lg border">
              {(
                [
                  ["Author", viewing.fullName],
                  ["Email", viewing.email],
                  ["Phone", viewing.phone],
                  ["Country", viewing.country],
                  ["Affiliation", viewing.affiliation],
                  ["Category", viewing.category],
                  ["Language", viewing.language],
                  ["Word count", viewing.wordCount],
                  ["Account", viewing.userId ? "Registered author" : "Guest submission"],
                  ["Manuscript", viewing.manuscriptFileName ?? "Not uploaded"],
                  ["Synopsis", viewing.synopsis],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="grid grid-cols-3 gap-3 px-4 py-2.5 text-sm">
                  <dt className="font-medium text-muted-foreground">{label}</dt>
                  <dd className="col-span-2 whitespace-pre-wrap break-words">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          )}

          {viewing?.manuscriptFilePath && (
            <Button variant="outline" onClick={() => downloadManuscript(viewing)}>
              <Download /> Download {viewing.manuscriptFileName}
            </Button>
          )}

          <div>
            <Label htmlFor="reviewer-notes">Reviewer notes</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Visible to the author in their account dashboard alongside the status.
            </p>
            <Textarea
              id="reviewer-notes"
              className="mt-2 min-h-28"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Constructive feedback for the author…"
            />
            <Button className="mt-3" onClick={saveNotes} disabled={savingNotes}>
              {savingNotes ? <Loader2 className="animate-spin" /> : <Save />}
              Save notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
