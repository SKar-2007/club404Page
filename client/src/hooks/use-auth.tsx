import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile, UserRole, Permission, AccessRequest } from "@/lib/auth";
import { ROLE_HIERARCHY, ROLE_CONFIG } from "@/lib/auth";
import type { Session } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  allProfiles: Profile[];
  accessRequests: AccessRequest[];
  pendingRequests: AccessRequest[];
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGitHub: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  isRoleOrAbove: (role: UserRole) => boolean;
  changeUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  requestAccess: (requestedRole: UserRole, reason: string) => Promise<void>;
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshProfiles: () => Promise<void>;
  refreshRequests: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function isRoleOrAboveCheck(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data as Profile | null);
  }, []);

  const fetchAllProfiles = useCallback(async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("joined_at", { ascending: true });
    setAllProfiles((data as Profile[]) || []);
  }, []);

  const fetchAccessRequests = useCallback(async () => {
    const { data } = await supabase
      .from("access_requests")
      .select("*, profiles:user_id(*)")
      .order("created_at", { ascending: false });
    setAccessRequests((data as AccessRequest[]) || []);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession?.user) {
      await fetchProfile(currentSession.user.id);
    }
  }, [fetchProfile]);

  const refreshProfiles = useCallback(async () => {
    await fetchAllProfiles();
  }, [fetchAllProfiles]);

  const refreshRequests = useCallback(async () => {
    await fetchAccessRequests();
  }, [fetchAccessRequests]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then(() => setIsLoading(false));
        fetchAllProfiles();
        fetchAccessRequests();
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
          fetchAllProfiles();
          fetchAccessRequests();
        } else {
          setProfile(null);
          setAllProfiles([]);
          setAccessRequests([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile, fetchAllProfiles, fetchAccessRequests]);

  const loginWithGitHub = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setProfile(null);
    setAllProfiles([]);
    setAccessRequests([]);
  }, []);

  const hasPermission = useCallback(
    (permission: Permission) => {
      if (!profile) return false;
      return ROLE_CONFIG[profile.role]?.permissions.includes(permission) ?? false;
    },
    [profile]
  );

  const hasRole = useCallback(
    (role: UserRole) => {
      return profile?.role === role;
    },
    [profile]
  );

  const isRoleOrAboveFn = useCallback(
    (role: UserRole) => {
      if (!profile) return false;
      return isRoleOrAboveCheck(profile.role, role);
    },
    [profile]
  );

  const changeUserRole = useCallback(
    async (userId: string, newRole: UserRole) => {
      // Use server-side function for secure role changes
      const { data, error } = await supabase.rpc("change_user_role", {
        target_user_id: userId,
        new_role: newRole,
      });
      if (error) throw error;
      if (data && !data.success) {
        throw new Error(data.error || "Failed to change role");
      }
      await fetchAllProfiles();
    },
    [fetchAllProfiles]
  );

  const requestAccess = useCallback(
    async (requestedRole: UserRole, reason: string) => {
      if (!session?.user) throw new Error("Not authenticated");
      const { error } = await supabase.from("access_requests").insert({
        user_id: session.user.id,
        requested_role: requestedRole,
        reason,
      });
      if (error) throw error;
      await fetchAccessRequests();
    },
    [session, fetchAccessRequests]
  );

  const approveRequest = useCallback(
    async (requestId: string) => {
      // Use server-side function for secure approval
      const { data, error } = await supabase.rpc("approve_access_request", {
        request_id: requestId,
      });
      if (error) throw error;
      if (data && !data.success) {
        throw new Error(data.error || "Failed to approve request");
      }
      await fetchAccessRequests();
      await fetchAllProfiles();
    },
    [fetchAccessRequests, fetchAllProfiles]
  );

  const rejectRequest = useCallback(
    async (requestId: string) => {
      // Use server-side function for secure rejection
      const { data, error } = await supabase.rpc("reject_access_request", {
        request_id: requestId,
      });
      if (error) throw error;
      if (data && !data.success) {
        throw new Error(data.error || "Failed to reject request");
      }
      await fetchAccessRequests();
    },
    [fetchAccessRequests]
  );

  const pendingRequests = accessRequests.filter((r) => r.status === "pending");

  const value: AuthContextType = {
    session,
    profile,
    allProfiles,
    accessRequests,
    pendingRequests,
    isLoading,
    isAuthenticated: !!session,
    loginWithGitHub,
    loginWithGoogle,
    logout,
    hasPermission,
    hasRole,
    isRoleOrAbove: isRoleOrAboveFn,
    changeUserRole,
    requestAccess,
    approveRequest,
    rejectRequest,
    refreshProfile,
    refreshProfiles,
    refreshRequests,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
