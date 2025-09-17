import { z } from "zod";

export const LoginFormSchema = z
  .object({
    accountType: z.enum(["Student", "Teacher"]),
    identifier: z.string(), // no min(1) here
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
  })
  .superRefine((data, ctx) => {
    const { accountType, identifier } = data;

    if (accountType === "Student") {
      if (!identifier) {
        ctx.addIssue({
          path: ["identifier"],
          message: "Learner reference number is required",
          code: z.ZodIssueCode.custom,
        });
      } else if (!/^\d{12}$/.test(identifier)) {
        ctx.addIssue({
          path: ["identifier"],
          message: "Learner reference number must be exactly 12 digits",
          code: z.ZodIssueCode.custom,
        });
      } else if (!/^(4875|4066|4870|1368)/.test(identifier)) {
        ctx.addIssue({
          path: ["identifier"],
          message:
            "Learner reference number must start with 4875, 4066, 4870, or 1368",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (accountType === "Teacher") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!identifier) {
        ctx.addIssue({
          path: ["identifier"],
          message: "Email is required",
          code: z.ZodIssueCode.custom,
        });
      } else if (!emailRegex.test(identifier)) {
        ctx.addIssue({
          path: ["identifier"],
          message: "Invalid email address",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
export type LoginFormDTO = z.infer<typeof LoginFormSchema>;

export const AddStudentSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, "First name must have at least 2 characters")
    .regex(/^[A-Za-z\s]+$/, "First name must contain only letters")
    .transform((val) =>
      val.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
    ),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, "Last name must have at least 2 characters")
    .regex(/^[A-Za-z]+$/, "First name must contain only letters")
    .transform((val) =>
      val.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
    ),
  middleName: z
    .string()
    .trim()
    .regex(/^[A-Za-z]*$/, "Middle name must contain only letters")
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
    }),
  gender: z
    .enum(["Male", "Female"], {
      required_error: "Gender is required",
    })
    .nullable(),
  email: z.string().email("Invalid email address"),
  referenceNumber: z
    .string()
    .refine((val) => val.length === 12, {
      message: "Reference number must be 12 digits",
    })
    .refine((val) => /^(4875|4066|4870|1368)/.test(val), {
      message: "Reference number must start with 4875, 4066, 4870, or 1368",
    }),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  sectionId: z
    .string({
      required_error: "Section is required",
    })
    .nullable(),
});
export type AddStudentDTO = z.infer<typeof AddStudentSchema>;

export const RegisterStudentSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, "First name must have at least 2 characters")
    .regex(/^[A-Za-z\s]+$/, "First name must contain only letters")
    .transform((val) =>
      val.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
    ),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, "Last name must have at least 2 characters")
    .regex(/^[A-Za-z]+$/, "Last name must contain only letters")
    .transform((val) =>
      val.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
    ),

  middleName: z
    .string()
    .trim()
    .regex(/^[A-Za-z]*$/, "Middle name must contain only letters")
    .optional()
    .transform((val) =>
      val && val !== ""
        ? val.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
        : undefined,
    ),

  gender: z.enum(["Male", "Female"], {
    required_error: "Gender is required",
  }),

  email: z.string().email("Invalid email address"),

  referenceNumber: z
    .string()
    .refine((val) => val.length === 12, {
      message: "Reference number must be 12 digits",
    })
    .refine((val) => /^(4875|4066|4870|1368)/.test(val), {
      message: "Reference number must start with 4875, 4066, 4870, or 1368",
    }),

  password: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),

  confirmNewPassword: z.string().min(1, "Confirm password is required"),
});
export type RegisterStudentDTO = z.infer<typeof RegisterStudentSchema>;

export const RegisterFormSchema = RegisterStudentSchema.extend({
  registrationCode: z
    .string()
    .min(6, "Registration code must be 6 characters")
    .max(6, "Registration code must be 6 characters")
    .transform((val) => val.toUpperCase()),
}).refine((data) => data.password === data.confirmNewPassword, {
  path: ["confirmNewPassword"],
  message: "Passwords do not match",
});
export type RegisterFormDTO = z.infer<typeof RegisterFormSchema>;
