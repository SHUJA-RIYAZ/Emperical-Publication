"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/hooks/use-auth-store";
import { changePassword, updateProfile } from "@/services/account.service";

const profileSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string(),
  affiliation: z.string(),
  country: z.string(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function AccountProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phone: "", affiliation: "", country: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName,
        phone: user.phone,
        affiliation: user.affiliation,
        country: user.country,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onSaveProfile = async (values: z.infer<typeof profileSchema>) => {
    setSavingProfile(true);
    try {
      setUser(await updateProfile(values));
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Could not save profile", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async (values: z.infer<typeof passwordSchema>) => {
    setSavingPassword(true);
    try {
      const result = await changePassword(values.currentPassword, values.newPassword);
      toast.success("Password changed", { description: result.message });
      passwordForm.reset();
    } catch (error) {
      toast.error("Could not change password", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          These details pre-fill your manuscript submissions.
        </p>
        <form
          onSubmit={profileForm.handleSubmit(onSaveProfile)}
          noValidate
          className="mt-5 space-y-4"
        >
          <div>
            <Label htmlFor="p-email">Email</Label>
            <Input id="p-email" className="mt-1.5" value={user?.email ?? ""} disabled readOnly />
            <p className="mt-1 text-xs text-muted-foreground">
              Contact us if you need to change your email address.
            </p>
          </div>
          <div>
            <Label htmlFor="p-name">Full name *</Label>
            <Input id="p-name" className="mt-1.5" {...profileForm.register("fullName")} />
            {profileForm.formState.errors.fullName && (
              <p className="mt-1.5 text-sm text-destructive" role="alert">
                {profileForm.formState.errors.fullName.message}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="p-phone">Phone</Label>
              <Input id="p-phone" className="mt-1.5" {...profileForm.register("phone")} />
            </div>
            <div>
              <Label htmlFor="p-country">Country</Label>
              <Input id="p-country" className="mt-1.5" {...profileForm.register("country")} />
            </div>
          </div>
          <div>
            <Label htmlFor="p-affiliation">Institution / affiliation</Label>
            <Input id="p-affiliation" className="mt-1.5" {...profileForm.register("affiliation")} />
          </div>
          <Button type="submit" disabled={savingProfile}>
            {savingProfile ? <Loader2 className="animate-spin" /> : <Save />}
            Save profile
          </Button>
        </form>
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold">Change password</h2>
        <form
          onSubmit={passwordForm.handleSubmit(onChangePassword)}
          noValidate
          className="mt-5 space-y-4"
        >
          <div>
            <Label htmlFor="p-current">Current password</Label>
            <Input
              id="p-current"
              type="password"
              className="mt-1.5"
              autoComplete="current-password"
              {...passwordForm.register("currentPassword")}
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="mt-1.5 text-sm text-destructive" role="alert">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="p-new">New password</Label>
            <Input
              id="p-new"
              type="password"
              className="mt-1.5"
              autoComplete="new-password"
              {...passwordForm.register("newPassword")}
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="mt-1.5 text-sm text-destructive" role="alert">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="p-confirm">Confirm new password</Label>
            <Input
              id="p-confirm"
              type="password"
              className="mt-1.5"
              autoComplete="new-password"
              {...passwordForm.register("confirmPassword")}
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-destructive" role="alert">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" variant="outline" disabled={savingPassword}>
            {savingPassword ? <Loader2 className="animate-spin" /> : <KeyRound />}
            Update password
          </Button>
        </form>
      </section>
    </div>
  );
}
