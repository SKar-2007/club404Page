import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button
      onClick={logout}
      variant="outline"
      size="sm"
      className="font-mono font-bold uppercase tracking-wider border-2 border-foreground hover:bg-foreground hover:text-background"
    >
      <LogOut className="w-4 h-4 mr-1" />
      Logout
    </Button>
  );
}
