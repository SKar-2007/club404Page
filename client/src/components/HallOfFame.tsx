import { motion } from "framer-motion";
import { Trophy, Award, GitBranch } from "lucide-react";
import { useHallOfFame } from "@/hooks/use-hall-of-fame";
import ProjectCard from "./ProjectCard";
import AchievementCard from "./AchievementCard";
import MonthlyLeaderboard from "./MonthlyLeaderboard";
import SubmitProjectDialog from "./SubmitProjectDialog";
import SubmitAchievementDialog from "./SubmitAchievementDialog";

export default function HallOfFame() {
  const {
    approvedProjects,
    approvedAchievements,
    leaderboard,
    isLoading,
    submitNewProject,
    submitNewAchievement,
    isSubmitting,
  } = useHallOfFame();

  return (
    <section
      id="halloffame"
      className="py-20 bg-background relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-28 h-28 bg-electric/10 border-2 border-electric/20 transform rotate-12"></div>
        <div className="absolute bottom-10 left-10 w-20 h-20 bg-yellow-400/10 border-2 border-yellow-400/20 transform -rotate-12"></div>
        <div className="absolute top-1/3 left-1/4 w-2 h-32 bg-cyber-blue/10 transform rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl md:text-6xl mb-4 text-foreground cursor-default">
              Hall of <span className="text-electric">Fame</span>
            </h2>
            <div className="terminal-block mb-4 text-left max-w-2xl mx-auto">
              <div className="text-neon-green">$ club404.fame.show()</div>
              <div className="text-foreground mt-2">
                Celebrating outstanding contributions and achievements from our
                community members.
              </div>
            </div>
            <div className="divider-brutal max-w-xs mx-auto"></div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="font-mono text-muted-foreground animate-pulse">
              Loading Hall of Fame...
            </div>
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <GitBranch className="w-5 h-5 text-electric" />
                    <h3 className="font-display font-bold text-lg text-foreground">
                      Featured Projects
                    </h3>
                  </div>

                  {approvedProjects.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {approvedProjects.map((project, index) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          index={index}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="card-brutal text-center py-12">
                      <GitBranch className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="font-mono text-sm text-muted-foreground mb-2">
                        No projects yet
                      </p>
                      <p className="font-mono text-xs text-muted-foreground/50">
                        Be the first to submit a project!
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <MonthlyLeaderboard leaderboard={leaderboard} />
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display font-bold text-lg text-foreground">
                  Member Achievements
                </h3>
              </div>

              {approvedAchievements.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {approvedAchievements.map((achievement, index) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="card-brutal text-center py-12 mb-8">
                  <Trophy className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="font-mono text-sm text-muted-foreground mb-2">
                    No achievements yet
                  </p>
                  <p className="font-mono text-xs text-muted-foreground/50">
                    Submit your achievements for review!
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <SubmitProjectDialog
                onSubmit={submitNewProject}
                isSubmitting={isSubmitting}
              />
              <SubmitAchievementDialog
                onSubmit={submitNewAchievement}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
