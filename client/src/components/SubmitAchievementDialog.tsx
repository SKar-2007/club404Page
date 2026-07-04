import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { AchievementSubmission } from "@/lib/hall-of-fame";

const achievementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  memberName: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["winner", "contributor", "milestone", "other"], {
    required_error: "Please select a type",
  }),
  proofUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof achievementSchema>;

interface SubmitAchievementDialogProps {
  onSubmit: (submission: AchievementSubmission) => Promise<boolean>;
  isSubmitting: boolean;
}

const ACHIEVEMENT_TYPES = [
  { value: "winner", label: "Contest Winner", description: "Won a competition or hackathon" },
  { value: "contributor", label: "Top Contributor", description: "Significant contributions to the club" },
  { value: "milestone", label: "Milestone", description: "Reached a personal or club milestone" },
  { value: "other", label: "Other", description: "Other notable achievement" },
] as const;

export default function SubmitAchievementDialog({
  onSubmit,
  isSubmitting,
}: SubmitAchievementDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(achievementSchema),
  });

  const onFormSubmit = async (data: FormData) => {
    const submission: AchievementSubmission = {
      title: data.title,
      description: data.description,
      memberName: data.memberName,
      type: data.type,
      proofUrl: data.proofUrl || undefined,
    };

    const success = await onSubmit(submission);
    if (success) {
      setSubmitSuccess(true);
      reset();
      setTimeout(() => {
        setOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setSubmitSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-brutal flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Submit Achievement
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl">
            Submit Achievement
          </DialogTitle>
          <DialogDescription className="font-mono text-sm text-muted-foreground">
            Submit an achievement for review. Once approved by a mod/admin, it
            will appear in the Hall of Fame.
          </DialogDescription>
        </DialogHeader>

        {submitSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto bg-neon-green/20 border-2 border-neon-green flex items-center justify-center transform rotate-45 mb-4">
              <span className="text-neon-green text-2xl -rotate-45">✓</span>
            </div>
            <p className="font-display font-bold text-lg text-neon-green">
              Achievement Submitted!
            </p>
            <p className="font-mono text-sm text-muted-foreground mt-2">
              Pending review. It will appear here once approved by a mod/admin.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-muted-foreground block mb-1">
                Achievement Title *
              </label>
              <Input
                {...register("title")}
                placeholder="Hackfest Winner 2026"
                className="font-mono"
              />
              {errors.title && (
                <p className="font-mono text-xs text-destructive mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs text-muted-foreground block mb-1">
                Description *
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Describe the achievement..."
                className="w-full bg-background border-2 border-foreground/20 p-2 font-mono text-sm focus:border-electric outline-none resize-none"
              />
              {errors.description && (
                <p className="font-mono text-xs text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs text-muted-foreground block mb-1">
                Member Name *
              </label>
              <Input
                {...register("memberName")}
                placeholder="John Doe"
                className="font-mono"
              />
              {errors.memberName && (
                <p className="font-mono text-xs text-destructive mt-1">
                  {errors.memberName.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs text-muted-foreground block mb-2">
                Achievement Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ACHIEVEMENT_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-start gap-2 p-2 border-2 border-foreground/20 hover:border-electric cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      {...register("type")}
                      value={type.value}
                      className="mt-0.5 accent-electric"
                    />
                    <div>
                      <div className="font-mono text-xs font-bold text-foreground">
                        {type.label}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {type.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.type && (
                <p className="font-mono text-xs text-destructive mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <Award className="w-3 h-3" />
                Proof URL (optional)
              </label>
              <Input
                {...register("proofUrl")}
                placeholder="https://... (certificate, tweet, etc.)"
                className="font-mono"
              />
              {errors.proofUrl && (
                <p className="font-mono text-xs text-destructive mt-1">
                  {errors.proofUrl.message}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-brutal flex-1 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit for Review"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
