import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2 } from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";
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
import { ProjectSubmission } from "@/lib/hall-of-fame";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  author: z.string().min(2, "Author must be at least 2 characters"),
  githubUrl: z
    .string()
    .url("Must be a valid URL")
    .refine((url) => url.includes("github.com"), "Must be a GitHub URL"),
  tags: z.string().min(1, "At least one tag required"),
});

type FormData = z.infer<typeof projectSchema>;

interface SubmitProjectDialogProps {
  onSubmit: (submission: ProjectSubmission) => Promise<boolean>;
  isSubmitting: boolean;
}

export default function SubmitProjectDialog({
  onSubmit,
  isSubmitting,
}: SubmitProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema),
  });

  const onFormSubmit = async (data: FormData) => {
    const tags = data.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const submission: ProjectSubmission = {
      title: data.title,
      description: data.description,
      author: data.author,
      githubUrl: data.githubUrl,
      tags,
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
          Submit Project
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl">
            Submit Project
          </DialogTitle>
          <DialogDescription className="font-mono text-sm text-muted-foreground">
            Submit your GitHub project for review. Once approved by a mod/admin,
            it will appear in the Hall of Fame.
          </DialogDescription>
        </DialogHeader>

        {submitSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto bg-neon-green/20 border-2 border-neon-green flex items-center justify-center transform rotate-45 mb-4">
              <span className="text-neon-green text-2xl -rotate-45">✓</span>
            </div>
            <p className="font-display font-bold text-lg text-neon-green">
              Project Submitted!
            </p>
            <p className="font-mono text-sm text-muted-foreground mt-2">
              Your project is pending review. It will appear here once approved
              by a mod/admin.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-muted-foreground block mb-1">
                Project Title *
              </label>
              <Input
                {...register("title")}
                placeholder="My Awesome Project"
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
                placeholder="What does this project do? What technologies did you use?"
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
                Your Name / Username *
              </label>
              <Input
                {...register("author")}
                placeholder="@your_username"
                className="font-mono"
              />
              {errors.author && (
                <p className="font-mono text-xs text-destructive mt-1">
                  {errors.author.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <GithubIcon className="w-3 h-3" />
                GitHub Repository URL *
              </label>
              <Input
                {...register("githubUrl")}
                placeholder="https://github.com/username/repo"
                className="font-mono"
              />
              {errors.githubUrl && (
                <p className="font-mono text-xs text-destructive mt-1">
                  {errors.githubUrl.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs text-muted-foreground block mb-1">
                Tags * (comma-separated)
              </label>
              <Input
                {...register("tags")}
                placeholder="react, typescript, animation"
                className="font-mono"
              />
              {errors.tags && (
                <p className="font-mono text-xs text-destructive mt-1">
                  {errors.tags.message}
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
