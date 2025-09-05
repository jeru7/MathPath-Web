import { ProfilePicture } from "../../core/types/user.type";

export type StudentGender = "Male" | "Female";
export type StudentCharacter = StudentGender;
export type StudentStatusType = "Online" | "Offline";

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  status?: "Online" | "Offline";
  profilePicture: ProfilePicture;
  role: "Student";
  referenceNumber: string;
  sectionId: string;
  characterName: string;
  gender: StudentGender;
  email: string;
  assessments: StudentAssessment[];
  character: StudentCharacter;
  level: number;
  exp: StudentExp;
  hp: number;
  quests: StudentQuest[];
  stages: StudentStage[];
  lastOnline: string;
  streak: number;
  createdAt: string;
  updatedAt: string;
};

export type StudentExp = {
  currentExp: number;
  nextLevelExp: number;
};

export type StudentAssessmentAttempt = {
  score: number;
  timeSpent: number;
  status: "completed" | "paused";
  dateAttempted: string;
  dateCompleted: string;
};

export type StudentAssessment = {
  assessmentId: string;
  attempts: StudentAssessmentAttempt[];
};

export type StudentStage = {
  stageId: string;
  stage: number;
  unlocked: boolean;
  completed: boolean;
  dateCompleted?: string;
  dateUnlocked?: string;
};

export type StudentQuest = {
  questId: string;
  questReqCompleted: number;
  isClaimed: boolean;
};
