"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { CrudManager } from "@/components/admin/crud-manager";
import { ADMIN_RESOURCES } from "@/config/admin-resources";

export default function AdminResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = use(params);
  const config = ADMIN_RESOURCES[resource];
  if (!config) notFound();
  return <CrudManager resource={config} />;
}
