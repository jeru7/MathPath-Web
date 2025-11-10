import { type ReactElement } from "react";
import { Section } from "../../../types/section/section.type";
import { getStudentCountForSection } from "../../../utils/section/section.util";
import { Student } from "../../../../student/types/student.type";
import { Assessment } from "../../../types/assessment/assessment.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SectionArchiveConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  section: Section | null;
  students: Student[];
  assessments: Assessment[];
};

export default function SectionArchiveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  section,
  students,
  assessments,
}: SectionArchiveConfirmationModalProps): ReactElement {
  if (!section) return <></>;

  const studentCount = getStudentCountForSection(section, students);

  // calculate exclusive assessment count
  const getExclusiveAssessmentCount = (section: Section): number => {
    return assessments.filter(
      (assessment) =>
        assessment.sections.includes(section.id) &&
        assessment.sections.length === 1,
    ).length;
  };

  const exclusiveAssessmentCount = getExclusiveAssessmentCount(section);
  const teacherCount = section.teacherIds.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Archive Section</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive <strong>{section.name}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {(studentCount > 0 || exclusiveAssessmentCount > 0) && (
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-2">
                  This section contains data that will be preserved:
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  {studentCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {studentCount} student{studentCount !== 1 ? "s" : ""}
                      </strong>{" "}
                    </li>
                  )}
                  {exclusiveAssessmentCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {exclusiveAssessmentCount} exclusive assessment
                        {exclusiveAssessmentCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      will be archived
                    </li>
                  )}
                  {teacherCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {teacherCount} teacher assignment
                        {teacherCount !== 1 ? "s" : ""}
                      </strong>{" "}
                    </li>
                  )}
                  <li>• All student learning data and progress</li>
                  <li>• Assessment results and statistics</li>
                </ul>
              </CardContent>
            </Card>
          )}

          {studentCount === 0 && exclusiveAssessmentCount === 0 && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> This section has no students or
                  exclusive assessments. Only section information will be
                  archived.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-foreground mb-2">
                What happens when archiving:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Section will no longer appear in active lists</li>
                <li>• All student data is preserved</li>
                <li>• Students cannot log in while section is archived</li>
                <li>• Teacher assignments are maintained</li>
                <li>• Exclusive assessments will be archived</li>
                <li>• Can be restored from the archive section</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Archive Section
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
