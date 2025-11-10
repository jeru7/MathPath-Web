import { type ReactElement, useState } from "react";
import { Section } from "../../../types/section/section.type";
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

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  section: Section | null;
  studentCount: number;
  assessmentCount?: number;
  isDeleting?: boolean;
};

export default function DeleteSectionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  section,
  studentCount,
  assessmentCount = 0,
  isDeleting = false,
}: DeleteConfirmationModalProps): ReactElement {
  const [confirmationText, setConfirmationText] = useState("");

  const sectionName = section?.name || "";
  const isConfirmed = confirmationText === sectionName;

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

  const hasStudents = studentCount > 0;
  const hasAssessments = assessmentCount > 0;

  if (!section) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Delete Section</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            section and remove all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg border">
            <p className="text-sm font-medium">
              Please type <strong>"{sectionName}"</strong> to confirm:
            </p>
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Enter "${sectionName}"`}
              className="mt-2"
            />
          </div>

          {(hasStudents || hasAssessments) && (
            <Alert variant="destructive">
              <AlertDescription>
                <div className="font-medium mb-2">
                  This will permanently delete:
                </div>
                <ul className="text-sm space-y-1">
                  {hasStudents && (
                    <>
                      <li>
                        •{" "}
                        <strong>
                          {studentCount} student{studentCount !== 1 ? "s" : ""}
                        </strong>{" "}
                        and all their data
                      </li>
                      <li>• All student assessment attempts and scores</li>
                      <li>• All student stage attempts and progress</li>
                      <li>• All student learning data and analytics</li>
                      <li>• Student accounts and login credentials</li>
                      <li>• All student session history and activity logs</li>
                    </>
                  )}
                  {hasAssessments && (
                    <li>
                      •{" "}
                      <strong>
                        {assessmentCount} assessment
                        {assessmentCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      that are exclusively assigned to this section
                    </li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {!hasStudents && !hasAssessments && (
            <Alert>
              <AlertDescription>
                <strong>Note:</strong> This section has no students and no
                exclusive assessments. Only the section information and settings
                will be deleted.
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertDescription>
              <strong>Warning:</strong> This action is irreversible. All data
              associated with this section will be permanently removed from the
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
            {isDeleting ? "Deleting..." : "Delete Section"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
