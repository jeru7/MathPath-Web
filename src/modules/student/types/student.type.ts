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

export type StudentQuest = {
  questId: string;
  questReqCompleted: number;
  isClaimed: boolean;
};
