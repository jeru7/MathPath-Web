export type Activity = {
  id: string;
  type: ActivityTypes;
  assessmentId?: string;
  stageId?: string;
  badgeId?: string;
  level?: number;
};

export type ActivityTypes = "Assessment" | "Stage" | "Badge" | "Level";

export type StudentActivity = {
  activityId: string;
  unlocked: boolean;
  dateUnlocked?: string;
};
