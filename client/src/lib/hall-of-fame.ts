export interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  githubUrl: string;
  tags: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  memberName: string;
  type: "winner" | "contributor" | "milestone" | "other";
  proofUrl?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
}

export interface LeaderboardEntry {
  id: string;
  memberName: string;
  contributions: number;
  month: string;
}

export interface ProjectSubmission {
  title: string;
  description: string;
  author: string;
  githubUrl: string;
  tags: string[];
}

export interface AchievementSubmission {
  title: string;
  description: string;
  memberName: string;
  type: "winner" | "contributor" | "milestone" | "other";
  proofUrl?: string;
}

import { config } from "./env";

export const PROJECTS_STORAGE_KEY = "club404-au-hof-projects";
export const ACHIEVEMENTS_STORAGE_KEY = "club404-au-hof-achievements";
export const LEADERBOARD_STORAGE_KEY = "club404-au-hof-leaderboard";

const API_BASE = config.hallOfFame.apiUrl;
const PROJECTS_BIN_ID = config.hallOfFame.projectsBinId;
const ACHIEVEMENTS_BIN_ID = config.hallOfFame.achievementsBinId;
const LEADERBOARD_BIN_ID = config.hallOfFame.leaderboardBinId;

async function fetchFromAPI<T>(binId: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}/${binId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.record ?? data;
  } catch {
    return null;
  }
}

async function saveToAPI<T>(binId: string, data: T): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/${binId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function loadFromLocal<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveToLocal<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function loadProjects(): Promise<Project[]> {
  const apiData = await fetchFromAPI<{ projects: Project[] }>(PROJECTS_BIN_ID);
  if (apiData?.projects) {
    saveToLocal(PROJECTS_STORAGE_KEY, apiData.projects);
    return apiData.projects;
  }
  const local = loadFromLocal<Project[]>(PROJECTS_STORAGE_KEY);
  if (local) return local;
  return [];
}

export async function loadAchievements(): Promise<Achievement[]> {
  const apiData = await fetchFromAPI<{ achievements: Achievement[] }>(ACHIEVEMENTS_BIN_ID);
  if (apiData?.achievements) {
    saveToLocal(ACHIEVEMENTS_STORAGE_KEY, apiData.achievements);
    return apiData.achievements;
  }
  const local = loadFromLocal<Achievement[]>(ACHIEVEMENTS_STORAGE_KEY);
  if (local) return local;
  return [];
}

export async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
  const apiData = await fetchFromAPI<{ leaderboard: LeaderboardEntry[] }>(LEADERBOARD_BIN_ID);
  if (apiData?.leaderboard) {
    saveToLocal(LEADERBOARD_STORAGE_KEY, apiData.leaderboard);
    return apiData.leaderboard;
  }
  const local = loadFromLocal<LeaderboardEntry[]>(LEADERBOARD_STORAGE_KEY);
  if (local) return local;
  return [];
}

export async function submitProject(submission: ProjectSubmission): Promise<Project | null> {
  const projects = await loadProjects();
  const newProject: Project = {
    ...submission,
    id: `proj-${Date.now()}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  const updated = [...projects, newProject];
  saveToLocal(PROJECTS_STORAGE_KEY, updated);
  await saveToAPI(PROJECTS_BIN_ID, { projects: updated });
  return newProject;
}

export async function submitAchievement(submission: AchievementSubmission): Promise<Achievement | null> {
  const achievements = await loadAchievements();
  const newAchievement: Achievement = {
    ...submission,
    id: `ach-${Date.now()}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  const updated = [...achievements, newAchievement];
  saveToLocal(ACHIEVEMENTS_STORAGE_KEY, updated);
  await saveToAPI(ACHIEVEMENTS_BIN_ID, { achievements: updated });
  return newAchievement;
}

export function getApprovedProjects(projects: Project[]): Project[] {
  return projects.filter((p) => p.status === "approved");
}

export function getApprovedAchievements(achievements: Achievement[]): Achievement[] {
  return achievements.filter((a) => a.status === "approved");
}

export function getCurrentMonthLeaderboard(leaderboard: LeaderboardEntry[]): LeaderboardEntry[] {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return leaderboard
    .filter((e) => e.month === currentMonth)
    .sort((a, b) => b.contributions - a.contributions);
}
