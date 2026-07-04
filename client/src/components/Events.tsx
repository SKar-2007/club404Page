import { motion } from "framer-motion";
import { useEvents } from "@/hooks/use-events";
import { useAuth } from "@/hooks/use-auth";
import AddEventDialog from "./AddEventDialog";

export default function Events() {
  const { addEvent } = useEvents();
  const { isAuthenticated, isRoleOrAbove } = useAuth();

  const canAddEvent = isAuthenticated && isRoleOrAbove("moderator");

  return (
    <section id="events" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-16 right-16 w-24 h-24 bg-electric/5 border-2 border-electric/20 transform rotate-45"></div>
        <div className="absolute bottom-16 left-16 w-20 h-20 bg-neon-green/5 border-2 border-neon-green/20 transform -rotate-12"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-24 bg-cyber-blue/10 transform -rotate-45"></div>
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
              Upcoming <span className="text-electric">Events</span>
            </h2>
            <div className="terminal-block mb-4 text-left max-w-2xl mx-auto">
              <div className="text-neon-green">$ club404.events.list()</div>
            </div>
            <div className="divider-brutal max-w-xs mx-auto"></div>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {canAddEvent ? (
            <AddEventDialog onAddEvent={addEvent} />
          ) : (
            <div className="text-center">
              <p className="font-mono text-sm text-muted-foreground mb-3">
                {isAuthenticated
                  ? "You need Moderator access to add events."
                  : "Sign in as Moderator or above to add events."}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
