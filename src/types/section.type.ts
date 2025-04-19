export interface ISection {
  _id: string;
  name: string;
  teacher: string;
  color: SectionColorType;
  banner: SectionBannerType;
  lastChecked: Date;
  students?: string[];
  assessments?: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IAddSection {
  name: string;
  teacher: string;
  color: SectionColorType;
  banner: SectionBannerType;
  lastChecked: Date;
  students?: string[];
  assessments?: string[];
}

export type SectionBannerType = "SBanner_1" | "SBanner_2" | "SBanner_3";

export type SectionColorType =
  | "primary-green"
  | "tertiary-green"
  | "primary-orange"
  | "primary-yellow";
