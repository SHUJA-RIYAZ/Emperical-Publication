"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Heart, Loader2, LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useAuthHydrated, useAuthStore } from "@/hooks/use-auth-store";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "My Submissions", href: "/account", icon: FileText },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Profile", href: "/account/profile", icon: UserRound },
] as const;

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const clearSession = useAuthStore((s) => s.clearSession);

  useEffect(() => {
    if (hydrated && !token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, token, router, pathname]);

  if (!hydrated || !token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  const signOut = () => {
    clearSession();
    toast.success("Signed out");
    router.replace("/");
  };

  return (
    <>
      <PageHeader
        title="My Account"
        description={user ? `Signed in as ${user.email}` : undefined}
        crumbs={[{ label: "My Account" }]}
      />
      <section className="container-page py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside>
            <nav aria-label="Account navigation" className="flex flex-col gap-1">
              {TABS.map((tab) => {
                const active = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <tab.icon className="h-4 w-4" aria-hidden />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
            <Button variant="outline" size="sm" className="mt-4 w-full" onClick={signOut}>
              <LogOut /> Sign out
            </Button>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </section>
    </>
  );
}
