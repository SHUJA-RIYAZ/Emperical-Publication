"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Loader2, LogIn, MailCheck, UserPlus } from "lucide-react";
import { useForm, type FieldErrors, type UseFormRegisterReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useQueryParam } from "@/hooks/use-query-param";
import { useWishlist } from "@/hooks/use-wishlist";
import {
  loginAccount,
  mergeServerWishlist,
  registerAccount,
  requestPasswordReset,
  resetPassword,
} from "@/services/account.service";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function FieldError({ errors, name }: { errors: FieldErrors; name: string }) {
  const message = errors[name]?.message;
  if (typeof message !== "string") return null;
  return (
    <p className="mt-1.5 text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

function PasswordInput({
  id,
  registration,
  invalid,
  autoComplete,
}: {
  id: string;
  registration: UseFormRegisterReturn;
  invalid: boolean;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        className="pr-10"
        placeholder="••••••••"
        autoComplete={autoComplete}
        aria-invalid={invalid}
        {...registration}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground cursor-pointer"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section className="container-page flex justify-center py-16 md:py-24">
      <div className="w-full max-w-md">
        <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </section>
  );
}

const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number");

/**
 * A guest may have built up a wishlist before signing in — push it to the
 * account so it survives, then adopt the merged server list.
 */
async function syncWishlistAfterSignIn(localIds: string[], replace: (ids: string[]) => void) {
  try {
    replace(await mergeServerWishlist(localIds));
  } catch {
    // Non-fatal: the wishlist stays local until the next successful sync.
  }
}

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});

