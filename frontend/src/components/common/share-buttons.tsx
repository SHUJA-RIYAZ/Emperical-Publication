"use client";

import { Link2, Mail } from "lucide-react";
import { toast } from "sonner";
import { FacebookIcon, LinkedInIcon, XTwitterIcon } from "@/components/common/brand-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  title: string;
  className?: string;
}

/** UI-only share actions; copy-link uses the clipboard, the rest toast. */
export function ShareButtons({ title, className }: ShareButtonsProps) {
  const share = (network: string) => {
    toast.success(`Shared to ${network}`, {
      description: `"${title}" — sharing will be wired to real networks on launch.`,
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const items = [
    { label: "Share on X (Twitter)", icon: XTwitterIcon, onClick: () => share("X (Twitter)") },
    { label: "Share on LinkedIn", icon: LinkedInIcon, onClick: () => share("LinkedIn") },
    { label: "Share on Facebook", icon: FacebookIcon, onClick: () => share("Facebook") },
    { label: "Share by email", icon: Mail, onClick: () => share("Email") },
    { label: "Copy link", icon: Link2, onClick: copyLink },
  ];

  return (
    <div className={cn("flex items-center gap-1.5", className)} role="group" aria-label="Share">
      {items.map(({ label, icon: Icon, onClick }) => (
        <Button key={label} variant="outline" size="icon" aria-label={label} onClick={onClick}>
          <Icon />
        </Button>
      ))}
    </div>
  );
}
