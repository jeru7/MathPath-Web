import { type ReactElement } from "react";
import { useStudentAttempts } from "../../../../student/services/student.service";
import { useAssessmentsAttempts } from "../../../../student/services/student-assessment-attempt.service";
import { Student } from "../../../../student/types/student.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type StudentArchiveConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  student: Student | null;
};

export default function StudentArchiveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  student,
}: StudentArchiveConfirmationModalProps): ReactElement {
  const { data: stageAttempts } = useStudentAttempts(student?.id || "");
  const { data: assessmentAttempts } = useAssessmentsAttempts(
    student?.id || "",
  );

  const stageAttemptCount = stageAttempts?.length || 0;
  const assessmentAttemptCount = assessmentAttempts?.length || 0;

  if (!student) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Archive Student</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive{" "}
            <strong>
              {student.firstName} {student.lastName}
            </strong>{" "}
            (LRN: {student.referenceNumber})?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {(assessmentAttemptCount > 0 || stageAttemptCount > 0) && (
            <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                <div className="font-medium mb-2">
                  This student has learning data that will be preserved:
                </div>
                <ul className="space-y-1 text-sm">
                  {assessmentAttemptCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {assessmentAttemptCount} assessment attempt
                        {assessmentAttemptCount !== 1 ? "s" : ""}
                      </strong>
                    </li>
                  )}
                  {stageAttemptCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {stageAttemptCount} stage attempt
                        {stageAttemptCount !== 1 ? "s" : ""}
                      </strong>
                    </li>
                  )}
                  <li>• All learning progress and statistics</li>
                  <li>• Performance data and heatmaps</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {assessmentAttemptCount === 0 && stageAttemptCount === 0 && (
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
              <AlertDescription className="text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> This student has no assessment or stage
                attempts yet. Only their account information will be archived.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-lg border">
            <p className="text-sm font-medium mb-2">
              What happens when archiving:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Student will no longer appear in active lists</li>
              <li>• All data is preserved and can be restored later</li>
              <li>• Student cannot log in while archived</li>
              <li>• Can be restored from the archive section</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Archive Student
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
