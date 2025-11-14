import { type ReactElement } from "react";
import { FaUsers } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/modules/core/types/section/section.type";
import SectionCard from "../SectionCard";

type TeacherSectionsListProps = {
  teacherSections: Section[];
  getSectionStudentCount: (sectionId: string) => number;
};

export default function TeacherSectionsList({
  teacherSections,
  getSectionStudentCount,
}: TeacherSectionsListProps): ReactElement {
  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Sections
        </h2>
        <Badge variant="outline">
          {teacherSections.length} section
          {teacherSections.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {teacherSections.length > 0 ? (
        <div className="h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-sm p-4">
          <div className="space-y-4">
            {teacherSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                studentCount={getSectionStudentCount(section.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-sm border-2 border-dashed border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <FaUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">
              No Sections
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm">
              This teacher is not currently assigned to any sections.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
