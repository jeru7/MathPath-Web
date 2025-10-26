import { z } from "zod";

export const AddTeacherSchema = z.object({
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
    .regex(/^[A-Za-z\s]+$/, "Last name must contain only letters")
    .transform((val) =>
      val.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
    ),
  middleName: z
    .string()
    .trim()
    .regex(/^[A-Za-z\s]*$/, "Middle name must contain only letters")
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
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export type AddTeacherDTO = z.infer<typeof AddTeacherSchema>;
