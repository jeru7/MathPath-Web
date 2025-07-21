export type SectionSelection = {
  value: string;
  label: string;
};

export type SectionBanner = "SBanner_1" | "SBanner_2" | "SBanner_3";

export type SectionColor =
  | "primary-green"
  | "tertiary-green"
  | "primary-orange"
  | "primary-yellow";

export type Section = {
  id: string;
  name: string;
  teacherId: string;
  color: SectionColor;
  banner: SectionBanner;
  lastChecked: string;
  studentIds: string[] | [];
  assessmentIds: string[] | [];
  createdAt: string;
  updatedAt: string;
};
