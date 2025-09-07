import { ProfilePicture } from "../../core/types/user.type";

export type Teacher = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  profilePicture: ProfilePicture | null;
};
