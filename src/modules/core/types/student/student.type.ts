import { z } from "zod";
import { StudentQuest } from "../quest/quest.type";

export type StudentGender = "Male" | "Female";

export type StudentCharacter = StudentGender;

export type StudentStatusType = "Online" | "Offline";

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  status?: "Online" | "Offline";
  profilePicture: StudentProfilePictures;
  role: "Student";
  referenceNumber: string;
  sectionId: string;
  characterName: string;
  gender: StudentGender;
  email: string;
  assessments: StudentAssessment[];
  username: string;
  character: StudentCharacter;
  level: number;
  exp: StudentExp;
  hp: number;
  quests: StudentQuest[];
  stages: StudentStage[];
  lastPlayed: string;
  streak: number;
  createdAt: string;
  updatedAt: string;
};

export type StudentProfilePictures =
  | "Boy_1"
  | "Boy_2"
  | "Boy_3"
  | "Boy_4"
  | "Girl_1"
  | "Girl_2"
  | "Girl_3"
  | "Girl_4";

export type StudentExp = {
  currentExp: number;
  nextLevelExp: number;
};

export type StudentAssessment = {
  assessmentId: string;
  score: number;
  timeSpent: number;
  completed: boolean;
  dateAttempted: string;
  dateCompleted: string;
};

export type StudentStage = {
  stageId: string;
  stage: number;
  unlocked: boolean;
  completed: boolean;
  dateCompleted?: string;
  dateUnlocked?: string;
};

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
  gender: z.enum(["Male", "Female"], {
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
  sectionId: z.string({
    required_error: "Section is required",
  }),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;
