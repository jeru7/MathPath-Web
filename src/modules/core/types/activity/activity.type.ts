import { ProfilePicture } from "../user.type";

export type Activity = {
  id: string;
  type: ActivityTypes;
  assessmentId?: string;
  stageId?: string;
  badgeId?: string;
  level?: number;
};

export type ActivityTypes = "assessment" | "stage" | "badge" | "level";

export type StudentActivity = {
  activityId: string;
  type: ActivityTypes;
  highlight: string | number;
  date: string;
};

export type TeacherStudentActivity = {
  activityId: string;
  profilePicture: ProfilePicture;
  firstName: string;
  lastName: string;
  type: ActivityTypes;
  highlight: string | number;
  date: string;
};
