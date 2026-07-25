"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ProfileAvatar } from "@/components/common/profile-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuthHydrated, useAuthStore } from "@/hooks/use-auth-store";
import { formatDate } from "@/lib/utils";
import { getComments, postComment, type BlogComment } from "@/services/comments.service";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  body: z.string().min(5, "Please write at least a few words"),
});

type CommentValues = z.infer<typeof schema>;

export function CommentsSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<BlogComment[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CommentValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", body: "" },
  });

  const load = useCallback(() => {
    getComments(slug)
      .then(setComments)
      .catch(() => setComments([]));
  }, [slug]);

  useEffect(load, [load]);

  // Pre-fill identity for signed-in readers.
  useEffect(() => {
    if (hydrated && user) {
      setValue("name", user.fullName);
      setValue("email", user.email);
    }
  }, [hydrated, user, setValue]);

  const onSubmit = async (values: CommentValues) => {
    setSubmitting(true);
    try {
      const result = await postComment(slug, values);
      toast.success("Comment submitted", { description: result.message });
      reset({ name: user?.fullName ?? "", email: user?.email ?? "", body: "" });
    } catch (error) {
      toast.error("Could not post comment", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-label="Comments" className="mt-14">
      <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
        <MessageSquare className="h-5 w-5 text-accent-foreground/70 dark:text-accent" aria-hidden />
        Comments{comments ? ` (${comments.length})` : ""}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 rounded-xl border bg-card p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="comment-name">Name *</Label>
            <Input
              id="comment-name"
              className="mt-1.5"
              placeholder="Your name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-destructive" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="comment-email">Email *</Label>
            <Input
              id="comment-email"
              type="email"
              className="mt-1.5"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <p className="mt-1 text-xs text-muted-foreground">Not published.</p>
            {errors.email && (
              <p className="mt-1.5 text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="comment-body">Comment *</Label>
          <Textarea
            id="comment-body"
            className="mt-1.5"
            placeholder="Join the discussion…"
            aria-invalid={!!errors.body}
            {...register("body")}
          />
          {errors.body && (
            <p className="mt-1.5 text-sm text-destructive" role="alert">
              {errors.body.message}
            </p>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin" /> : <Send />}
            Post comment
          </Button>
          <p className="text-xs text-muted-foreground">
            Comments are reviewed by our editorial team before publication.
          </p>
        </div>
      </form>

      {comments === null && (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 2 }, (_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {comments?.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          No comments yet — be the first to share your thoughts.
        </p>
      )}

      {comments && comments.length > 0 && (
        <ul className="mt-8 space-y-6">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-4">
              <ProfileAvatar name={comment.name} className="h-10 w-10 text-sm" />
              <div className="flex-1 rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold">{comment.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                  {comment.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
