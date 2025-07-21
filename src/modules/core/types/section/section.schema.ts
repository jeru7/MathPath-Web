import { z } from "zod";

export const SectionSelectionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

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

export const SectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  teacherId: z.string(),
  color: SectionBannerEnum,
  banner: SectionBannerEnum,
  lastChecked: z.string(),
  studentIds: z.array(z.string()),
  assessmentIds: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateSectionSchema = z.object({
  name: z.string(),
  teacherId: z.string(),
  color: SectionColorEnum,
  banner: SectionBannerEnum,
  lastChecked: z.string(),
  studentIds: z.array(z.string()),
  assessmentIds: z.array(z.string()),
});

export type CreateSectionDTO = z.infer<typeof CreateSectionSchema>;
