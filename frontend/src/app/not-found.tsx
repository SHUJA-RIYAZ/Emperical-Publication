import Link from "next/link";
import { BookX, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page flex flex-col items-center justify-center py-24 text-center md:py-36">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <BookX className="h-9 w-9" aria-hidden />
      </div>
      <p className="mt-8 font-display text-7xl font-semibold text-primary dark:text-accent md:text-8xl">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-semibold md:text-3xl">
        This page is out of print
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&rsquo;re looking for has been moved, renamed, or never existed. Perhaps one of
        these will help you find what you need.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home /> Back to home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/books">
            <Search /> Browse the catalogue
          </Link>
        </Button>
      </div>
    </section>
  );
}
