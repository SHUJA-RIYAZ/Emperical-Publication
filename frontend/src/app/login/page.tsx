import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell, LoginForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Emperical author account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to track your submissions, manage your profile, and keep your wishlist in sync."
      footer={
        <>
          New to Emperical?{" "}
          <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline dark:text-accent">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
