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

export type AdminActivityTypes =
  | ActivityTypes
  | "student-created"
  | "student-edited"
  | "student-deleted"
  | "assessment-created"
  | "assessment-edited"
  | "assessment-deleted"
  | "assessment-created"
  | "assessment-edited"
  | "assessment-deleted";

export type StudentActivity = {
  activityId: string;
  type: ActivityTypes;
  highlight: string | number;
  date: string;
};

export type AdminTeacherStudentActivity = {
  activityId: string;
  profilePicture: ProfilePicture;
  firstName: string;
  lastName: string;
  type: ActivityTypes;
  highlight: string | number;
  date: string;
};

export type AdminActivity = {
  activityId: string;
  userId: string;
  userType: "teacher" | "student";
  type: ActivityTypes;
  highlight: string | number;
  date: string;
};
