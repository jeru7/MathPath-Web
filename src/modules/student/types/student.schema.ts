import { z } from "zod";

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
    .trim()
    .min(1, "Student reference number is required")
    .min(6, "Student reference number must have at least 6 characters."),
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

export const RegisterStudentSchema = z
  .object({
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
      .trim()
      .min(6, "LRN must have at least 6 characters"),

    password: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),

    confirmNewPassword: z.string().min(1, "Confirm password is required"),

    registrationCode: z
      .string()
      .trim()
      .min(6, "Registration code must have at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

export type RegisterStudentDTO = z.infer<typeof RegisterStudentSchema>;
