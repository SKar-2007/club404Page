import { useAuth } from "@/hooks/use-auth";
import UserRoleBadge from "./UserRoleBadge";
import type { UserRole } from "@/lib/auth";

interface UserAvatarProps {
  avatarUrl?: string;
  name: string;
  role?: UserRole;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

const SIZE_CLASSES = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
};

export default function UserAvatar({
  avatarUrl,
  name,
  role,
  size = "md",
  showBadge = true,
}: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${SIZE_CLASSES[size]} rounded-full border-2 border-foreground bg-electric/20 flex items-center justify-center font-mono font-bold overflow-hidden`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {showBadge && role && <UserRoleBadge role={role} size="sm" />}
    </div>
  );
}
