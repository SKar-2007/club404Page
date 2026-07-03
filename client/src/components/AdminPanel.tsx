import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/lib/auth";
import { ROLE_CONFIG, ROLE_HIERARCHY } from "@/lib/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, XCircle, Clock } from "lucide-react";
import AccessRequestQueue from "./AccessRequestQueue";

export default function AdminPanel() {
  const { profile, allProfiles, changeUserRole, isRoleOrAbove } = useAuth();
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<string | null>(null);

  if (!profile || !isRoleOrAbove("moderator")) {
    return null;
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await changeUserRole(userId, newRole);
      toast({
        title: "Role Updated",
        description: `User role has been changed to ${ROLE_CONFIG[newRole].label}.`,
      });
      setEditingUser(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role.",
        variant: "destructive",
      });
    }
  };

  const canEditUser = (targetRole: UserRole) => {
    if (!profile) return false;
    if (profile.role === "super_admin") return true;
    if (profile.role === "admin") {
      return ROLE_HIERARCHY[targetRole] < ROLE_HIERARCHY["admin"];
    }
    return false;
  };

  return (
    <section id="admin" className="py-20 bg-concrete-dark relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-12 left-12 w-32 h-32 bg-electric/5 border-2 border-electric/20 transform rotate-12"></div>
        <div className="absolute bottom-12 right-12 w-28 h-28 bg-neon-green/5 border-2 border-neon-green/20 transform -rotate-12"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl md:text-6xl mb-4 text-foreground cursor-default">
              Admin <span className="text-electric">Panel</span>
            </h2>
            <div className="terminal-block mb-4 text-left max-w-2xl mx-auto">
              <div className="text-neon-green">$ club404.admin.dashboard()</div>
            </div>
            <div className="divider-brutal max-w-xs mx-auto"></div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="card-brutal">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-electric" />
                <h3 className="font-display font-bold text-xl text-foreground">
                  Users ({allProfiles.length})
                </h3>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {allProfiles.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border-2 border-foreground/20 hover:border-electric/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-electric/20 border-2 border-foreground flex items-center justify-center font-mono font-bold text-xs overflow-hidden">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        )}
                      </div>
                      <div>
                        <div className="font-mono font-bold text-sm text-foreground">
                          {user.full_name}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingUser === user.id ? (
                        <div className="flex items-center gap-1">
                          <Select
                            defaultValue={user.role}
                            onValueChange={(v) =>
                              handleRoleChange(user.id, v as UserRole)
                            }
                          >
                            <SelectTrigger className="w-32 h-8 text-xs font-mono border-2 border-electric">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {canEditUser("super_admin") && (
                                <SelectItem value="super_admin">
                                  Super Admin
                                </SelectItem>
                              )}
                              {canEditUser("admin") && (
                                <SelectItem value="admin">Admin</SelectItem>
                              )}
                              <SelectItem value="moderator">
                                Moderator
                              </SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingUser(null)}
                            className="h-8 px-2"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono font-bold uppercase px-2 py-1 border-2 ${ROLE_CONFIG[user.role].color} ${ROLE_CONFIG[user.role].bgColor} ${ROLE_CONFIG[user.role].borderColor}`}
                          >
                            {ROLE_CONFIG[user.role].label}
                          </span>
                          {canEditUser(user.role) &&
                            user.id !== profile.id && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingUser(user.id)}
                                className="h-8 px-2 text-xs font-mono"
                              >
                                Edit
                              </Button>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <AccessRequestQueue />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
