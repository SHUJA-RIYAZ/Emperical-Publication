import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell, ResetPasswordForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new password for your Emperical account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Choose a new password"
      description="Your new password must be at least 8 characters with an uppercase letter and a number."
      footer={
        <>
          All set?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline dark:text-accent">
            Back to sign in
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
