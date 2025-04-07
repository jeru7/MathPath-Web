export interface UserAuthData {
  userId: string;
  role: "teacher" | "student";
  isLoggedIn: boolean;
}
