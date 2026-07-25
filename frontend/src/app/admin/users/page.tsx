"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, ShieldCheck, Trash2, UserRound } from "lucide-react";
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
import { adminFetch, getAdminUser } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";

interface AdminUserRow {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: string;
  affiliation: string;
  country: string;
}

const emptyCreate = { fullName: "", email: "", password: "", role: "admin" as "admin" | "user" };

export default function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUserRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreate);
  const [editing, setEditing] = useState<AdminUserRow | null>(null);
  const [editForm, setEditForm] = useState({ fullName: "", role: "user" as "admin" | "user", isActive: true, password: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<AdminUserRow | null>(null);
  const currentAdmin = getAdminUser();

  const load = useCallback(() => {
    setError(null);
    adminFetch<AdminUserRow[]>("/admin/users")
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load users"));
  }, []);

  useEffect(load, [load]);

  const create = async () => {
    setSaving(true);
    try {
      await adminFetch("/admin/users", { method: "POST", body: createForm });
      toast.success("User created");
      setCreateOpen(false);
      setCreateForm(emptyCreate);
      load();
    } catch (e) {
      toast.error("Could not create user", { description: e instanceof Error ? e.message : undefined });
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        fullName: editForm.fullName,
        role: editForm.role,
        isActive: editForm.isActive,
      };
      if (editForm.password) body.password = editForm.password;
      await adminFetch(`/admin/users/${editing.id}`, { method: "PATCH", body });
      toast.success("User updated");
      setEditing(null);
      load();
    } catch (e) {
      toast.error("Could not update user", { description: e instanceof Error ? e.message : undefined });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await adminFetch(`/admin/users/${deleting.id}`, { method: "DELETE" });
      toast.success(`Deleted ${deleting.email}`);
      setDeleting(null);
      load();
    } catch (e) {
      toast.error("Could not delete user", { description: e instanceof Error ? e.message : undefined });
    }
  };

  const openEdit = (row: AdminUserRow) => {
    setEditing(row);
    setEditForm({ fullName: row.fullName, role: row.role, isActive: row.isActive, password: "" });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {rows
              ? `${rows.filter((r) => r.role === "admin").length} admin · ${rows.filter((r) => r.role === "user").length} registered author${rows.filter((r) => r.role === "user").length === 1 ? "" : "s"}`
              : "Loading…"}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> Add user
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border bg-card">
        {error ? (
          <ErrorState className="m-4" description={error} onRetry={load} />
        ) : rows === null ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState className="m-4 border-0" title="No users" description="Add your first user." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const isSelf = currentAdmin?.id === row.id;
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.fullName}
                      {isSelf && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.email}</TableCell>
                    <TableCell>
                      <Badge variant={row.role === "admin" ? "default" : "secondary"} className="gap-1 font-normal">
                        {row.role === "admin" ? (
                          <ShieldCheck className="h-3 w-3" aria-hidden />
                        ) : (
                          <UserRound className="h-3 w-3" aria-hidden />
                        )}
                        {row.role === "admin" ? "Admin" : "Author"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {row.isActive ? (
                        <Badge variant="success" className="font-normal">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="font-normal">Disabled</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(row.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Edit ${row.email}`} onClick={() => openEdit(row)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          aria-label={`Delete ${row.email}`}
                          disabled={isSelf}
                          onClick={() => setDeleting(row)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Add user</DialogTitle>
            <DialogDescription>
              Admins can manage all content. Authors can sign in to the public portal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="u-name">Full name *</Label>
              <Input id="u-name" className="mt-1.5" value={createForm.fullName} onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="u-email">Email *</Label>
              <Input id="u-email" type="email" className="mt-1.5" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="u-password">Password *</Label>
              <Input id="u-password" type="password" className="mt-1.5" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
              <p className="mt-1 text-xs text-muted-foreground">
                Minimum 8 characters, with an uppercase letter and a number.
              </p>
            </div>
            <div>
              <Label htmlFor="u-role">Role *</Label>
              <Select value={createForm.role} onValueChange={(v) => setCreateForm({ ...createForm, role: v as "admin" | "user" })}>
                <SelectTrigger id="u-role" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">Author</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={create} disabled={saving}>
              {saving && <Loader2 className="animate-spin" />} Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Edit {editing?.email}</DialogTitle>
            <DialogDescription>Leave the password blank to keep it unchanged.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="e-name">Full name</Label>
              <Input id="e-name" className="mt-1.5" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="e-role">Role</Label>
              <Select value={editForm.role} onValueChange={(v) => setEditForm({ ...editForm, role: v as "admin" | "user" })}>
                <SelectTrigger id="e-role" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">Author</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="e-password">New password (optional)</Label>
              <Input id="e-password" type="password" className="mt-1.5" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="e-active" checked={editForm.isActive} onCheckedChange={(v) => setEditForm({ ...editForm, isActive: v === true })} />
              <Label htmlFor="e-active" className="cursor-pointer font-normal">
                Account active
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={saving}>
              {saving && <Loader2 className="animate-spin" />} Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
            <DialogDescription>
              {deleting?.email} will lose access permanently. Their submissions are kept but no
              longer linked to an account.
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
