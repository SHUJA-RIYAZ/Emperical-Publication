"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileUp,
  Loader2,
  PartyPopper,
  RotateCcw,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { useForm, type FieldPath } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { BOOK_CATEGORIES, BOOK_LANGUAGES } from "@/constants";
import { cn } from "@/lib/utils";
import { submitPublishingRequest, type SubmissionResult } from "@/services/publish.service";

const STORAGE_KEY = "eip-publish-draft";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  country: z.string().min(2, "Please enter your country"),
  affiliation: z.string().min(2, "Please enter your institution or affiliation"),
  bookTitle: z.string().min(3, "Please enter your working title"),
  category: z.string().min(1, "Please select a category"),
  language: z.string().min(1, "Please select a language"),
  wordCount: z.string().min(1, "Please estimate your word count"),
  synopsis: z.string().min(50, "Please write at least 50 characters describing your book"),
  agreedToTerms: z.boolean().refine((v) => v, "You must accept the publishing terms"),
  isOriginalWork: z.boolean().refine((v) => v, "You must confirm this is your original work"),
});

type PublishValues = z.infer<typeof schema>;

const DEFAULTS: PublishValues = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  affiliation: "",
  bookTitle: "",
  category: "",
  language: "",
  wordCount: "",
  synopsis: "",
  agreedToTerms: false,
  isOriginalWork: false,
};

const STEPS = [
  { title: "Personal Details", icon: UserRound, fields: ["fullName", "email", "phone", "country", "affiliation"] },
  { title: "Book Information", icon: BookOpen, fields: ["bookTitle", "category", "language", "wordCount", "synopsis"] },
  { title: "Manuscript Upload", icon: FileUp, fields: [] },
  { title: "Declaration", icon: ClipboardCheck, fields: ["agreedToTerms", "isOriginalWork"] },
  { title: "Review & Submit", icon: CheckCircle2, fields: [] },
] as const satisfies readonly { title: string; icon: unknown; fields: FieldPath<PublishValues>[] }[];

function loadDraft(): PublishValues {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<PublishValues>) };
  } catch {
    return DEFAULTS;
  }
}

