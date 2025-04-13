import { z } from "zod";

export type StudentType = {
  _id: string;
  studentNumber: string;
  section: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: "male" | "female";
  email: string;
  lastPlayed: Date;
  status: "Online" | "Offline";
  createdAt: Date;
  updatedAt: Date;
};

export const studentFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  middleName: z.string().optional(),
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
  }),
  email: z.string().email("Invalid email address"),
  studentNumber: z
    .string()
    .min(1, "Student number is required")
    .min(6, "Student number must have at least 6 characters."),
  username: z.string().min(4, "Username must have at least 4 characters"),
  password: z.string().min(8, "Password must have at least 8 characters"),
  section: z.string().min(1, "Section is required"),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;
