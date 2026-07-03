import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ROLE_CONFIG } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default function AccessRequestQueue() {
  const { pendingRequests, approveRequest, rejectRequest } = useAuth();
  const { toast } = useToast();

  const handleApprove = async (requestId: string) => {
    try {
      await approveRequest(requestId);
      toast({
        title: "Request Approved",
        description: "User role has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest(requestId);
      toast({
        title: "Request Rejected",
        description: "The access request has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="card-brutal">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-neon-green" />
        <h3 className="font-display font-bold text-xl text-foreground">
          Pending Requests ({pendingRequests.length})
        </h3>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-neon-green/50" />
          <p className="font-mono text-sm text-muted-foreground">
            No pending requests
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {pendingRequests.map((request, index) => (
            <motion.div
              key={request.id}
              className="border-2 border-foreground/20 p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono font-bold text-sm text-foreground">
                  {request.profiles?.full_name || "Unknown User"}
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-mono text-xs text-muted-foreground">
                  Requests:{" "}
                </span>
                <span
                  className={`text-xs font-mono font-bold uppercase px-2 py-0.5 border-2 ${ROLE_CONFIG[request.requested_role].color} ${ROLE_CONFIG[request.requested_role].bgColor} ${ROLE_CONFIG[request.requested_role].borderColor}`}
                >
                  {ROLE_CONFIG[request.requested_role].label}
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground mb-3 border-l-2 border-electric/30 pl-3">
                {request.reason}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(request.id)}
                  className="font-mono font-bold text-xs bg-neon-green/20 text-neon-green border-2 border-neon-green hover:bg-neon-green hover:text-background"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(request.id)}
                  className="font-mono font-bold text-xs border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Reject
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
