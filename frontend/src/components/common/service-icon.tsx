import {
  Award,
  Barcode,
  BookOpenCheck,
  Building2,
  Clock3,
  Compass,
  Eye,
  FileSearch,
  FlaskConical,
  Globe2,
  GraduationCap,
  HandCoins,
  HeartHandshake,
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
  Scale,
  ShieldCheck,
  Sparkles,
  SpellCheck,
  Star,
  Tablet,
  Users,
  Users2,
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
  // Keys used by the admin-editable About values and Why-choose-us reasons.
  scale: Scale,
  "heart-handshake": HeartHandshake,
  sparkles: Sparkles,
  "shield-check": ShieldCheck,
  "hand-coins": HandCoins,
  clock: Clock3,
  award: Award,
  compass: Compass,
  eye: Eye,
  "book-open-check": BookOpenCheck,
  users2: Users2,
};

/** Icon keys offered in the admin panel's pickers. */
export const ICON_KEYS = Object.keys(ICONS).sort();

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Landmark;
  return <Icon className={cn("h-5 w-5", className)} aria-hidden />;
}
