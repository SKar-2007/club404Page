import { motion } from "framer-motion";
import { GithubIcon } from "@/components/BrandIcons";
import { Project } from "@/lib/hall-of-fame";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      className="card-brutal h-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex-1 flex flex-col">
        <h3 className="font-display font-bold text-lg text-foreground leading-tight mb-2">
          {project.title}
        </h3>

        <p className="font-mono text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border border-electric/30 text-electric bg-electric/5"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="font-mono text-xs text-muted-foreground mb-4">
          by <span className="text-electric">{project.author}</span>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-electric to-cyber-blue mb-4"></div>

        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brutal flex items-center justify-center gap-2 text-sm w-full"
        >
          <GithubIcon className="w-4 h-4" />
          View on GitHub
        </a>
      </div>
    </motion.div>
  );
}
