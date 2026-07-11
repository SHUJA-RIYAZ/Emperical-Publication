"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "@/lib/admin-api";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import type { AdminColumn, AdminField, AdminResource } from "@/config/admin-resources";

type Row = Record<string, unknown> & { id: string };

/* ------------------------------------------------------------------ */
/* Value <-> form-string conversions per field type                    */
/* ------------------------------------------------------------------ */

function toFormValue(field: AdminField, value: unknown): string | boolean | string[] {
  switch (field.type) {
    case "checkbox":
      return Boolean(value);
    case "tags":
      return Array.isArray(value) ? (value as string[]).join(", ") : "";
    case "paragraphs":
      return Array.isArray(value) ? (value as string[]).join("\n\n") : "";
    case "json":
      return value ? JSON.stringify(value, null, 2) : field.name === "social" ? "{}" : "[]";
    case "authors":
      return Array.isArray(value) ? (value as string[]).map(String) : [];
    default:
      return value == null ? "" : String(value);
  }
}

function fromFormValue(field: AdminField, value: string | boolean | string[]): unknown {
  switch (field.type) {
    case "checkbox":
      return Boolean(value);
    case "number":
      return value === "" ? 0 : parseInt(String(value), 10) || 0;
    case "decimal":
      return value === "" ? 0 : parseFloat(String(value)) || 0;
    case "tags":
      return String(value)
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    case "paragraphs":
      return String(value)
        .split(/\n\s*\n/)
        .map((v) => v.trim())
        .filter(Boolean);
    case "json":
      return JSON.parse(String(value) || "null");
    case "authors":
      return (value as string[]).map((v) => parseInt(v, 10)).filter((n) => !Number.isNaN(n));
    default:
      return String(value);
  }
}

function emptyForm(fields: AdminField[]): Record<string, string | boolean | string[]> {
  const form: Record<string, string | boolean | string[]> = {};
  for (const field of fields) form[field.name] = toFormValue(field, undefined);
  return form;
}

/* ------------------------------------------------------------------ */
/* Cell renderer                                                       */
/* ------------------------------------------------------------------ */

function CellValue({ column, row }: { column: AdminColumn; row: Row }) {
  const value = row[column.key];
  switch (column.type) {
    case "bool":
      return value ? <Badge variant="success">Yes</Badge> : <span className="text-muted-foreground">—</span>;
    case "badge":
      return value ? <Badge variant="secondary" className="font-normal">{String(value)}</Badge> : null;
    case "price":
      return <>{formatPrice(Number(value) || 0)}</>;
    case "date":
      return <>{value ? formatDate(String(value)) : "—"}</>;
    default:
      return <span className="line-clamp-1 max-w-[320px]">{value == null ? "—" : String(value)}</span>;
  }
}

/* ------------------------------------------------------------------ */
/* CrudManager                                                         */
/* ------------------------------------------------------------------ */

