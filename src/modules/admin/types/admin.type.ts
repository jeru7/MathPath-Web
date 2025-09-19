import { ProfilePicture } from "../../core/types/user.type";

export type Admin = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  changes: string[];
  profilePicture: ProfilePicture | null;
};
