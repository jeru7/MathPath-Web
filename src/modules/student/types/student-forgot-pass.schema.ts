import { z } from "zod";

export const RequestCodeSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
export type RequestCodeDTO = z.infer<typeof RequestCodeSchema>;

export const VerifyCodeSchema = z.object({
  code: z
    .array(z.string())
    .length(6, "Code must be 6 digits")
    .refine((arr) => arr.every((v) => /^\d$/.test(v)), {
      message: "Code must be 6 digits",
    }),
});
export type VerifyCodeDTO = z.infer<typeof VerifyCodeSchema>;

export const SetNewPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .regex(
        /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'/]/,
        "Password must contain at least one special character",
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
export type SetNewPasswordDTO = z.infer<typeof SetNewPasswordSchema>;
