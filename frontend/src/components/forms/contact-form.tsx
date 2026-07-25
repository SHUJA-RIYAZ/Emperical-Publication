"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/use-settings";
import { submitContactMessage } from "@/services/publish.service";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  department: z.string().min(1, "Please choose a department"),
  subject: z.string().min(3, "Please enter a subject"),
  message: z.string().min(20, "Please write at least 20 characters"),
});

type ContactValues = z.infer<typeof schema>;

export function ContactForm() {
  const { departments } = useSettings();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", department: "", subject: "", message: "" },
  });

  const onSubmit = async (values: ContactValues) => {
    setSubmitting(true);
    try {
      const result = await submitContactMessage(values);
      toast.success("Message sent", {
        description: `${result.message} Reference: ${result.referenceId}`,
      });
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (name: keyof ContactValues) =>
    errors[name] ? (
      <p className="mt-1.5 text-sm text-destructive" role="alert">
        {errors[name]?.message}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">Name *</Label>
          <Input id="contact-name" className="mt-1.5" placeholder="Your full name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
          {fieldError("name")}
        </div>
        <div>
          <Label htmlFor="contact-email">Email *</Label>
          <Input id="contact-email" type="email" className="mt-1.5" placeholder="you@institution.edu" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
          {fieldError("email")}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-department">Department *</Label>
          <Select
            value={watch("department")}
            onValueChange={(v) => setValue("department", v, { shouldValidate: true })}
          >
            <SelectTrigger id="contact-department" className="mt-1.5" aria-invalid={!!errors.department}>
              <SelectValue placeholder="Who should read this?" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldError("department")}
        </div>
        <div>
          <Label htmlFor="contact-subject">Subject *</Label>
          <Input id="contact-subject" className="mt-1.5" placeholder="Brief summary" aria-invalid={!!errors.subject} {...register("subject")} />
          {fieldError("subject")}
        </div>
      </div>
      <div>
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea id="contact-message" className="mt-1.5 min-h-36" placeholder="How can we help?" aria-invalid={!!errors.message} {...register("message")} />
        {fieldError("message")}
      </div>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? <Loader2 className="animate-spin" /> : <Send />}
        Send message
      </Button>
    </form>
  );
}
