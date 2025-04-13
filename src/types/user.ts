export type UserLoginType = {
  _id: string;
  role: "teacher" | "student";
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  profilePicture?: string;
};
