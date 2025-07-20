import { StudentProfilePictures } from "../student/student.type";

export type Teacher = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  profilePicture?: string;
};

export type TeacherActivity = {
  profilePicture: StudentProfilePictures;
  title: string;
  date: string;
};
