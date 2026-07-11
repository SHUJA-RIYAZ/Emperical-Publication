"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/services/publish.service";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

type NewsletterValues = z.infer<typeof schema>;

export function NewsletterForm({ className }: { className?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: NewsletterValues) => {
    setSubmitting(true);
    try {
      const result = await subscribeNewsletter(values.email);
      toast.success("Subscribed successfully", { description: result.message });
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("w-full max-w-md", className)}
      noValidate
    >
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="Your email address"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "newsletter-email-error" : undefined}
            {...register("email")}
          />
        </div>
        <Button type="submit" variant="accent" disabled={submitting}>
          {submitting ? <Loader2 className="animate-spin" /> : <Send />}
          Subscribe
        </Button>
      </div>
      {errors.email && (
        <p id="newsletter-email-error" className="mt-2 text-sm text-destructive" role="alert">
          {errors.email.message}
        </p>
      )}
    </form>
  );
}
