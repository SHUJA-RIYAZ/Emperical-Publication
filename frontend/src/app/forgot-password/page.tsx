import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell, ForgotPasswordForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset link for your Emperical account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter your email and we'll send you a link to reset it."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline dark:text-accent">
            Back to sign in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
