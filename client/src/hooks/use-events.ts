import { useState, useCallback } from "react";
import {
  Event,
  DEFAULT_EVENTS,
  STORAGE_KEY,
} from "@/lib/events";

function loadEvents(): Event[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fall through to defaults
  }
  return DEFAULT_EVENTS;
}

function saveEvents(events: Event[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function sortByDate(events: Event[]): Event[] {
  return [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export interface UseEventsReturn {
  events: Event[];
  latestEvent: Event | null;
  upcomingEvents: Event[];
  pastEvents: Event[];
  addEvent: (event: Omit<Event, "id" | "createdAt">) => void;
  deleteEvent: (id: string) => void;
  isLoading: boolean;
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>(() => loadEvents());
  const isLoading = false;

  const latestEvent = events.length > 0 ? sortByDate(events)[0] : null;

  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = sortByDate(
    events.filter((e) => e.date >= today)
  );

  const pastEvents = sortByDate(
    events.filter((e) => e.date < today)
  );

  const addEvent = useCallback(
    (newEvent: Omit<Event, "id" | "createdAt">) => {
      const event: Event = {
        ...newEvent,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updated = [event, ...events];
      setEvents(updated);
      saveEvents(updated);
    },
    [events]
  );

  const deleteEvent = useCallback(
    (id: string) => {
      const updated = events.filter((e) => e.id !== id);
      setEvents(updated);
      saveEvents(updated);
    },
    [events]
  );

  return {
    events,
    latestEvent,
    upcomingEvents,
    pastEvents,
    addEvent,
    deleteEvent,
    isLoading,
  };
}