export function LoginForm() {
  const router = useRouter();
  const nextPath = useQueryParam("next");
  const setSession = useAuthStore((s) => s.setSession);
  const bookIds = useWishlist((s) => s.bookIds);
  const replaceAll = useWishlist((s) => s.replaceAll);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setSubmitting(true);
    try {
      const result = await loginAccount(values.email, values.password);
      setSession(result.accessToken, result.user);
      await syncWishlistAfterSignIn(bookIds, replaceAll);
      toast.success(`Welcome back, ${result.user.fullName}`);
      router.replace(nextPath || "/account");
    } catch (error) {
      toast.error("Sign in failed", {
        description: errorMessage(error, "Could not reach the server. Please try again."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" className="mt-1.5" placeholder="you@institution.edu" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        <FieldError errors={errors} name="email" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <Link href="/forgot-password" className="text-xs text-primary underline-offset-4 hover:underline dark:text-accent">
            Forgot password?
          </Link>
        </div>
        <div className="mt-1.5">
          <PasswordInput id="login-password" registration={register("password")} invalid={!!errors.password} autoComplete="current-password" />
        </div>
        <FieldError errors={errors} name="password" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="login-remember"
          checked={watch("remember")}
          onCheckedChange={(v) => setValue("remember", v === true)}
        />
        <Label htmlFor="login-remember" className="cursor-pointer font-normal">
          Keep me signed in
        </Label>
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="animate-spin" /> : <LogIn />}
        Sign in
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Register                                                            */
/* ------------------------------------------------------------------ */

const registerSchema = z
  .object({
    name: z.string().min(2, "Please enter your full name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    affiliation: z.string().optional(),
    country: z.string().optional(),
    password: passwordRule,
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v, "Please accept the terms to continue"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const bookIds = useWishlist((s) => s.bookIds);
  const replaceAll = useWishlist((s) => s.replaceAll);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      affiliation: "",
      country: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setSubmitting(true);
    try {
      const result = await registerAccount({
        fullName: values.name,
        email: values.email,
        password: values.password,
        affiliation: values.affiliation ?? "",
        country: values.country ?? "",
      });
      setSession(result.accessToken, result.user);
      await syncWishlistAfterSignIn(bookIds, replaceAll);
      toast.success("Account created", { description: "Welcome to Emperical." });
      router.replace("/account");
    } catch (error) {
      toast.error("Registration failed", {
        description: errorMessage(error, "Could not reach the server. Please try again."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <Label htmlFor="reg-name">Full name</Label>
        <Input id="reg-name" className="mt-1.5" placeholder="Dr. Jane Smith" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        <FieldError errors={errors} name="name" />
      </div>
      <div>
        <Label htmlFor="reg-email">Email</Label>
        <Input id="reg-email" type="email" className="mt-1.5" placeholder="you@institution.edu" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        <FieldError errors={errors} name="email" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="reg-affiliation">Institution (optional)</Label>
          <Input id="reg-affiliation" className="mt-1.5" placeholder="University" {...register("affiliation")} />
        </div>
        <div>
          <Label htmlFor="reg-country">Country (optional)</Label>
          <Input id="reg-country" className="mt-1.5" placeholder="United States" autoComplete="country-name" {...register("country")} />
        </div>
      </div>
      <div>
        <Label htmlFor="reg-password">Password</Label>
        <div className="mt-1.5">
          <PasswordInput id="reg-password" registration={register("password")} invalid={!!errors.password} autoComplete="new-password" />
        </div>
        <FieldError errors={errors} name="password" />
      </div>
      <div>
        <Label htmlFor="reg-confirm">Confirm password</Label>
        <div className="mt-1.5">
          <PasswordInput id="reg-confirm" registration={register("confirmPassword")} invalid={!!errors.confirmPassword} autoComplete="new-password" />
        </div>
        <FieldError errors={errors} name="confirmPassword" />
      </div>
      <div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="reg-terms"
            checked={watch("terms")}
            onCheckedChange={(v) => setValue("terms", v === true, { shouldValidate: true })}
            aria-invalid={!!errors.terms}
          />
          <Label htmlFor="reg-terms" className="cursor-pointer font-normal leading-snug">
            I agree to the terms of service and privacy policy
          </Label>
        </div>
        <FieldError errors={errors} name="terms" />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="animate-spin" /> : <UserPlus />}
        Create account
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Forgot password                                                     */
/* ------------------------------------------------------------------ */

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof forgotSchema>) => {
    setSubmitting(true);
    try {
      await requestPasswordReset(values.email);
      setSent(true);
    } catch (error) {
      toast.error("Request failed", {
        description: errorMessage(error, "Could not reach the server. Please try again."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center" role="status">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950">
          <MailCheck className="h-7 w-7" aria-hidden />
        </div>
        <p className="font-medium">Check your inbox</p>
        <p className="text-sm text-muted-foreground">
          If an account exists for that address, a reset link is on its way. The link expires in
          two hours.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <Label htmlFor="forgot-email">Email</Label>
        <Input id="forgot-email" type="email" className="mt-1.5" placeholder="you@institution.edu" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        <FieldError errors={errors} name="email" />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="animate-spin" /> : <MailCheck />}
        Send reset link
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Reset password                                                      */
/* ------------------------------------------------------------------ */

const resetSchema = z
  .object({
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useQueryParam("token");
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof resetSchema>) => {
    if (!token) return;
    setSubmitting(true);
    try {
      const result = await resetPassword(token, values.password);
      toast.success("Password updated", { description: result.message });
      router.replace("/login");
    } catch (error) {
      toast.error("Reset failed", {
        description: errorMessage(error, "This link may have expired. Request a new one."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  // `undefined` = the query string has not been read yet.
  if (token === undefined) {
    return <div className="h-40 animate-pulse rounded-md bg-muted" aria-label="Loading" />;
  }

  if (!token) {
    return (
      <div className="space-y-4" role="alert">
        <p className="text-sm text-destructive">
          This reset link is missing its token. Please use the link from your email, or request a
          new one.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <Label htmlFor="reset-password">New password</Label>
        <div className="mt-1.5">
          <PasswordInput id="reset-password" registration={register("password")} invalid={!!errors.password} autoComplete="new-password" />
        </div>
        <FieldError errors={errors} name="password" />
      </div>
      <div>
        <Label htmlFor="reset-confirm">Confirm new password</Label>
        <div className="mt-1.5">
          <PasswordInput id="reset-confirm" registration={register("confirmPassword")} invalid={!!errors.confirmPassword} autoComplete="new-password" />
        </div>
        <FieldError errors={errors} name="confirmPassword" />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="animate-spin" /> : <KeyRound />}
        Update password
      </Button>
    </form>
  );
}
