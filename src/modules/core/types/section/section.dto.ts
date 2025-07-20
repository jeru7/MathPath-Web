import { SectionBanner, SectionColor } from "./section.type";

export type CreateSectionDto = {
  name: string;
  teacherId: string;
  color: SectionColor;
  banner: SectionBanner;
  lastChecked: string;
  studentIds?: string[];
  assessmentIds: string[];
};
