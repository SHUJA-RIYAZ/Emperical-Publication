"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
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
import { adminFetch } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  referenceId: string;
  name: string;
  email: string;
  department: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const STATUSES = ["new", "responded", "archived"] as const;
const VARIANT: Record<string, "accent" | "success" | "outline"> = {
  new: "accent",
  responded: "success",
  archived: "outline",
};

export default function AdminMessagesPage() {
  const [rows, setRows] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Message | null>(null);

  const load = useCallback(() => {
    setError(null);
    adminFetch<Message[]>("/admin/contact-messages")
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  useEffect(load, [load]);

  const setStatus = async (row: Message, status: string) => {
    try {
      await adminFetch(`/admin/contact-messages/${row.id}/status`, {
        method: "PATCH",
        body: { status },
      });
      toast.success(`Marked ${row.referenceId} as ${status}`);
      load();
    } catch (e) {
      toast.error("Update failed", { description: e instanceof Error ? e.message : undefined });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Contact Messages</h1>
      <p className="text-sm text-muted-foreground">Enquiries submitted through the contact form.</p>

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
            title="No messages yet"
            description="Contact form messages will appear here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Subject</TableHead>
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
                    <p className="font-medium">{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.email}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {row.department || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate">{row.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(row.createdAt)}</TableCell>
                  <TableCell>
                    <Select value={row.status} onValueChange={(v) => setStatus(row, v)}>
                      <SelectTrigger className="h-8 w-32 text-xs" aria-label={`Status for ${row.referenceId}`}>
                        <SelectValue>
                          <Badge variant={VARIANT[row.status]} className="font-normal">
                            {row.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`Read message ${row.referenceId}`}
                      onClick={() => setViewing(row)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{viewing?.subject || "Message"}</DialogTitle>
            <DialogDescription>
              From {viewing?.name} ({viewing?.email}) · {viewing && formatDate(viewing.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-wrap rounded-lg border bg-secondary/40 p-4 text-sm">
            {viewing?.message}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
