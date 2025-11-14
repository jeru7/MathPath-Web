import {
  Archive,
  Gender,
  ProfilePicture,
  Verified,
} from "../../core/types/user.type";

export type Teacher = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: Gender;
  profilePicture: ProfilePicture | null;
  verified: Verified;
  archive: Archive;
  createdAt: string;
  updatedAt: string;
};
