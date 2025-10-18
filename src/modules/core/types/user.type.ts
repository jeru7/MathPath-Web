export type Role = "teacher" | "student" | "admin";

export type User = {
  id: string;
  role: Role;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  verified: Verified;
  profilePicture?: ProfilePicture;
};

export type Verified = {
  verified: boolean;
  token: string | null;
};

export type ProfilePicture =
  | "Boy_1"
  | "Boy_2"
  | "Boy_3"
  | "Boy_4"
  | "Girl_1"
  | "Girl_2"
  | "Girl_3"
  | "Girl_4"
  | "Default";
