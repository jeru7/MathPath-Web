import { SectionBanner } from "../../core/types/section/section.type";
import { AssessmentStatus as Status } from "../../core/types/assessment/assessment.type";

export type AssessmentStatusSection = {
  name: string;
  banner: SectionBanner;
};

export type AssessmentStatus = {
  id: string;
  name: string;
  status: Status;
  sections: AssessmentStatusSection[];
  date: {
    start: string;
    end: string;
  };
};
