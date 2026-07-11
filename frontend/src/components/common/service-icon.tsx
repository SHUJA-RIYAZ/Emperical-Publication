import {
  Barcode,
  Building2,
  FileSearch,
  FlaskConical,
  Globe2,
  GraduationCap,
  Landmark,
  Languages,
  LayoutTemplate,
  Library,
  Megaphone,
  Mic,
  Monitor,
  Palette,
  PenLine,
  Printer,
  SpellCheck,
  Star,
  Tablet,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  "file-search": FileSearch,
  "pen-line": PenLine,
  "spell-check": SpellCheck,
  "flask-conical": FlaskConical,
  languages: Languages,
  users: Users,
  palette: Palette,
  "layout-template": LayoutTemplate,
  tablet: Tablet,
  barcode: Barcode,
  printer: Printer,
  mic: Mic,
  globe: Globe2,
  library: Library,
  building: Building2,
  megaphone: Megaphone,
  star: Star,
  monitor: Monitor,
  wallet: Wallet,
  "graduation-cap": GraduationCap,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Landmark;
  return <Icon className={cn("h-5 w-5", className)} aria-hidden />;
}
