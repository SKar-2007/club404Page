import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import LoginButton from "./LoginButton";
import RequestAccessDialog from "./RequestAccessDialog";
import type { UserRole, Permission } from "@/lib/auth";
import { ROLE_CONFIG } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  permission?: Permission;
  role?: UserRole;
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  permission,
  role,
  fallback,
}: ProtectedRouteProps) {
  const { profile, isAuthenticated, isLoading, hasPermission, isRoleOrAbove } =
    useAuth();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="font-mono text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <motion.div
          className="card-brutal max-w-md mx-auto text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-display font-bold text-xl text-foreground mb-2">
            Authentication Required
          </h3>
          <p className="font-mono text-sm text-muted-foreground mb-6">
            Sign in to access this feature.
          </p>
          <LoginButton />
        </motion.div>
      )
    );
  }

  if (permission && !hasPermission(permission)) {
    const requiredRole = Object.entries(ROLE_CONFIG).find(([, config]) =>
      config.permissions.includes(permission)
    );
    const roleLabel = requiredRole ? requiredRole[1].label : "this feature";

    return (
      fallback || (
        <motion.div
          className="card-brutal max-w-md mx-auto text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lock className="w-12 h-12 mx-auto mb-4 text-electric" />
          <h3 className="font-display font-bold text-xl text-foreground mb-2">
            Access Restricted
          </h3>
          <p className="font-mono text-sm text-muted-foreground mb-2">
            You need {roleLabel} access to use this feature.
          </p>
          <p className="font-mono text-xs text-muted-foreground mb-6">
            Current role: {ROLE_CONFIG[profile!.role].label}
          </p>
          <RequestAccessDialog />
        </motion.div>
      )
    );
  }

  if (role && !isRoleOrAbove(role)) {
    return (
      fallback || (
        <motion.div
          className="card-brutal max-w-md mx-auto text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lock className="w-12 h-12 mx-auto mb-4 text-electric" />
          <h3 className="font-display font-bold text-xl text-foreground mb-2">
            Access Restricted
          </h3>
          <p className="font-mono text-sm text-muted-foreground mb-2">
            You need {ROLE_CONFIG[role].label} role or above.
          </p>
          <p className="font-mono text-xs text-muted-foreground mb-6">
            Current role: {ROLE_CONFIG[profile!.role].label}
          </p>
          <RequestAccessDialog />
        </motion.div>
      )
    );
  }

  return <>{children}</>;
}
