export type Activity = {
  id: string;
  type: ActivityTypes;
  assessmentId?: string;
  stageId?: string;
  badgeId?: string;
  level?: number;
};

export type ActivityTypes =
  | "AssessmentCompleted"
  | "StageCompleted"
  | "BadgeUnlocked"
  | "LeveledUp";

export type StudentActivity = {
  activityId: string;
  unlocked: boolean;
  dateUnlocked?: string;
};
