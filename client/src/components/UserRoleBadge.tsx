import { ROLE_CONFIG } from "@/lib/auth";
import type { UserRole } from "@/lib/auth";
import { Shield, ShieldCheck, ShieldAlert, User } from "lucide-react";

interface UserRoleBadgeProps {
  role: UserRole;
  size?: "sm" | "md" | "lg";
}

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  super_admin: <ShieldAlert className="w-3 h-3" />,
  admin: <ShieldCheck className="w-3 h-3" />,
  moderator: <Shield className="w-3 h-3" />,
  member: <User className="w-3 h-3" />,
};

const SIZE_CLASSES = {
  sm: "text-[10px] px-1.5 py-0.5 gap-0.5",
  md: "text-xs px-2 py-1 gap-1",
  lg: "text-sm px-3 py-1.5 gap-1.5",
};

export default function UserRoleBadge({ role, size = "sm" }: UserRoleBadgeProps) {
  const config = ROLE_CONFIG[role];

  return (
    <span
      className={`inline-flex items-center font-mono font-bold uppercase tracking-wider border-2 rounded-none ${config.color} ${config.bgColor} ${config.borderColor} ${SIZE_CLASSES[size]}`}
    >
      {ROLE_ICONS[role]}
      {config.label}
    </span>
  );
}
