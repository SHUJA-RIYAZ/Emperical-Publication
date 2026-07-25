"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Menu, UserRound } from "lucide-react";
import { NAV_LINKS } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthHydrated, useAuthStore } from "@/hooks/use-auth-store";
import { useWishlist } from "@/hooks/use-wishlist";
import { Logo } from "./logo";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const wishlistCount = useWishlist((s) => s.bookIds.length);
  const authHydrated = useAuthHydrated();
  const accountUser = useAuthStore((s) => s.user);
  const signedIn = authHydrated && !!accountUser;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/85 shadow-sm backdrop-blur-md"
          : "border-transparent bg-background"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-0.5">
          <SearchDialog />
          <Button asChild variant="ghost" size="icon" aria-label="Wishlist" className="relative">
            <Link href="/books?view=wishlist">
              <Heart />
              {mounted && wishlistCount > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] font-bold text-accent-foreground"
                  aria-label={`${wishlistCount} books in wishlist`}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label={signedIn ? "My account" : "Sign in"}
            className="hidden sm:inline-flex"
          >
            <Link href={signedIn ? "/account" : "/login"}>
              <UserRound className={signedIn ? "text-accent-foreground dark:text-accent" : undefined} />
            </Link>
          </Button>
          <Button asChild variant="accent" size="sm" className="ml-2 hidden md:inline-flex">
            <Link href="/publish">Publish With Us</Link>
          </Button>

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="xl:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-80 flex-col overflow-y-auto">
              <SheetTitle>
                <span className="font-display">Emperical</span>
              </SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
              <nav aria-label="Mobile navigation" className="mt-4 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.25 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setDrawerOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t pt-4">
                <Button asChild variant="outline" onClick={() => setDrawerOpen(false)}>
                  <Link href={signedIn ? "/account" : "/login"}>
                    {signedIn ? "My Account" : "Sign In"}
                  </Link>
                </Button>
                <Button asChild variant="accent" onClick={() => setDrawerOpen(false)}>
                  <Link href="/publish">Publish With Us</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
