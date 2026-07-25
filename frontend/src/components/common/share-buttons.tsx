"use client";

import { useEffect, useState } from "react";
import { Link2, Mail } from "lucide-react";
import { toast } from "sonner";
import { FacebookIcon, LinkedInIcon, XTwitterIcon } from "@/components/common/brand-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  title: string;
  className?: string;
}

/** Opens real network share intents; falls back to copying the link. */
export function ShareButtons({ title, className }: ShareButtonsProps) {
  const [url, setUrl] = useState("");

  useEffect(() => setUrl(window.location.href), []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const openShare = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=640");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const items = [
    {
      label: "Share on X (Twitter)",
      icon: XTwitterIcon,
      onClick: () =>
        openShare(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`),
    },
    {
      label: "Share on LinkedIn",
      icon: LinkedInIcon,
      onClick: () => openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`),
    },
    {
      label: "Share on Facebook",
      icon: FacebookIcon,
      onClick: () => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`),
    },
    {
      label: "Share by email",
      icon: Mail,
      onClick: () => {
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
      },
    },
    { label: "Copy link", icon: Link2, onClick: copyLink },
  ];

  return (
    <div className={cn("flex items-center gap-1.5", className)} role="group" aria-label="Share">
      {items.map(({ label, icon: Icon, onClick }) => (
        <Button
          key={label}
          variant="outline"
          size="icon"
          aria-label={label}
          title={label}
          disabled={!url}
          onClick={onClick}
        >
          <Icon />
        </Button>
      ))}
    </div>
  );
}
