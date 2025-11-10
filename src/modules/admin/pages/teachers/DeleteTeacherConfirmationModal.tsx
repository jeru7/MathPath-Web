import { type ReactElement, useState } from "react";
import { Teacher } from "../../../teacher/types/teacher.type";
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

type DeleteTeacherConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teacher: Teacher | null;
  sectionsCount: number;
  assessmentsCount: number;
  studentsCount: number;
  isDeleting?: boolean;
};

export default function DeleteTeacherConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  teacher,
  sectionsCount,
  assessmentsCount,
  studentsCount,
  isDeleting = false,
}: DeleteTeacherConfirmationModalProps): ReactElement {
  const [confirmationText, setConfirmationText] = useState("");

  const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : "";
  const isConfirmed = confirmationText === teacherName;

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

  const hasRelatedData =
    sectionsCount > 0 || assessmentsCount > 0 || studentsCount > 0;

  if (!teacher) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Delete Teacher</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            teacher and remove all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg border">
            <p className="text-sm font-medium">
              Please type <strong>"{teacherName}"</strong> to confirm:
            </p>
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Enter "${teacherName}"`}
              className="mt-2"
            />
          </div>

          {hasRelatedData && (
            <Alert variant="destructive">
              <AlertDescription>
                <div className="font-medium mb-2">
                  This will permanently delete:
                </div>
                <ul className="text-sm space-y-1">
                  {sectionsCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {sectionsCount} section{sectionsCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      and all associated data
                    </li>
                  )}
                  {assessmentsCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {assessmentsCount} assessment
                        {assessmentsCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      and all attempt records
                    </li>
                  )}
                  {studentsCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {studentsCount} student{studentsCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      and all their progress data
                    </li>
                  )}
                  <li>• All registration codes created by this teacher</li>
                  <li>• Teacher's account access and login credentials</li>
                  <li>• All related requests and session data</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {!hasRelatedData && (
            <Alert>
              <AlertDescription>
                <strong>Note:</strong> This teacher has no sections,
                assessments, or students yet. Only their account information
                will be deleted.
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertDescription>
              <strong>Warning:</strong> This action is irreversible. All data
              associated with this teacher will be permanently removed from the
              system.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Teacher"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
