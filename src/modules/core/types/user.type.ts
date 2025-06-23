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
