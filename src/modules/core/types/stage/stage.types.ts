type EnemyType = "Ghost" | "Slime" | "Jiji" | "Random";

export type StageQuestion = {
  question: string;
  answer: string;
  choices: string[];
  explanation: string;
  answered: boolean;
};

export type StageQuestions = {
  easy: StageQuestion[];
  medium: StageQuestion[];
  hard: StageQuestion[];
};

export type Enemy = {
  type: EnemyType;
  health: number;
};

export type StageReward = {
  coins: number;
  exp: number;
};

export type Stage = {
  id: string;
  level: number;
  bossLevel: boolean;
  name: string;
  description: string;
  topic: string;
  enemy: Enemy;
  questions: StageQuestions;
  rewards: StageReward;
  createdAt: Date;
  updatedAt: Date;
};
