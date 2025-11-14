import { ReactElement } from "react";
import { IoWarning, IoClose } from "react-icons/io5";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ModalOverlay from "@/modules/core/components/modal/ModalOverlay";
import { Badge } from "lucide-react";

type UnansweredQuestionsModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  unansweredCount: number;
  totalQuestions: number;
};

export default function UnansweredQuestionsModal({
  isOpen,
  onConfirm,
  onCancel,
  unansweredCount,
  totalQuestions,
}: UnansweredQuestionsModalProps): ReactElement {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onCancel}>
      <Card className="bg-background rounded-lg shadow-xl w-full max-w-md">
        {/* header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Badge className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <IoWarning className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </Badge>
            <h3 className="text-lg font-semibold">Unanswered Questions</h3>
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
          <div className="mb-4">
            <p className="text-muted-foreground mb-2">
              You have <strong>{unansweredCount}</strong> unanswered question
              {unansweredCount > 1 ? "s" : ""} out of {totalQuestions} total
              questions.
            </p>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to submit your assessment? You won't be able
              to change your answers after submission.
            </p>
          </div>

          {/* progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4 dark:bg-gray-700">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((totalQuestions - unansweredCount) / totalQuestions) * 100}%`,
              }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground mb-6">
            <span>
              Answered: {totalQuestions - unansweredCount}/{totalQuestions}
            </span>
            <span>
              Unanswered: {unansweredCount}/{totalQuestions}
            </span>
          </div>

          {/* buttons */}
          <div className="flex flex-col space-y-3">
            <Button
              onClick={onConfirm}
              variant="default"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Submit Anyway
            </Button>
          </div>

          {/* help text */}
          <div className="mt-4 text-xs text-muted-foreground">
            <p>• Click "Submit Anyway" to submit with unanswered questions</p>
          </div>
        </CardContent>
      </Card>
    </ModalOverlay>
  );
}
