export type UserType = "Teacher" | "Student";

export type User = {
  id: string;
  role: UserType;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  profilePicture?: string;
};

export type ProfilePicture =
  | "Boy_1"
  | "Boy_2"
  | "Boy_3"
  | "Boy_4"
  | "Girl_1"
  | "Girl_2"
  | "Girl_3"
  | "Girl_4";