export function CrudManager({ resource }: { resource: AdminResource }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState(emptyForm(resource.fields));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [authorOptions, setAuthorOptions] = useState<{ id: string; name: string }[] | null>(null);

  const needsAuthors = resource.fields.some((f) => f.type === "authors");

  const loadRows = useCallback(async () => {
    setError(null);
    try {
      setRows(await adminFetch<Row[]>(`/admin/resources/${resource.slug}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    }
  }, [resource.slug]);

  useEffect(() => {
    setRows(null);
    loadRows();
  }, [loadRows]);

  useEffect(() => {
    if (!needsAuthors) return;
    adminFetch<Row[]>("/admin/resources/authors")
      .then((authors) =>
        setAuthorOptions(authors.map((a) => ({ id: String(a.id), name: String(a.name) })))
      )
      .catch(() => setAuthorOptions([]));
  }, [needsAuthors]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) =>
      resource.searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q))
    );
  }, [rows, search, resource.searchKeys]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(resource.fields));
    setDialogOpen(true);
  };

  const openEdit = (row: Row) => {
    setEditing(row);
    const nextForm: Record<string, string | boolean | string[]> = {};
    for (const field of resource.fields) nextForm[field.name] = toFormValue(field, row[field.name]);
    setForm(nextForm);
    setDialogOpen(true);
  };

  const save = async () => {
    // Validate required fields + JSON fields before hitting the API.
    for (const field of resource.fields) {
      const value = form[field.name];
      if (field.required && (value === "" || (Array.isArray(value) && value.length === 0))) {
        toast.error(`"${field.label}" is required`);
        return;
      }
      if (field.type === "json") {
        try {
          JSON.parse(String(value) || "null");
        } catch {
          toast.error(`"${field.label}" is not valid JSON`);
          return;
        }
      }
    }

    const payload: Record<string, unknown> = {};
    for (const field of resource.fields) payload[field.name] = fromFormValue(field, form[field.name]);

    setSaving(true);
    try {
      if (editing) {
        await adminFetch(`/admin/resources/${resource.slug}/${editing.id}`, {
          method: "PUT",
          body: payload,
        });
        toast.success(`${resource.singular} updated`);
      } else {
        await adminFetch(`/admin/resources/${resource.slug}`, { method: "POST", body: payload });
        toast.success(`${resource.singular} created`);
      }
      setDialogOpen(false);
      await loadRows();
    } catch (e) {
      toast.error("Save failed", { description: e instanceof Error ? e.message : undefined });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await adminFetch(`/admin/resources/${resource.slug}/${deleting.id}`, { method: "DELETE" });
      toast.success(`${resource.singular} deleted`);
      setDeleting(null);
      await loadRows();
    } catch (e) {
      toast.error("Delete failed", { description: e instanceof Error ? e.message : undefined });
    }
  };

  const setField = (name: string, value: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [name]: value }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">{resource.title}</h1>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {rows ? `${filtered.length} of ${rows.length} records` : "Loading…"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${resource.title.toLowerCase()}…`}
              className="w-56 pl-9"
              aria-label={`Search ${resource.title}`}
            />
          </div>
          <Button onClick={openCreate}>
            <Plus /> Add {resource.singular}
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border bg-card">
        {error ? (
          <ErrorState description={error} onRetry={loadRows} className="m-4" />
        ) : rows === null ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={search ? "No matching records" : `No ${resource.title.toLowerCase()} yet`}
            description={search ? "Try a different search." : `Create your first ${resource.singular} to get started.`}
            className="m-4 border-0"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">ID</TableHead>
                {resource.columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-muted-foreground">{row.id}</TableCell>
                  {resource.columns.map((col) => (
                    <TableCell key={col.key}>
                      <CellValue column={col} row={row} />
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Edit ${resource.singular} ${row.id}`} onClick={() => openEdit(row)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" aria-label={`Delete ${resource.singular} ${row.id}`} onClick={() => setDeleting(row)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? `Edit ${resource.singular}` : `New ${resource.singular}`}
            </DialogTitle>
            <DialogDescription>
              {editing ? `Updating record #${editing.id}.` : `Fill in the details below.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {resource.fields.map((field) => {
              const id = `field-${field.name}`;
              const value = form[field.name];
              const span2 = field.colSpan === 2 ? "sm:col-span-2" : "";
              return (
                <div key={field.name} className={span2}>
                  {field.type !== "checkbox" && (
                    <Label htmlFor={id}>
                      {field.label}
                      {field.required && " *"}
                    </Label>
                  )}
                  {field.type === "textarea" || field.type === "paragraphs" ? (
                    <Textarea
                      id={id}
                      className={cn("mt-1.5", field.type === "paragraphs" && "min-h-44 font-mono text-xs")}
                      value={String(value)}
                      onChange={(e) => setField(field.name, e.target.value)}
                    />
                  ) : field.type === "json" ? (
                    <Textarea
                      id={id}
                      className="mt-1.5 min-h-28 font-mono text-xs"
                      value={String(value)}
                      onChange={(e) => setField(field.name, e.target.value)}
                    />
                  ) : field.type === "checkbox" ? (
                    <div className="flex h-full items-center gap-2 pt-5">
                      <Checkbox
                        id={id}
                        checked={Boolean(value)}
                        onCheckedChange={(v) => setField(field.name, v === true)}
                      />
                      <Label htmlFor={id} className="cursor-pointer font-normal">
                        {field.label}
                      </Label>
                    </div>
                  ) : field.type === "select" ? (
                    <Select value={String(value)} onValueChange={(v) => setField(field.name, v)}>
                      <SelectTrigger id={id} className="mt-1.5">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "authors" ? (
                    <div className="mt-1.5 max-h-40 space-y-1.5 overflow-y-auto rounded-md border p-3">
                      {authorOptions === null && (
                        <p className="text-xs text-muted-foreground">Loading authors…</p>
                      )}
                      {authorOptions?.length === 0 && (
                        <p className="text-xs text-muted-foreground">No authors available.</p>
                      )}
                      {authorOptions?.map((author) => {
                        const selected = (value as string[]).includes(author.id);
                        return (
                          <label key={author.id} className="flex cursor-pointer items-center gap-2 text-sm">
                            <Checkbox
                              checked={selected}
                              onCheckedChange={(v) => {
                                const current = value as string[];
                                setField(
                                  field.name,
                                  v === true
                                    ? [...current, author.id]
                                    : current.filter((idValue) => idValue !== author.id)
                                );
                              }}
                            />
                            {author.name}
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <Input
                      id={id}
                      type={field.type === "number" || field.type === "decimal" ? "number" : field.type === "date" ? "date" : "text"}
                      step={field.type === "decimal" ? "0.01" : undefined}
                      className="mt-1.5"
                      value={String(value)}
                      onChange={(e) => setField(field.name, e.target.value)}
                    />
                  )}
                  {field.help && <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              {editing ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {resource.singular}?</DialogTitle>
            <DialogDescription>
              This permanently removes record #{deleting?.id}
              {deleting && (deleting.title ?? deleting.name ?? deleting.question)
                ? ` (“${String(deleting.title ?? deleting.name ?? deleting.question).slice(0, 60)}”)`
                : ""}
              . This cannot be undone.
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
