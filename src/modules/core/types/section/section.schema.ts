import { z } from "zod";

export const SectionSelectionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export type SectionSelection = z.infer<typeof SectionSelectionSchema>;

export const SectionBannerEnum = z.enum([
  "SBanner_1",
  "SBanner_2",
  "SBanner_3",
]);

export const SectionColorEnum = z.enum([
  "primary-green",
  "tertiary-green",
  "primary-orange",
  "primary-yellow",
]);

export const CreateSectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Section name is required")
    .max(40, "Section name must be less than 40 characters"),
  teacherIds: z
    .array(z.string().min(1, "Teacher ID is required"))
    .min(1, "At least one teacher is required"),
  color: SectionColorEnum,
  banner: SectionBannerEnum,
});

export type CreateSectionDTO = z.infer<typeof CreateSectionSchema>;

export const EditSectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Section name is required")
    .max(40, "Section name must be less than 40 characters"),
  color: SectionColorEnum,
  banner: SectionBannerEnum,
});

export type EditSectionDTO = z.infer<typeof EditSectionSchema>;
