export interface UserAuth {
  userId: string;
  role: "teacher" | "student";
  isLoggedIn: boolean;
}
