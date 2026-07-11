"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
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

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const [rows, setRows] = useState<Subscriber[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    adminFetch<Subscriber[]>("/admin/subscribers")
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  useEffect(load, [load]);

  const remove = async (row: Subscriber) => {
    try {
      await adminFetch(`/admin/subscribers/${row.id}`, { method: "DELETE" });
      toast.success(`Removed ${row.email}`);
      load();
    } catch (e) {
      toast.error("Delete failed", { description: e instanceof Error ? e.message : undefined });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Newsletter Subscribers</h1>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {rows ? `${rows.length} subscriber${rows.length === 1 ? "" : "s"}` : "Loading…"}
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
            title="No subscribers yet"
            description="Newsletter signups will appear here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead className="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-muted-foreground">{row.id}</TableCell>
                  <TableCell className="font-medium">{row.email}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(row.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      aria-label={`Remove ${row.email}`}
                      onClick={() => remove(row)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
