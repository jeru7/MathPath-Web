import { type ReactElement } from "react";
import { Assessment } from "../../types/assessment/assessment.type";
import { Student } from "../../../student/types/student.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AssessmentArchiveConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assessment: Assessment | null;
  students: Student[];
};

export default function AssessmentArchiveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  assessment,
  students,
}: AssessmentArchiveConfirmationModalProps): ReactElement {
  if (!assessment) return <></>;

  // calculate student count for the assessment
  const getStudentCountForAssessment = (assessment: Assessment): number => {
    const sectionIds = assessment.sections || [];
    return students.filter((student) => sectionIds.includes(student.sectionId))
      .length;
  };

  // calculate total questions
  const totalQuestions =
    assessment.pages?.reduce((total, page) => {
      const questionCount = page.contents.filter(
        (content) => content.type === "question",
      ).length;
      return total + questionCount;
    }, 0) || 0;

  const studentCount = getStudentCountForAssessment(assessment);
  const sectionCount = assessment.sections?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Archive Assessment</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive{" "}
            <strong>{assessment.title || "Untitled Assessment"}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {(studentCount > 0 || totalQuestions > 0) && (
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-2">
                  This assessment contains data that will be preserved:
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  {studentCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {studentCount} student{studentCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      have access to this assessment
                    </li>
                  )}
                  {sectionCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {sectionCount} section{sectionCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      assigned
                    </li>
                  )}
                  {totalQuestions > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {totalQuestions} question
                        {totalQuestions !== 1 ? "s" : ""}
                      </strong>{" "}
                      and assessment content
                    </li>
                  )}
                  <li>• All student attempts and results</li>
                  <li>• Assessment configuration and settings</li>
                  {assessment.timeLimit > 0 && (
                    <li>• Time limit: {assessment.timeLimit} minutes</li>
                  )}
                  {assessment.passingScore > 0 && (
                    <li>• Passing score: {assessment.passingScore} points</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {studentCount === 0 && totalQuestions === 0 && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> This assessment has no students
                  assigned and no questions. Only assessment information will be
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
                <li>• Assessment will no longer appear in active lists</li>
                <li>• All student attempts and data are preserved</li>
                <li>• Students cannot access the assessment while archived</li>
                <li>• Assessment configuration and questions are maintained</li>
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
            Archive Assessment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
