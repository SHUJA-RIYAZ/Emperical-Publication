"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookMarked,
  BookOpen,
  FileText,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Settings,
  Users,
  UsersRound,
  Wrench,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { clearAdminSession, getAdminToken, getAdminUser } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Books", href: "/admin/books", icon: BookOpen },
  { label: "Authors", href: "/admin/authors", icon: Users },
  { label: "Blog Posts", href: "/admin/blogs", icon: Newspaper },
  { label: "Journals", href: "/admin/journals", icon: BookMarked },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Submissions", href: "/admin/submissions", icon: Inbox },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Subscribers", href: "/admin/subscribers", icon: UsersRound },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      setReady(true);
      return;
    }
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) return <>{children}</>;

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  const user = getAdminUser();

  const logout = () => {
    clearAdminSession();
    router.replace("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center gap-2.5 border-b px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-display text-base font-bold text-primary-foreground dark:bg-accent dark:text-accent-foreground" aria-hidden>
            E
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold">Emperical</p>
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Admin Panel
            </p>
          </div>
        </div>
        <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t p-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <FileText className="h-4 w-4" aria-hidden />
            View public site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-card/85 px-4 backdrop-blur-md md:px-6">
          {/* Mobile nav */}
          <div className="flex items-center gap-2 overflow-x-auto md:hidden">
            {NAV.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.fullName}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut /> Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
