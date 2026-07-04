import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Zap, ExternalLink } from "lucide-react";
import { Event, EVENT_TYPE_CONFIG, EventType } from "@/lib/events";
import { HashLink } from "react-router-hash-link";

interface EventHighlightProps {
  event: Event;
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

export default function EventHighlight({ event }: EventHighlightProps) {
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
      className={`card-brutal ${BORDER_COLOR_MAP[typeColor]} shadow-[0_0_20px_hsl(var(--${typeColor})/0.3)] mb-12`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className={`w-5 h-5 ${COLOR_MAP[typeColor]}`} />
        <span className={`font-mono text-sm font-bold uppercase tracking-wider ${COLOR_MAP[typeColor]}`}>
          Latest Event
        </span>
      </div>

      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider ${COLOR_MAP[typeColor]} border-2 ${BORDER_COLOR_MAP[typeColor]} bg-${typeColor}/10`}
        >
          {config?.label}
        </span>
      </div>

      <h3 className="font-display font-black text-3xl text-foreground mb-4">
        {event.title}
      </h3>

      <p className="font-mono text-muted-foreground mb-6 leading-relaxed">
        {event.description}
      </p>

      <div className="flex flex-wrap items-center gap-6 mb-6">
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

      <div className={`h-1 w-full ${BG_COLOR_MAP[typeColor]} mb-6`}></div>

      <div className="flex flex-wrap items-center gap-4">
        {event.registrationLink ? (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutal inline-flex items-center gap-2"
          >
            Register Now
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <span className="btn-brutal opacity-50 cursor-not-allowed">
            Registration Opening Soon
          </span>
        )}
        <HashLink
          to="#events"
          className="font-mono font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
        >
          View All Events →
        </HashLink>
      </div>
    </motion.div>
  );
}
