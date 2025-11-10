import { type ReactElement, useState } from "react";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

type DraftDecisionModalProps = {
  isOpen: boolean;
  draft: Assessment | null;
  onContinue: () => void;
  onCreateNew: () => void;
  onClose: () => void;
};

export default function DraftDecisionModal({
  isOpen,
  draft,
  onContinue,
  onCreateNew,
  onClose,
}: DraftDecisionModalProps): ReactElement {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const calculateProgress = (assessment: Assessment): number => {
    let progress = 0;
    const totalWeight = 100;

    // basic information (30%)
    const hasBasicInfo =
      assessment.title && assessment.topic && assessment.description;
    if (hasBasicInfo) progress += 30;

    // content & questions (50%)
    let contentProgress = 0;

    if (assessment.pages && assessment.pages.length > 0) {
      const pagesWithContent = assessment.pages.filter(
        (page) => page.contents && page.contents.length > 0,
      );

      if (pagesWithContent.length > 0) {
        const hasQuestions = assessment.pages.some((page) =>
          page.contents.some((content) => content.type === "question"),
        );

        if (hasQuestions) {
          contentProgress = 50; // full points if there are questions
        } else {
          contentProgress = 25; // half points if there's content but no questions
        }
      }
    }

    progress += contentProgress;

    // settings & configuration (20%)
    const hasSettings =
      assessment.passingScore > 0 &&
      assessment.timeLimit > 0 &&
      assessment.attemptLimit > 0;
    if (hasSettings) progress += 20;

    return Math.min(progress, totalWeight);
  };

  const getProgressMessage = (progress: number): string => {
    if (progress < 20) return "Just started";
    if (progress < 40) return "Getting there";
    if (progress < 60) return "Halfway done";
    if (progress < 80) return "Almost there";
    return "Ready to publish";
  };

  const handleCreateNewClick = () => {
    setShowDeleteWarning(true);
  };

  const handleConfirmCreateNew = () => {
    setShowDeleteWarning(false);
    onCreateNew();
  };

  const handleCancelCreateNew = () => {
    setShowDeleteWarning(false);
  };

  if (!draft) return <></>;

  const progress = calculateProgress(draft);
  const progressMessage = getProgressMessage(progress);

  return (
    <>
      <Dialog open={isOpen && !showDeleteWarning} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-md p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" />
              <DialogTitle className="text-lg font-semibold">
                Assessment in Progress
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm">
              You have an unsaved draft assessment
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <Card className="bg-muted/50 border-muted">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <p className="font-medium text-foreground text-sm line-clamp-2 flex-1">
                    {draft.title || "Untitled Assessment"}
                  </p>
                  <Badge className="flex-shrink-0 bg-yellow-400 dark:bg-yellow-500 text-background">
                    Draft
                  </Badge>
                </div>

                {draft.topic && (
                  <p className="text-xs text-muted-foreground">
                    Topic: {draft.topic}
                  </p>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {progress}%
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {progressMessage}
                      </span>
                    </div>
                  </div>

                  <Progress value={progress} className="h-2" />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {draft.pages?.length || 0} page
                      {(draft.pages?.length || 0) !== 1 ? "s" : ""}
                    </span>
                    <span>
                      Last updated:{" "}
                      {draft.updatedAt
                        ? new Date(draft.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertDescription className="text-amber-800 dark:text-amber-300 text-sm">
                You can continue editing it or start a new assessment{" "}
                <strong>(this will delete your current draft)</strong>.
              </AlertDescription>
            </Alert>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="ghost"
                onClick={onClose}
                className="flex-1 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={handleCreateNewClick}
                className="flex-1 order-1 sm:order-2 border-red-300 bg-red-500 dark:bg-red-600 dark:border-red-600 text-foreground  hover:bg-red-500/80 dark:hover:bg-red-600/80"
              >
                Start New
              </Button>
              <Button onClick={onContinue} className="flex-1 order-3">
                Continue Editing
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteWarning} onOpenChange={handleCancelCreateNew}>
        <DialogContent className="w-[95vw] max-w-md p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
              <DialogTitle className="text-lg font-semibold">
                Delete Draft Assessment?
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm">
              This action cannot be undone
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Starting a new assessment will{" "}
              <strong className="text-red-600 dark:text-red-400">
                permanently delete
              </strong>{" "}
              your current draft:
            </p>

            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
              <CardContent className="p-3">
                <p className="font-medium text-foreground text-sm">
                  {draft.title || "Untitled Assessment"}
                </p>
                {draft.topic && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Topic: {draft.topic}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Progress: {progress}% • {draft.pages?.length || 0} pages
                </p>
              </CardContent>
            </Card>

            <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertDescription className="text-amber-800 dark:text-amber-300 text-xs">
                All progress on this draft will be lost and cannot be recovered.
              </AlertDescription>
            </Alert>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="ghost"
                onClick={handleCancelCreateNew}
                className="flex-1 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmCreateNew}
                className="flex-1 order-1 sm:order-2"
              >
                Delete Draft & Create New
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
