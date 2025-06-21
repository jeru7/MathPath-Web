export type DifficultyFrequency = {
  easy: { count: number; percentage: number };
  medium: { count: number; percentage: number };
  hard: { count: number; percentage: number };
};

export type StudentAttemptStats = {
  totalAttempts: number;
  completedAttempts: number;
  winRate: number;
};

export type PlayerCard = {
  playerLevel: number;
  totalPlaytime?: number;
  completedStagesCount: number;
  mostPlayedStage: number;
  mostFailedStage: number;
  mostUsedSkill: string;
};
