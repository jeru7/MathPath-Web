import { SectionBanner } from "../../core/types/section/section.type";

export type AssessmentStatusType = "Completed" | "In Progress";

export type AssessmentStatusSection = {
  name: string;
  banner: SectionBanner;
};

export type AssessmentStatus = {
  name: string;
  status: AssessmentStatusType;
  sections: AssessmentStatusSection[];
  date: {
    start: string;
    end: string;
  };
};
