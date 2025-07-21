import { StudentProfilePictures } from "../../../student/types/student.type";

export type Teacher = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  profilePicture?: string;
};

export type TeacherActivity = {
  // TODO: another set of profile pic for teachers???
  profilePicture: StudentProfilePictures;
  title: string;
  date: string;
};
