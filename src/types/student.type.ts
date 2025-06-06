import { z } from "zod";
import { IAnswerCorrectness } from "./progress-log.type";
import { IQuestionAttempt } from "./chart.type";

export enum QuestType {
  Level = "Level",
  Shop = "Shop",
  Skill = "Skill",
  GameLevel = "GameLevel",
  Monster = "Monster",
  Item = "Item",
  Sunny = "Sunny",
  MagicBook = "MagicBook",
}

export interface IStudentQuestList {
  questProgressPercentage: number;
  questProgress: IQuestProgress;
  questList: IStudentQuestListItem[];
}

export interface IStudentQuestListItem {
  questName: string;
  questType: string;
  isClaimed: boolean;
  reqCompleted: number;
  req: number;
}

export interface IQuestProgress {
  quest25: {
    completed: boolean;
    rewards: IQuestProgressReward;
    claimed: boolean;
  };
  quest50: {
    completed: boolean;
    rewards: IQuestProgressReward;
    claimed: boolean;
  };
  quest100: {
    completed: boolean;
    rewards: IQuestProgressReward;
    claimed: boolean;
  };
}

export interface IQuestProgressReward {
  exp: number;
  coins: number;
}

export interface IPlayerCard {
  playerLevel: number;
  totalPlaytime: number;
  completedStagesCount: number;
  mostPlayedStage: number;
  mostFailedStage: number;
  mostUsedSkill: string;
}

export type StudentStatusType = "Online" | "Offline";

export interface IStudent {
  _id: string;
  role: "student";
  referenceNumber: string;
  section: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  characterName: string;
  gender: "male" | "female";
  email: string;
  assessments: IStudentAssessment[];
  username: string;
  character: "male" | "female";
  level: number;
  exp: IStudentExp;
  hp: number;
  quests: IStudentQuest[];
  gameLevels: IStudentGameLevel[];
  lastPlayed: Date;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IStudentExp {
  currentExp: number;
  nextLevelExp: number;
}

interface IStudentQuest {
  questId: string;
  questReqCompleted: number;
  isClaimed: boolean;
}

interface IStudentAssessment {
  assessmentId: string;
  score: number;
  timeSpent: number;
  completed: boolean;
  dateAttempted: Date;
  dateCompleted: Date;
}

interface IStudentGameLevel {
  gameLevelId: string;
  level: number;
  unlocked: boolean;
  completed: boolean;
  dateCompleted?: Date;
  dateUnlocked?: Date;
}

export interface IStudentAttempt {
  _id: string;
  gameLevelId: string;
  secondsPlayed: number;
  dateTaken: Date;
  fled: boolean;
  died: boolean;
  completed: boolean;
  questionAttempts: IQuestionAttempt[];
  answerCorrectness: IAnswerCorrectness;
  hintUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDifficultyFrequency {
  easy: { count: number; percentage: number };
  medium: { count: number; percentage: number };
  hard: { count: number; percentage: number };
}

export interface IStudentAttemptStats {
  totalAttempts: number;
  completedAttempts: number;
  winRate: number;
}

export const studentFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, "First name must have at least 2 characters")
    .regex(/^[A-Za-z\s]+$/, "First name must contain only letters")
    .transform((val) =>
      val.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
    ),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, "Last name must have at least 2 characters")
    .regex(/^[A-Za-z]+$/, "First name must contain only letters")
    .transform((val) =>
      val.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
    ),
  middleName: z
    .string()
    .trim()
    .regex(/^[A-Za-z]*$/, "Middle name must contain only letters")
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
    }),
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
  }),
  email: z.string().email("Invalid email address"),
  referenceNumber: z
    .string()
    .trim()
    .min(1, "Student reference number is required")
    .min(6, "Student reference number must have at least 6 characters."),
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .min(4, "Username must have at least 4 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters"),
  section: z.string({
    required_error: "Section is required",
  }),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;
