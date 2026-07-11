"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XTwitterIcon,
  YouTubeIcon,
} from "@/components/common/brand-icons";
import { FOOTER_LINKS } from "@/constants";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { useSettings } from "@/hooks/use-settings";
import { Logo } from "./logo";

const SOCIAL_ICONS = [
  { key: "twitter", label: "X (Twitter)", icon: XTwitterIcon },
  { key: "linkedin", label: "LinkedIn", icon: LinkedInIcon },
  { key: "facebook", label: "Facebook", icon: FacebookIcon },
  { key: "instagram", label: "Instagram", icon: InstagramIcon },
  { key: "youtube", label: "YouTube", icon: YouTubeIcon },
] as const;

export function Footer() {
  const { site, socials } = useSettings();

  return (
    <footer className="border-t bg-card">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">{site.description}</p>
            <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground/70 dark:text-accent" />
                {site.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-accent-foreground/70 dark:text-accent" />
                <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="hover:text-foreground">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-accent-foreground/70 dark:text-accent" />
                <a href={`mailto:${site.email}`} className="hover:text-foreground">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          {(
            [
              ["Explore", FOOTER_LINKS.explore],
              ["Services", FOOTER_LINKS.services],
              ["Company", FOOTER_LINKS.company],
            ] as const
          ).map(([title, links]) => (
            <nav key={title} aria-label={`Footer — ${title}`}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Stay in the loop</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Monthly digest of new titles, calls for papers, and publishing insights.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {site.name}. All rights reserved. Est. {site.founded}.
          </p>
          <div className="flex items-center gap-1">
            {SOCIAL_ICONS.filter(({ key }) => socials[key]).map(({ key, label, icon: Icon }) => (
              <a
                key={key}
                href={socials[key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
