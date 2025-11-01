import { type ReactElement } from "react";
import SectionArchiveItem from "./SectionArchiveItem";
import { Section } from "../../../types/section/section.type";

type SectionArchiveListProps = {
  sections: Section[];
  onSectionClick: (section: Section) => void;
};

export default function SectionArchiveList({
  sections,
  onSectionClick,
}: SectionArchiveListProps): ReactElement {
  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No archived sections</p>
          <p className="text-sm">There are no sections in the archive.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sections.map((section) => (
        <div
          key={section.id}
          onClick={() => onSectionClick(section)}
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
        >
          <SectionArchiveItem section={section} />
        </div>
      ))}
    </div>
  );
}
