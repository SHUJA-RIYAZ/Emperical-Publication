import { cn, hashCode, initials } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-[#1d3557] text-[#f0d78c]",
  "bg-[#432818] text-[#f0d78c]",
  "bg-[#1b4332] text-[#e9d8a6]",
  "bg-[#5f0f40] text-[#f2d59a]",
  "bg-[#0b3948] text-[#ecd39b]",
  "bg-[#3b4468] text-[#f0d78c]",
] as const;

interface ProfileAvatarProps {
  name: string;
  className?: string;
}

/** Initials-based avatar with a deterministic brand palette. */
export function ProfileAvatar({ name, className }: ProfileAvatarProps) {
  const color = AVATAR_COLORS[hashCode(name) % AVATAR_COLORS.length];
  return (
    <span
      role="img"
      aria-label={`Portrait placeholder for ${name}`}
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display font-semibold",
        color,
        className
      )}
    >
      {initials(name)}
    </span>
  );
}
