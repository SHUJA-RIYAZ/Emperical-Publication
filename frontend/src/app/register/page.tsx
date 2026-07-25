import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell, RegisterForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Emperical author account to submit manuscripts and track royalties.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Join 1,800+ authors publishing with Emperical — submit manuscripts, track reviews, and save titles."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline dark:text-accent">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
