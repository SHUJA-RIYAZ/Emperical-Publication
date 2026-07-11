"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { useSettings } from "@/hooks/use-settings";

/** Direct lines + office cards, driven by admin-editable site settings. */
export function ContactInfo() {
  const { site, offices } = useSettings();

  return (
    <div className="space-y-6">
      <Reveal delay={0.1}>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Direct lines</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-accent-foreground/70 dark:text-accent" aria-hidden />
              <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="hover:underline">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-accent-foreground/70 dark:text-accent" aria-hidden />
              <a href={`mailto:${site.email}`} className="hover:underline">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </Reveal>

      {offices.map((office, i) => (
        <Reveal key={office.city} delay={0.15 + i * 0.05}>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-display text-base font-semibold">{office.city}</h3>
            <p className="mt-2 flex items-start gap-2.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground/70 dark:text-accent" aria-hidden />
              {office.address}
            </p>
            <p className="mt-1.5 flex items-center gap-2.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0 text-accent-foreground/70 dark:text-accent" aria-hidden />
              {office.hours}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
