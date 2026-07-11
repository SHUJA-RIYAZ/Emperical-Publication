"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import type { Book } from "@/types";

interface WishlistButtonProps {
  book: Pick<Book, "id" | "title">;
  className?: string;
  variant?: "icon" | "full";
}

export function WishlistButton({ book, className, variant = "icon" }: WishlistButtonProps) {
  const { bookIds, toggle } = useWishlist();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const saved = mounted && bookIds.includes(book.id);

  const handleToggle = () => {
    toggle(book.id);
    toast(saved ? "Removed from wishlist" : "Added to wishlist", { description: book.title });
  };

  if (variant === "full") {
    return (
      <Button variant="outline" onClick={handleToggle} className={className} aria-pressed={saved}>
        <Heart className={cn(saved && "fill-red-500 text-red-500")} />
        {saved ? "In Wishlist" : "Add to Wishlist"}
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={handleToggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
      className={cn("h-8 w-8 rounded-full shadow-md", className)}
    >
      <Heart className={cn("h-4 w-4", saved && "fill-red-500 text-red-500")} />
    </Button>
  );
}
