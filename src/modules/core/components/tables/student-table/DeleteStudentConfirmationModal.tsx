import { type ReactElement, useState } from "react";
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
import { Input } from "@/components/ui/input";

type DeleteStudentConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  student: Student | null;
};

export default function DeleteStudentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  student,
}: DeleteStudentConfirmationModalProps): ReactElement {
  const { data: stageAttempts } = useStudentAttempts(student?.id || "");
  const { data: assessmentAttempts } = useAssessmentsAttempts(
    student?.id || "",
  );
  const [confirmationText, setConfirmationText] = useState("");

  const stageAttemptCount = stageAttempts?.length || 0;
  const assessmentAttemptCount = assessmentAttempts?.length || 0;
  const studentLRN = student?.referenceNumber;

  const isConfirmed = confirmationText === studentLRN;

  const handleClose = () => {
    setConfirmationText("");
    onClose();
  };

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      setConfirmationText("");
    }
  };

  if (!student) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Delete Student</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            student account and remove all associated data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg border">
            <p className="text-sm font-medium">
              Please type <strong>{studentLRN}</strong> to confirm:
            </p>
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Enter ${studentLRN}`}
              className="mt-2"
            />
          </div>

          {(assessmentAttemptCount > 0 || stageAttemptCount > 0) && (
            <Alert variant="destructive">
              <AlertDescription>
                <div className="font-medium mb-2">
                  This will permanently delete:
                </div>
                <ul className="text-sm space-y-1">
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
                  <li>• All learning progress and data</li>
                  <li>• Account access and login credentials</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {assessmentAttemptCount === 0 && stageAttemptCount === 0 && (
            <Alert>
              <AlertDescription>
                <strong>Note:</strong> This student has no assessment or stage
                attempts yet. Only their account information will be deleted.
              </AlertDescription>
            </Alert>
          )}
          <Alert>
            <AlertDescription>
              <strong>Warning:</strong> This action is irreversible. All data
              associated with this student will be permanently removed from the
              system.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed}
          >
            Delete Student
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
