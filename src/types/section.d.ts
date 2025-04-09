export type Section = {
  _id: string;
  name: string;
  teacher: string;
  color: SectionColor;
  banner: SectionBanner;
  lastChecked: Date;
  students?: string[];
  assessments?: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type AddSection = {
  name: string;
  teacher: string;
  color: SectionColor;
  banner: SectionBanner;
  lastChecked: Date;
  students?: string[];
  assessments?: string[];
};

export type SectionBanner = "SBanner_1" | "SBanner_2" | "SBanner_3";

export type SectionColor =
  | "primary-green"
  | "tertiary-green"
  | "primary-orange"
  | "primary-yellow";
