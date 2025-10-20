import { z } from "zod";

// change password
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must have at least 8 characters")
      .regex(
        /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'/]/,
        "Password must contain at least one special character",
      ),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine(
    (data) => {
      // only validate if both new passwords are provided
      if (!data.newPassword || !data.confirmNewPassword) return true;
      return data.newPassword === data.confirmNewPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
    },
  )
  .refine(
    (data) => {
      // only validate if both current and new passwords are provided
      if (!data.currentPassword || !data.newPassword) return true;
      return data.newPassword !== data.currentPassword;
    },
    {
      message: "New password cannot be the same as current password",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      // only validate if both current and confirm passwords are provided
      if (!data.currentPassword || !data.confirmNewPassword) return true;
      return data.confirmNewPassword !== data.currentPassword;
    },
    {
      message: "Confirm password cannot be the same as current password",
      path: ["confirmNewPassword"],
    },
  );

export type ChangePasswordDTO = z.infer<typeof ChangePasswordSchema>;

// account settings
export const ChangeAccountSettingsSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  middleName: z
    .string()
    .max(50, "Middle name is too long")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(100, "Email is too long"),
  profilePicture: z.any().optional(),
});

export type ChangeAccountSettingsDTO = z.infer<
  typeof ChangeAccountSettingsSchema
>;

export type ChangeAccountSettingsRequest = ChangeAccountSettingsDTO;
