import { Section, SectionBanner } from "../../types/section/section.type";
import Banner1 from "../../../../assets/images/section-banners/Banner_1.jpg";
import Banner2 from "../../../../assets/images/section-banners/Banner_2.jpg";
import Banner3 from "../../../../assets/images/section-banners/Banner_3.jpg";
import { Student } from "../../../student/types/student.type";

export const getSectionBanner = (banner: SectionBanner): string => {
  switch (banner) {
    case "SBanner_1":
      return Banner1;
    case "SBanner_2":
      return Banner2;
    case "SBanner_3":
      return Banner3;
    default:
      return Banner1;
  }
};

export const getStudentCountForSection = (
  section: Section | null,
  students: Student[],
): number => {
  if (!section) return 0;
  return students.filter((student) => student.sectionId === section.id).length;
};
