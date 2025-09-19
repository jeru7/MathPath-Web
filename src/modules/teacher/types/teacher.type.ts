import { ProfilePicture } from "../../core/types/user.type";
import { StudentGender } from "../../student/types/student.type";

export type Teacher = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: StudentGender;
  profilePicture: ProfilePicture | null;
};
