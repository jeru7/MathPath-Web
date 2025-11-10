import { ReactElement } from "react";
import { IoWarning, IoDocument } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ExitBuilderConfirmationModalProps = {
  isOpen: boolean;
  onSaveAndExit: () => void;
  onExitWithoutSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  changesCount?: number;
};

export default function ExitBuilderConfirmationModal({
  isOpen,
  onSaveAndExit,
  onExitWithoutSave,
  onCancel,
  isSaving,
  changesCount = 0,
}: ExitBuilderConfirmationModalProps): ReactElement {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="w-[95vw] max-w-md p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <IoWarning className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <DialogTitle className="text-lg font-semibold">
                Unsaved Changes
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-sm">
            You have unsaved changes in your assessment
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            What would you like to do with your changes?
          </p>

          {/* changes summary */}
          {changesCount > 0 && (
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
              <AlertDescription className="text-blue-800 dark:text-blue-300">
                <div className="flex items-center gap-2">
                  <IoDocument className="w-4 h-4" />
                  <span>
                    <strong>
                      {changesCount} change{changesCount !== 1 ? "s" : ""}
                    </strong>{" "}
                    will be lost if you don't save
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* buttons */}
          <div className="space-y-3">
            {/* save & exit button */}
            <Button
              onClick={onSaveAndExit}
              disabled={isSaving}
              className="w-full gap-2 text-background bg-green-500 dark:bg-green-600 hover:bg-green-600/80"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>Save and Exit</>
              )}
            </Button>

            {/* exit without saving button */}
            <Button
              onClick={onExitWithoutSave}
              className="w-full bg-red-500 text-foreground  hover:bg-red-600/80"
            >
              Exit Without Saving
            </Button>

            {/* continue editing button */}
            <Button
              onClick={onCancel}
              className="w-full bg-background border border-foreground text-foreground hover:bg-foreground/10"
            >
              Continue Editing
            </Button>
          </div>

          {/* help text */}
          <Card className="bg-muted/50 border-0">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="font-semibold">Save and Exit:</span>
                <span>Save all changes and return to assessments</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="font-semibold">Exit without saving:</span>
                <span>Discard all changes made</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="font-semibold">Continue Editing:</span>
                <span>Return to assessment builder</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
