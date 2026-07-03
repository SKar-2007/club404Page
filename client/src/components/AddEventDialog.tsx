import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_TYPE_CONFIG, EventType } from "@/lib/events";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  type: z.enum([
    "workshop",
    "hackathon",
    "talk",
    "meetup",
    "competition",
    "other",
  ]),
  registrationLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  imageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type EventFormData = z.infer<typeof eventSchema>;

interface AddEventDialogProps {
  onAddEvent: (event: Omit<Event, "id" | "createdAt">) => void;
}

export default function AddEventDialog({ onAddEvent }: AddEventDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: "workshop",
    },
  });

  const onSubmit = (data: EventFormData) => {
    onAddEvent({
      ...data,
      registrationLink: data.registrationLink || undefined,
      imageUrl: data.imageUrl || undefined,
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-brutal inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-4 border-foreground bg-background">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl text-foreground">
            Add New Event
          </DialogTitle>
          <DialogDescription className="font-mono text-sm text-muted-foreground">
            Create a new event for Club 404 AU
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-mono text-sm font-bold text-foreground mb-1">
              Title *
            </label>
            <Input
              {...register("title")}
              placeholder="Event title"
              className="border-2 border-foreground/30 focus:border-electric font-mono"
            />
            {errors.title && (
              <p className="text-destructive text-xs font-mono mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-mono text-sm font-bold text-foreground mb-1">
              Description *
            </label>
            <Textarea
              {...register("description")}
              placeholder="Event description"
              rows={3}
              className="border-2 border-foreground/30 focus:border-electric font-mono"
            />
            {errors.description && (
              <p className="text-destructive text-xs font-mono mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-sm font-bold text-foreground mb-1">
                Date *
              </label>
              <Input
                type="date"
                {...register("date")}
                className="border-2 border-foreground/30 focus:border-electric font-mono"
              />
              {errors.date && (
                <p className="text-destructive text-xs font-mono mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-mono text-sm font-bold text-foreground mb-1">
                Time *
              </label>
              <Input
                type="time"
                {...register("time")}
                className="border-2 border-foreground/30 focus:border-electric font-mono"
              />
              {errors.time && (
                <p className="text-destructive text-xs font-mono mt-1">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block font-mono text-sm font-bold text-foreground mb-1">
              Location *
            </label>
            <Input
              {...register("location")}
              placeholder="Event location"
              className="border-2 border-foreground/30 focus:border-electric font-mono"
            />
            {errors.location && (
              <p className="text-destructive text-xs font-mono mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-mono text-sm font-bold text-foreground mb-1">
              Event Type *
            </label>
            <select
              {...register("type")}
              className="flex h-10 w-full rounded-md border-2 border-foreground/30 bg-background px-3 py-2 text-sm font-mono focus:border-electric focus:outline-none"
            >
              {(Object.keys(EVENT_TYPE_CONFIG) as EventType[]).map((type) => (
                <option key={type} value={type}>
                  {EVENT_TYPE_CONFIG[type].label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-destructive text-xs font-mono mt-1">
                {errors.type.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-mono text-sm font-bold text-foreground mb-1">
              Registration Link (optional)
            </label>
            <Input
              {...register("registrationLink")}
              placeholder="https://..."
              className="border-2 border-foreground/30 focus:border-electric font-mono"
            />
            {errors.registrationLink && (
              <p className="text-destructive text-xs font-mono mt-1">
                {errors.registrationLink.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-mono text-sm font-bold text-foreground mb-1">
              Image URL (optional)
            </label>
            <Input
              {...register("imageUrl")}
              placeholder="https://..."
              className="border-2 border-foreground/30 focus:border-electric font-mono"
            />
            {errors.imageUrl && (
              <p className="text-destructive text-xs font-mono mt-1">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono font-bold uppercase tracking-wider px-4 py-2 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-brutal"
            >
              {isSubmitting ? "Adding..." : "Add Event"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
