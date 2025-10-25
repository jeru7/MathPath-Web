import { Gender, ProfilePicture, Verified } from "../../core/types/user.type";

export type Admin = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  profilePicture: ProfilePicture | null;
  gender: Gender;
  changes: string[];
  verified: Verified;
  createdAt: string;
  updatedAt: string;
};
