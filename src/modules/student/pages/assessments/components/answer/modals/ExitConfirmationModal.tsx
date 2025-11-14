import { ReactElement } from "react";
import { IoWarning, IoClose, IoPause } from "react-icons/io5";
import { Button } from "../../../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../../../components/ui/card";
import { Badge } from "../../../../../../../components/ui/badge";
import ModalOverlay from "@/modules/core/components/modal/ModalOverlay";

type ExitConfirmationModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onPause?: () => void;
  onSubmitAndExit?: () => void;
  timeRemaining?: number;
  showPauseOption?: boolean;
};

export default function ExitConfirmationModal({
  isOpen,
  onCancel,
  onPause,
  timeRemaining,
  showPauseOption = false,
  onSubmitAndExit,
}: ExitConfirmationModalProps): ReactElement {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onCancel}>
      <Card className="bg-background rounded-lg shadow-xl w-full max-w-md">
        {/* header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Badge className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <IoWarning className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </Badge>
            <h3 className="text-lg font-semibold">Exit Assessment?</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8"
          >
            <IoClose className="w-4 h-4" />
          </Button>
        </div>

        {/* content */}
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-4">
            What would you like to do with your current progress?
          </p>

          {timeRemaining !== undefined && timeRemaining > 0 && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-4">
              <CardContent className="p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Time remaining:</strong>{" "}
                  {Math.floor(timeRemaining / 60)}:
                  {(timeRemaining % 60).toString().padStart(2, "0")}
                </p>
              </CardContent>
            </Card>
          )}

          {/* buttons */}
          <div className="space-y-3 mt-6">
            {/* pause assessment button */}
            {showPauseOption && onPause && (
              <div
                className="flex items-center justify-center space-x-2 py-3 px-4 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 cursor-pointer"
                onClick={onPause}
              >
                <IoPause className="w-4 h-4" />
                <span className="font-medium">Pause Assessment</span>
              </div>
            )}

            {/* exit & submit button */}
            {onSubmitAndExit && (
              <div
                className="py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 cursor-pointer text-center font-medium"
                onClick={onSubmitAndExit}
              >
                Exit & Submit Final Answers
              </div>
            )}

            {/* continue assessment button */}
            <div
              className="py-2 px-4 border border-border rounded-lg hover:bg-accent transition-colors duration-200 cursor-pointer text-center"
              onClick={onCancel}
            >
              Continue Assessment
            </div>
          </div>

          {/* help text */}
          <div className="mt-4 text-xs text-muted-foreground space-y-1">
            <p>
              • <strong>Exit & Submit:</strong> Submit final answers for grading
            </p>
            <p>
              • <strong>Continue:</strong> Return to assessment
            </p>
          </div>
        </CardContent>
      </Card>
    </ModalOverlay>
  );
}
