"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "@/lib/admin-api";
import { invalidateSettings } from "@/services/settings.service";
import type { SiteSettings } from "@/types";

const SOCIAL_KEYS = ["twitter", "linkedin", "facebook", "instagram", "youtube"] as const;

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setError(null);
    adminFetch<SiteSettings>("/admin/settings")
      .then(setSettings)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load settings"));
  }, []);

  useEffect(load, [load]);

  const save = async () => {
    if (!settings) return;
    // Light validation before sending
    if (!settings.site.name.trim() || !settings.site.email.trim()) {
      toast.error("Site name and email are required");
      return;
    }
    if (!Number.isFinite(settings.site.founded)) {
      toast.error("Founded must be a valid year");
      return;
    }
    setSaving(true);
    try {
      const saved = await adminFetch<SiteSettings>("/admin/settings", {
        method: "PUT",
        body: settings,
      });
      setSettings(saved);
      invalidateSettings();
      toast.success("Settings saved", {
        description: "The public site now reflects your changes.",
      });
    } catch (e) {
      toast.error("Save failed", { description: e instanceof Error ? e.message : undefined });
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold">Site Settings</h1>
        <ErrorState className="mt-6" description={error} onRetry={load} />
      </div>
    );
  }

  if (!settings) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold">Site Settings</h1>
        <div className="mt-6 space-y-6">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const { site, stats, trustedBy, socials, offices, process } = settings;
  const patch = (partial: Partial<SiteSettings>) => setSettings({ ...settings, ...partial });
  const patchSite = (field: keyof SiteSettings["site"], value: string | number) =>
    patch({ site: { ...site, [field]: value } });

  const saveButton = (
    <Button onClick={save} disabled={saving}>
      {saving ? <Loader2 className="animate-spin" /> : <Save />}
      Save all settings
    </Button>
  );

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Site Settings</h1>
          <p className="text-sm text-muted-foreground">
            Everything here updates the public website instantly — no code changes needed.
          </p>
        </div>
        {saveButton}
      </div>

      <div className="mt-6 space-y-6">
        <Section
          title="Site information"
          description="Company identity, contact details, and the footer description."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="s-name">Company name *</Label>
              <Input id="s-name" className="mt-1.5" value={site.name} onChange={(e) => patchSite("name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="s-short">Short name</Label>
              <Input id="s-short" className="mt-1.5" value={site.shortName} onChange={(e) => patchSite("shortName", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="s-tagline">Tagline</Label>
              <Input id="s-tagline" className="mt-1.5" value={site.tagline} onChange={(e) => patchSite("tagline", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="s-desc">Description (footer & SEO)</Label>
              <Textarea id="s-desc" className="mt-1.5" value={site.description} onChange={(e) => patchSite("description", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="s-email">Contact email *</Label>
              <Input id="s-email" type="email" className="mt-1.5" value={site.email} onChange={(e) => patchSite("email", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="s-phone">Phone</Label>
              <Input id="s-phone" className="mt-1.5" value={site.phone} onChange={(e) => patchSite("phone", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="s-address">Headquarters address</Label>
              <Input id="s-address" className="mt-1.5" value={site.address} onChange={(e) => patchSite("address", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="s-founded">Founded (year)</Label>
              <Input
                id="s-founded"
                type="number"
                className="mt-1.5"
                value={site.founded}
                onChange={(e) => patchSite("founded", parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>
        </Section>

        <Section
          title="Statistics"
          description="The animated counters on the homepage and About page."
        >
          <div className="space-y-3">
            {stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-[1fr_120px_80px_36px] items-end gap-3">
                <div>
                  {i === 0 && <Label>Label</Label>}
                  <Input
                    className={i === 0 ? "mt-1.5" : ""}
                    value={stat.label}
                    aria-label={`Stat ${i + 1} label`}
                    onChange={(e) =>
                      patch({ stats: stats.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)) })
                    }
                  />
                </div>
                <div>
                  {i === 0 && <Label>Value</Label>}
                  <Input
                    type="number"
                    className={i === 0 ? "mt-1.5" : ""}
                    value={stat.value}
                    aria-label={`Stat ${i + 1} value`}
                    onChange={(e) =>
                      patch({
                        stats: stats.map((s, j) =>
                          j === i ? { ...s, value: parseInt(e.target.value, 10) || 0 } : s
                        ),
                      })
                    }
                  />
                </div>
                <div>
                  {i === 0 && <Label>Suffix</Label>}
                  <Input
                    className={i === 0 ? "mt-1.5" : ""}
                    value={stat.suffix}
                    placeholder="+"
                    aria-label={`Stat ${i + 1} suffix`}
                    onChange={(e) =>
                      patch({ stats: stats.map((s, j) => (j === i ? { ...s, suffix: e.target.value } : s)) })
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-destructive hover:text-destructive"
                  aria-label={`Remove stat ${i + 1}`}
                  onClick={() => patch({ stats: stats.filter((_, j) => j !== i) })}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => patch({ stats: [...stats, { label: "New statistic", value: 0, suffix: "" }] })}
            >
              <Plus /> Add statistic
            </Button>
          </div>
        </Section>

        <Section
          title="Trusted-by institutions"
          description="Shown in the homepage marquee — one institution per line."
        >
          <Textarea
            className="min-h-40"
            value={trustedBy.join("\n")}
            aria-label="Trusted institutions, one per line"
            onChange={(e) => patch({ trustedBy: e.target.value.split("\n") })}
            onBlur={(e) =>
              patch({ trustedBy: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean) })
            }
          />
        </Section>

        <Section title="Social links" description="Footer icons — leave a field empty to hide that network.">
          <div className="grid gap-4 sm:grid-cols-2">
            {SOCIAL_KEYS.map((key) => (
              <div key={key}>
                <Label htmlFor={`social-${key}`} className="capitalize">
                  {key}
                </Label>
                <Input
                  id={`social-${key}`}
                  className="mt-1.5"
                  placeholder="https://…"
                  value={socials[key] ?? ""}
                  onChange={(e) => patch({ socials: { ...socials, [key]: e.target.value } })}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Offices" description="Office cards on the Contact page.">
          <div className="space-y-4">
            {offices.map((office, i) => (
              <div key={i} className="rounded-lg border bg-secondary/30 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>City / label</Label>
                    <Input
                      className="mt-1.5"
                      value={office.city}
                      onChange={(e) =>
                        patch({ offices: offices.map((o, j) => (j === i ? { ...o, city: e.target.value } : o)) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Hours</Label>
                    <Input
                      className="mt-1.5"
                      value={office.hours}
                      onChange={(e) =>
                        patch({ offices: offices.map((o, j) => (j === i ? { ...o, hours: e.target.value } : o)) })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Address</Label>
                    <Input
                      className="mt-1.5"
                      value={office.address}
                      onChange={(e) =>
                        patch({ offices: offices.map((o, j) => (j === i ? { ...o, address: e.target.value } : o)) })
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 text-destructive hover:text-destructive"
                  onClick={() => patch({ offices: offices.filter((_, j) => j !== i) })}
                >
                  <Trash2 /> Remove office
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => patch({ offices: [...offices, { city: "New office", address: "", hours: "" }] })}
            >
              <Plus /> Add office
            </Button>
          </div>
        </Section>

        <Section
          title="Publishing process"
          description="The step-by-step timeline on the homepage (steps are numbered automatically)."
        >
          <div className="space-y-4">
            {process.map((step, i) => (
              <div key={i} className="rounded-lg border bg-secondary/30 p-4">
                <div className="grid gap-3">
                  <div>
                    <Label>Step {i + 1} title</Label>
                    <Input
                      className="mt-1.5"
                      value={step.title}
                      onChange={(e) =>
                        patch({
                          process: process.map((p, j) => (j === i ? { ...p, title: e.target.value } : p)),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      className="mt-1.5 min-h-20"
                      value={step.description}
                      onChange={(e) =>
                        patch({
                          process: process.map((p, j) =>
                            j === i ? { ...p, description: e.target.value } : p
                          ),
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 text-destructive hover:text-destructive"
                  onClick={() =>
                    patch({
                      process: process
                        .filter((_, j) => j !== i)
                        .map((p, j) => ({ ...p, step: j + 1 })),
                    })
                  }
                >
                  <Trash2 /> Remove step
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                patch({
                  process: [
                    ...process,
                    { step: process.length + 1, title: "New step", description: "" },
                  ],
                })
              }
            >
              <Plus /> Add step
            </Button>
          </div>
        </Section>

        <div className="flex justify-end pb-8">{saveButton}</div>
      </div>
    </div>
  );
}