export function PublishForm() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<{ name: string; sizeKb: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const restoredRef = useRef(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PublishValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
    mode: "onTouched",
  });

  // Restore autosaved draft once on mount.
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const draft = loadDraft();
    if (JSON.stringify(draft) !== JSON.stringify(DEFAULTS)) {
      reset(draft);
      toast.info("Draft restored", { description: "We recovered your unsaved submission." });
    }
  }, [reset]);

  // Autosave to localStorage as the user types.
  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const next = useCallback(async () => {
    const fields = STEPS[step].fields;
    const valid = fields.length === 0 || (await trigger(fields));
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [step, trigger]);

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const resetAll = () => {
    reset(DEFAULTS);
    setFile(null);
    setStep(0);
    localStorage.removeItem(STORAGE_KEY);
    toast("Form cleared", { description: "Your draft has been removed." });
  };

  const onSubmit = async (values: PublishValues) => {
    setSubmitting(true);
    try {
      const response = await submitPublishingRequest({
        ...values,
        manuscriptFileName: file?.name,
      });
      setResult(response);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setSubmitting(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile({ name: selected.name, sizeKb: Math.round(selected.size / 1024) });
    toast.success("File attached", { description: selected.name });
  };

  const values = getValues();
  const progress = ((step + 1) / STEPS.length) * 100;

  const fieldError = (name: keyof PublishValues) =>
    errors[name] ? (
      <p className="mt-1.5 text-sm text-destructive" role="alert">
        {errors[name]?.message as string}
      </p>
    ) : null;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress indicator */}
      <nav aria-label="Form progress" className="mb-8">
        <ol className="flex items-center justify-between gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const state = i < step ? "done" : i === step ? "current" : "todo";
            return (
              <li key={s.title} className="flex flex-1 flex-col items-center gap-2 text-center">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    state === "done" && "border-emerald-600 bg-emerald-600 text-white",
                    state === "current" && "border-primary bg-primary text-primary-foreground dark:border-accent dark:bg-accent dark:text-accent-foreground",
                    state === "todo" && "border-border bg-card text-muted-foreground"
                  )}
                  aria-current={state === "current" ? "step" : undefined}
                >
                  {state === "done" ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4.5 w-4.5" />}
                </span>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    state === "current" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.title}
                </span>
              </li>
            );
          })}
        </ol>
        <div
          className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Submission progress"
        >
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </nav>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <fieldset className="space-y-5">
                  <legend className="mb-2 font-display text-xl font-semibold">
                    Tell us about yourself
                  </legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="fullName">Full name *</Label>
                      <Input id="fullName" className="mt-1.5" placeholder="Dr. Jane Smith" autoComplete="name" aria-invalid={!!errors.fullName} {...register("fullName")} />
                      {fieldError("fullName")}
                    </div>
                    <div>
                      <Label htmlFor="email">Email address *</Label>
                      <Input id="email" type="email" className="mt-1.5" placeholder="jane.smith@university.edu" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
                      {fieldError("email")}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input id="phone" type="tel" className="mt-1.5" placeholder="+1 555 000 0000" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} />
                      {fieldError("phone")}
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input id="country" className="mt-1.5" placeholder="United States" autoComplete="country-name" aria-invalid={!!errors.country} {...register("country")} />
                      {fieldError("country")}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="affiliation">Institution / affiliation *</Label>
                    <Input id="affiliation" className="mt-1.5" placeholder="University, research institute, or independent scholar" aria-invalid={!!errors.affiliation} {...register("affiliation")} />
                    {fieldError("affiliation")}
                  </div>
                </fieldset>
              )}

              {step === 1 && (
                <fieldset className="space-y-5">
                  <legend className="mb-2 font-display text-xl font-semibold">
                    About your book
                  </legend>
                  <div>
                    <Label htmlFor="bookTitle">Working title *</Label>
                    <Input id="bookTitle" className="mt-1.5" placeholder="e.g. Foundations of Marine Biogeochemistry" aria-invalid={!!errors.bookTitle} {...register("bookTitle")} />
                    {fieldError("bookTitle")}
                  </div>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={watch("category")}
                        onValueChange={(v) => setValue("category", v, { shouldValidate: true })}
                      >
                        <SelectTrigger id="category" className="mt-1.5" aria-invalid={!!errors.category}>
                          <SelectValue placeholder="Select…" />
                        </SelectTrigger>
                        <SelectContent>
                          {BOOK_CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldError("category")}
                    </div>
                    <div>
                      <Label htmlFor="language">Language *</Label>
                      <Select
                        value={watch("language")}
                        onValueChange={(v) => setValue("language", v, { shouldValidate: true })}
                      >
                        <SelectTrigger id="language" className="mt-1.5" aria-invalid={!!errors.language}>
                          <SelectValue placeholder="Select…" />
                        </SelectTrigger>
                        <SelectContent>
                          {BOOK_LANGUAGES.map((l) => (
                            <SelectItem key={l} value={l}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldError("language")}
                    </div>
                    <div>
                      <Label htmlFor="wordCount">Estimated words *</Label>
                      <Select
                        value={watch("wordCount")}
                        onValueChange={(v) => setValue("wordCount", v, { shouldValidate: true })}
                      >
                        <SelectTrigger id="wordCount" className="mt-1.5" aria-invalid={!!errors.wordCount}>
                          <SelectValue placeholder="Select…" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Under 40,000", "40,000–80,000", "80,000–120,000", "Over 120,000"].map((w) => (
                            <SelectItem key={w} value={w}>
                              {w}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldError("wordCount")}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="synopsis">Synopsis *</Label>
                    <Textarea
                      id="synopsis"
                      className="mt-1.5 min-h-36"
                      placeholder="Describe your book's argument, intended readership, and what makes it distinctive (minimum 50 characters)…"
                      aria-invalid={!!errors.synopsis}
                      {...register("synopsis")}
                    />
                    {fieldError("synopsis")}
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <fieldset>
                  <legend className="mb-2 font-display text-xl font-semibold">
                    Upload your manuscript
                  </legend>
                  <p className="text-sm text-muted-foreground">
                    Optional at this stage. We accept .docx, LaTeX (zipped), and PDF up to 25 MB.
                    Files are previewed locally only in this demo.
                  </p>
                  <label
                    htmlFor="manuscript"
                    className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors hover:border-accent hover:bg-secondary/50"
                  >
                    <UploadCloud className="h-10 w-10 text-muted-foreground" aria-hidden />
                    <span className="mt-3 text-sm font-medium">
                      Click to choose a file, or drag it here
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      .docx, .pdf, or .zip — max 25 MB
                    </span>
                    <input
                      id="manuscript"
                      type="file"
                      accept=".docx,.pdf,.zip"
                      className="sr-only"
                      onChange={onFileChange}
                    />
                  </label>
                  {file && (
                    <div className="mt-4 flex items-center justify-between rounded-lg border bg-secondary/50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileUp className="h-4 w-4 text-accent-foreground/70 dark:text-accent" aria-hidden />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.sizeKb} KB</p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)}>
                        Remove
                      </Button>
                    </div>
                  )}
                </fieldset>
              )}

              {step === 3 && (
                <fieldset className="space-y-5">
                  <legend className="mb-2 font-display text-xl font-semibold">Declaration</legend>
                  <p className="text-sm text-muted-foreground">
                    Please confirm the following before submitting. These declarations form part of
                    our research-integrity policy.
                  </p>
                  <div className="space-y-4 rounded-xl border bg-secondary/40 p-5">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="isOriginalWork"
                        checked={watch("isOriginalWork")}
                        onCheckedChange={(v) => setValue("isOriginalWork", v === true, { shouldValidate: true })}
                        aria-invalid={!!errors.isOriginalWork}
                      />
                      <Label htmlFor="isOriginalWork" className="cursor-pointer leading-relaxed font-normal">
                        I confirm this manuscript is my original work, is not under consideration
                        elsewhere, and that all sources are properly attributed.
                      </Label>
                    </div>
                    {fieldError("isOriginalWork")}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="agreedToTerms"
                        checked={watch("agreedToTerms")}
                        onCheckedChange={(v) => setValue("agreedToTerms", v === true, { shouldValidate: true })}
                        aria-invalid={!!errors.agreedToTerms}
                      />
                      <Label htmlFor="agreedToTerms" className="cursor-pointer leading-relaxed font-normal">
                        I have read and accept the Emperical International Publication submission
                        terms, including double-blind peer review of my manuscript.
                      </Label>
                    </div>
                    {fieldError("agreedToTerms")}
                  </div>
                </fieldset>
              )}

              {step === 4 && (
                <div>
                  <h2 className="font-display text-xl font-semibold">Review your submission</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Please check everything is correct before submitting.
                  </p>
                  <dl className="mt-5 divide-y rounded-xl border">
                    {[
                      ["Name", values.fullName],
                      ["Email", values.email],
                      ["Phone", values.phone],
                      ["Country", values.country],
                      ["Affiliation", values.affiliation],
                      ["Title", values.bookTitle],
                      ["Category", values.category],
                      ["Language", values.language],
                      ["Word count", values.wordCount],
                      ["Manuscript", file?.name ?? "Not uploaded (optional)"],
                    ].map(([label, value]) => (
                      <div key={label} className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
                        <dt className="font-medium text-muted-foreground">{label}</dt>
                        <dd className="col-span-2 break-words">{value || "—"}</dd>
                      </div>
                    ))}
                    <div className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
                      <dt className="font-medium text-muted-foreground">Synopsis</dt>
                      <dd className="col-span-2 whitespace-pre-wrap break-words text-muted-foreground">
                        {values.synopsis || "—"}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={resetAll}>
            <RotateCcw /> Reset form
          </Button>
          <div className="flex gap-3">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={back}>
                <ArrowLeft /> Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={next}>
                Continue <ArrowRight />
              </Button>
            ) : (
              <Button type="submit" variant="accent" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                Submit manuscript
              </Button>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Your progress is saved automatically in this browser.
        </p>
      </form>

      {/* Success modal */}
      <Dialog open={!!result} onOpenChange={(open) => !open && setResult(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950">
              <PartyPopper className="h-7 w-7" aria-hidden />
            </div>
            <DialogTitle className="text-center font-display text-xl">
              Submission received!
            </DialogTitle>
            <DialogDescription className="text-center">
              {result?.message} Your reference number is{" "}
              <strong className="text-foreground">{result?.referenceId}</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setResult(null);
                resetAll();
              }}
            >
              Start another submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
