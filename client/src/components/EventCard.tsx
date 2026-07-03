import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Trash2, ExternalLink } from "lucide-react";
import { Event, EVENT_TYPE_CONFIG, EventType } from "@/lib/events";

interface EventCardProps {
  event: Event;
  isLatest?: boolean;
  onDelete?: (id: string) => void;
}

const COLOR_MAP: Record<string, string> = {
  electric: "text-electric",
  "neon-green": "text-neon-green",
  "cyber-blue": "text-cyber-blue",
};

const BORDER_COLOR_MAP: Record<string, string> = {
  electric: "border-electric",
  "neon-green": "border-neon-green",
  "cyber-blue": "border-cyber-blue",
};

const BG_COLOR_MAP: Record<string, string> = {
  electric: "bg-electric",
  "neon-green": "bg-neon-green",
  "cyber-blue": "bg-cyber-blue",
};

export default function EventCard({
  event,
  isLatest = false,
  onDelete,
}: EventCardProps) {
  const config = EVENT_TYPE_CONFIG[event.type as EventType];
  const typeColor = config?.color || "electric";
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const [hours, minutes] = event.time.split(":");
  const hourNum = parseInt(hours, 10);
  const ampm = hourNum >= 12 ? "PM" : "AM";
  const displayHour = hourNum % 12 || 12;
  const formattedTime = `${displayHour}:${minutes} ${ampm}`;

  return (
    <motion.div
      className={`card-brutal group ${isLatest ? `${BORDER_COLOR_MAP[typeColor]} shadow-[0_0_15px_hsl(var(--${typeColor})/0.3)]` : ""}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="mb-3">
        <span
          className={`inline-block px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider ${COLOR_MAP[typeColor]} border-2 ${BORDER_COLOR_MAP[typeColor]} bg-${typeColor}/10`}
        >
          {config?.label}
        </span>
      </div>

      <h3 className="font-display font-bold text-xl text-foreground mb-2">
        {event.title}
      </h3>

      <p className="font-mono text-sm text-muted-foreground mb-4 line-clamp-2">
        {event.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
          <Calendar className={`w-4 h-4 ${COLOR_MAP[typeColor]}`} />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
          <Clock className={`w-4 h-4 ${COLOR_MAP[typeColor]}`} />
          <span>{formattedTime}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
          <MapPin className={`w-4 h-4 ${COLOR_MAP[typeColor]}`} />
          <span>{event.location}</span>
        </div>
      </div>

      <div className={`h-1 w-full ${BG_COLOR_MAP[typeColor]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mb-4`}></div>

      <div className="flex items-center justify-between">
        {event.registrationLink ? (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-sm font-bold ${COLOR_MAP[typeColor]} border-2 ${BORDER_COLOR_MAP[typeColor]} hover:bg-${typeColor}/10 transition-colors`}
          >
            Register
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span></span>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(event.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-sm text-destructive border-2 border-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Delete event"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
