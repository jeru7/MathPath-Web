import { z } from "zod";

export const AdminLoginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});
export type AdminLoginDTO = z.infer<typeof AdminLoginSchema>;
