type EnemyType = "Ghost" | "Slime" | "Jiji" | "Random";

export interface IQuestion {
  question: string;
  answer: string;
  choices: string[];
  explanation: string;
  answered: boolean;
}

export interface IQuestions {
  easy: IQuestion[];
  medium: IQuestion[];
  hard: IQuestion[];
}

export interface IEnemy {
  type: EnemyType;
  health: number;
}

export interface IReward {
  coins: number;
  exp: number;
}

export interface IGameLevel {
  _id: string;
  level: number;
  isBossLevel: boolean;
  name: string;
  description: string;
  topic: string;
  enemy: IEnemy;
  questions: IQuestions;
  rewards: IReward;
  createdAt: Date;
  updatedAt: Date;
}
