import { useState, useEffect, useCallback } from "react";
import {
  Project,
  Achievement,
  LeaderboardEntry,
  ProjectSubmission,
  AchievementSubmission,
  loadProjects,
  loadAchievements,
  loadLeaderboard,
  submitProject,
  submitAchievement,
  getApprovedProjects,
  getApprovedAchievements,
  getCurrentMonthLeaderboard,
} from "@/lib/hall-of-fame";

interface UseHallOfFameReturn {
  projects: Project[];
  approvedProjects: Project[];
  achievements: Achievement[];
  approvedAchievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  submitNewProject: (submission: ProjectSubmission) => Promise<boolean>;
  submitNewAchievement: (submission: AchievementSubmission) => Promise<boolean>;
  isSubmitting: boolean;
}

export function useHallOfFame(): UseHallOfFameReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [projData, achData, lbData] = await Promise.all([
        loadProjects(),
        loadAchievements(),
        loadLeaderboard(),
      ]);
      setProjects(projData);
      setAchievements(achData);
      setLeaderboard(lbData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const approvedProjects = getApprovedProjects(projects);
  const approvedAchievements = getApprovedAchievements(achievements);
  const currentLeaderboard = getCurrentMonthLeaderboard(leaderboard);

  const submitNewProject = useCallback(
    async (submission: ProjectSubmission): Promise<boolean> => {
      setIsSubmitting(true);
      try {
        const newProject = await submitProject(submission);
        if (newProject) {
          setProjects((prev) => [...prev, newProject]);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const submitNewAchievement = useCallback(
    async (submission: AchievementSubmission): Promise<boolean> => {
      setIsSubmitting(true);
      try {
        const newAchievement = await submitAchievement(submission);
        if (newAchievement) {
          setAchievements((prev) => [...prev, newAchievement]);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return {
    projects,
    approvedProjects,
    achievements,
    approvedAchievements,
    leaderboard: currentLeaderboard,
    isLoading,
    submitNewProject,
    submitNewAchievement,
    isSubmitting,
  };
}
