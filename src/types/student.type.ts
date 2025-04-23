import { z } from "zod";

export type StudentStatusType = "Online" | "Offline";

export interface IStudent {
  _id: string;
  studentNumber: string;
  section: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: "male" | "female";
  email: string;
  username: string;
  assessments: IStudentAssessment[];
  level: number;
  exp: number;
  quests: unknown;
  gameLevels: IStudentGameLevel[];
  lastPlayed: Date;
  status: StudentStatusType;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
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

export interface IDifficultyFrequency {
  easy: { count: number; percentage: number };
  medium: { count: number; percentage: number };
  hard: { count: number; percentage: number };
}

export interface IStudentAttempt {
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
  studentNumber: z
    .string()
    .trim()
    .min(1, "Student number is required")
    .min(6, "Student number must have at least 6 characters."),
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
