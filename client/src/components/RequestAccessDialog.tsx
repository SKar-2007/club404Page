import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/lib/auth";

export default function RequestAccessDialog() {
  const [open, setOpen] = useState(false);
  const [requestedRole, setRequestedRole] = useState<UserRole>("moderator");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestAccess, profile } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (reason.length < 20) {
      toast({
        title: "Reason too short",
        description: "Please provide at least 20 characters explaining why.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await requestAccess(requestedRole, reason);
      toast({
        title: "Request Submitted",
        description: "Your access request has been sent for review.",
      });
      setOpen(false);
      setReason("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-brutal">Request Access</Button>
      </DialogTrigger>
      <DialogContent className="card-brutal border-4 border-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl text-foreground">
            Request Elevated Access
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="font-mono text-sm text-muted-foreground block mb-2">
              Current Role: {profile?.role?.replace("_", " ").toUpperCase()}
            </label>
          </div>
          <div>
            <label className="font-mono text-sm text-muted-foreground block mb-2">
              Requested Role
            </label>
            <Select
              value={requestedRole}
              onValueChange={(v) => setRequestedRole(v as UserRole)}
            >
              <SelectTrigger className="font-mono border-2 border-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="font-mono text-sm text-muted-foreground block mb-2">
              Reason (min 20 characters)
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you need this access level..."
              className="font-mono border-2 border-foreground min-h-[100px]"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || reason.length < 20}
            className="btn-brutal w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
