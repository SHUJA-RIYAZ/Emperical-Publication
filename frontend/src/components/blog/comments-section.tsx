"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { ProfileAvatar } from "@/components/common/profile-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  name: string;
  date: string;
  text: string;
}

const SEED_COMMENTS: Comment[] = [
  {
    id: "c-1",
    name: "Dr. Priya Raghavan",
    date: "2026-06-18",
    text: "Extremely helpful overview — I shared this with my doctoral students. The section on common pitfalls matches exactly what I see as a reviewer.",
  },
  {
    id: "c-2",
    name: "Marcus Feld",
    date: "2026-06-21",
    text: "Would love a follow-up piece covering the perspective of early-career researchers in the Global South. Great read regardless.",
  },
];

export function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      toast.error("Please add your name and a comment.");
      return;
    }
    setComments((prev) => [
      { id: `c-${Date.now()}`, name: name.trim(), date: new Date().toISOString(), text: text.trim() },
      ...prev,
    ]);
    setName("");
    setText("");
    toast.success("Comment posted", { description: "Comments are stored locally in this demo." });
  };

  return (
    <section aria-label="Comments" className="mt-14">
      <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
        <MessageSquare className="h-5 w-5 text-accent-foreground/70 dark:text-accent" aria-hidden />
        Comments ({comments.length})
      </h2>

      <form onSubmit={submit} className="mt-6 rounded-xl border bg-card p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <Label htmlFor="comment-name">Name</Label>
            <Input
              id="comment-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1.5"
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="comment-text">Comment</Label>
          <Textarea
            id="comment-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Join the discussion…"
            className="mt-1.5"
          />
        </div>
        <Button type="submit" className="mt-4">
          Post comment
        </Button>
      </form>

      <ul className="mt-8 space-y-6">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-4">
            <ProfileAvatar name={comment.name} className="h-10 w-10 text-sm" />
            <div className="flex-1 rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">{comment.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(comment.date)}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{comment.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
