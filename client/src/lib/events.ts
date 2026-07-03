export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  image?: string;
  registrationLink?: string;
  createdAt: string;
}

export type EventType =
  | "workshop"
  | "hackathon"
  | "talk"
  | "meetup"
  | "competition"
  | "other";

export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { label: string; color: string; icon: string }
> = {
  workshop: { label: "Workshop", color: "electric", icon: "Wrench" },
  hackathon: { label: "Hackathon", color: "neon-green", icon: "Code" },
  talk: { label: "Tech Talk", color: "cyber-blue", icon: "Mic" },
  meetup: { label: "Meetup", color: "electric", icon: "Users" },
  competition: { label: "Competition", color: "neon-green", icon: "Trophy" },
  other: { label: "Other", color: "cyber-blue", icon: "Calendar" },
};

export const STORAGE_KEY = "club404-au-events";

export const DEFAULT_EVENTS: Event[] = [];
