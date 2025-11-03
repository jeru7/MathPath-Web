import {
  Archive,
  Gender,
  ProfilePicture,
  Verified,
} from "../../core/types/user.type";

export type StudentCharacter = Gender;
export type StudentStatusType = "Online" | "Offline";

export type StudentBadge = {
  badgeId: string;
  reqCompleted: number;
  dateFinished: Date | null;
};

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
  gender: Gender;
  email: string;
  assessments: StudentAssessment[];
  character: StudentCharacter;
  badges: StudentBadge[];
  level: number;
  exp: StudentExp;
  hp: number;
  quests: StudentQuest[];
  stages: StudentStage[];
  lastOnline: string;
  streak: number;
  verified: Verified;
  archive: Archive;
  createdAt: string;
  updatedAt: string;
};

export type StudentExp = {
  current: number;
  nextLevel: number;
};

export type StudentAssessment = {
  assessmentId: string;
  attempts: string[];
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
