type EnemyType = "Ghost" | "Slime" | "Jiji" | "Random";

export type StageQuestion = {
  question: string;
  answer: string;
  choices: string[];
  hint: string;
};

export type StageQuestions = {
  easy: StageQuestion[];
  medium: StageQuestion[];
  hard: StageQuestion[];
};

export type Enemy = {
  type: EnemyType;
  level: number;
  health: number;
  damage: number;
};

export type StageReward = {
  coins: number;
  exp: number;
};

export type Stage = {
  id: string;
  stage: number;
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
