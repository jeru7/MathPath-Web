import { type ReactElement, useState } from "react";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
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

type DeleteAssessmentConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assessment: Assessment | null;
  studentCount: number;
  sectionCount: number;
};

export default function DeleteAssessmentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  assessment,
  studentCount,
  sectionCount,
}: DeleteAssessmentConfirmationModalProps): ReactElement {
  const [confirmationText, setConfirmationText] = useState("");

  const assessmentTitle =
    assessment?.title && assessment.title.length > 0
      ? assessment.title
      : "Untitled Assessment";

  const isConfirmed = confirmationText === assessmentTitle;

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

  const getWarningTitle = () => {
    if (!assessment) return "Delete Assessment";

    switch (assessment.status) {
      case "published":
        return "Delete Published Assessment";
      case "in-progress":
        return "Delete In-Progress Assessment";
      case "finished":
        return "Delete Finished Assessment";
      default:
        return "Delete Assessment";
    }
  };

  const getStatusWarning = () => {
    if (!assessment) return "This assessment will be permanently deleted.";

    switch (assessment.status) {
      case "published":
        return "This assessment has been published and is currently active.";
      case "in-progress":
        return "This assessment is currently in progress by students.";
      case "finished":
        return "This assessment has been completed by students.";
      default:
        return "This assessment is in draft status.";
    }
  };

  if (!assessment) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {getWarningTitle()}
          </DialogTitle>
          <DialogDescription>
            {getStatusWarning()} This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg border">
            <p className="text-sm font-medium">
              Please type <strong>"{assessmentTitle}"</strong> to confirm:
            </p>
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Enter "${assessmentTitle}"`}
              className="mt-2"
            />
          </div>

          {(studentCount > 0 || sectionCount > 0) && (
            <Alert variant="destructive">
              <AlertDescription>
                <div className="font-medium mb-2">
                  This will permanently delete:
                </div>
                <ul className="text-sm space-y-1">
                  {sectionCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {sectionCount} section{sectionCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      assignments
                    </li>
                  )}
                  {studentCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {studentCount} student{studentCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      progress and attempts
                    </li>
                  )}
                  {assessment.status === "in-progress" && studentCount > 0 && (
                    <li>• All ongoing assessment attempts</li>
                  )}
                  {assessment.status === "finished" && studentCount > 0 && (
                    <li>• All assessment results and grades</li>
                  )}
                  <li>• The assessment and all its content</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {studentCount === 0 && sectionCount === 0 && (
            <Alert>
              <AlertDescription>
                <strong>Note:</strong> This assessment is not assigned to any
                sections yet. Only the assessment content will be deleted.
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
            Delete Assessment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
