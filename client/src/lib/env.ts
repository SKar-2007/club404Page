function env(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}. Check your .env file.`);
  }
  return value;
}

export const config = {
  supabase: {
    url: env("VITE_SUPABASE_URL"),
    anonKey: env("VITE_SUPABASE_ANON_KEY"),
  },
  hallOfFame: {
    apiUrl: env("VITE_HOF_API_URL"),
    projectsBinId: env("VITE_HOF_PROJECTS_BIN_ID"),
    achievementsBinId: env("VITE_HOF_ACHIEVEMENTS_BIN_ID"),
    leaderboardBinId: env("VITE_HOF_LEADERBOARD_BIN_ID"),
  },
  piston: {
    execUrl: env("VITE_PISTON_EXEC_URL"),
  },
} as const;
