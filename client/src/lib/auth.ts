export type UserRole = "super_admin" | "admin" | "moderator" | "member";

export type Permission =
  | "sudo"
  | "manage_users"
  | "approve_requests"
  | "manage_events"
  | "manage_challenges"
  | "manage_projects"
  | "view_admin_panel"
  | "submit_projects"
  | "submit_solutions"
  | "use_playground"
  | "view_content"
  | "request_access";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: UserRole;
  joined_at: string;
  last_active_at: string;
}

export interface AccessRequest {
  id: string;
  user_id: string;
  requested_role: UserRole;
  reason: string;
  status: "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  profiles?: Profile;
}

export interface RoleConfig {
  role: UserRole;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  permissions: Permission[];
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 4,
  admin: 3,
  moderator: 2,
  member: 1,
};

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  super_admin: {
    role: "super_admin",
    label: "Super Admin",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500",
    description: "Full system access with sudo privileges",
    permissions: [
      "sudo",
      "manage_users",
      "approve_requests",
      "manage_events",
      "manage_challenges",
      "manage_projects",
      "view_admin_panel",
      "submit_projects",
      "submit_solutions",
      "use_playground",
      "view_content",
    ],
  },
  admin: {
    role: "admin",
    label: "Admin",
    color: "text-electric",
    bgColor: "bg-electric/10",
    borderColor: "border-electric",
    description: "Administrative access with user and content management",
    permissions: [
      "manage_users",
      "approve_requests",
      "manage_events",
      "manage_challenges",
      "manage_projects",
      "view_admin_panel",
      "submit_projects",
      "submit_solutions",
      "use_playground",
      "view_content",
    ],
  },
  moderator: {
    role: "moderator",
    label: "Moderator",
    color: "text-neon-green",
    bgColor: "bg-neon-green/10",
    borderColor: "border-neon-green",
    description: "Content moderation with approval powers",
    permissions: [
      "approve_requests",
      "manage_events",
      "manage_challenges",
      "manage_projects",
      "view_admin_panel",
      "submit_projects",
      "submit_solutions",
      "use_playground",
      "view_content",
    ],
  },
  member: {
    role: "member",
    label: "Member",
    color: "text-cyber-blue",
    bgColor: "bg-cyber-blue/10",
    borderColor: "border-cyber-blue",
    description: "Standard member with view access",
    permissions: [
      "submit_projects",
      "submit_solutions",
      "use_playground",
      "view_content",
      "request_access",
    ],
  },
};
