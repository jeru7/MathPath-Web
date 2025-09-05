import { Section } from "../../../../core/types/section/section.type";

export const getSectionName = (sectionId: string, sections: Section[]) => {
  const studentSection: Section | undefined = sections.find(
    (section) => section.id === sectionId,
  );
  return studentSection ? studentSection.name : "Unknown section";
};
