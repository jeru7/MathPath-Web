import { useState, type ReactElement, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RichTextField from "../../RichTextField";
import { useAssessmentBuilder } from "../../../context/assessment-builder.context";
import { AssessmentContent } from "../../../../../../../core/types/assessment/assessment.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AddTextModalProps = {
  onClose: () => void;
  pageId: string;
  contentToEdit: AssessmentContent | null;
  open: boolean;
};

export default function AddTextModal({
  onClose,
  pageId,
  contentToEdit,
  open,
}: AddTextModalProps): ReactElement {
  const { dispatch } = useAssessmentBuilder();
  const [textContent, setTextContent] = useState<string>("");
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [isValidated, setIsValidated] = useState<boolean>(false);

  // Initialize content when modal opens or contentToEdit changes
  useEffect(() => {
    if (contentToEdit) {
      setTextContent(contentToEdit.data as string);
    } else {
      setTextContent("");
    }
    setIsEmpty(false);
    setIsValidated(false);
  }, [contentToEdit, open]);

  const handleTextContentChange = (text: string) => {
    setTextContent(text);
    if (text.trim().length > 0) {
      setIsEmpty(false);
    }
  };

  const handleAddText = () => {
    setIsValidated(true);

    if (textContent.trim().length === 0) {
      setIsEmpty(true);
      return;
    }

    if (contentToEdit) {
      dispatch({
        type: "UPDATE_TEXT",
        payload: { pageId, contentId: contentToEdit.id, text: textContent },
      });
    } else {
      dispatch({
        type: "ADD_TEXT",
        payload: { pageId, text: textContent },
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[100dvw] h-[100dvh] max-w-none sm:max-w-2xl sm:max-h-[90vh] sm:h-fit overflow-y-auto p-0 flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl">
              {contentToEdit ? "Edit Text" : "Add Text"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            {contentToEdit
              ? "Update your text content"
              : "Add text content to your assessment"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-6 flex-1 overflow-auto">
          <RichTextField
            value={textContent}
            onContentChange={handleTextContentChange}
            classes="h-full min-h-[200px] max-h-none sm:max-h-[300px]"
          />

          <AnimatePresence>
            {isValidated && isEmpty && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-3"
              >
                <Alert variant="destructive">
                  <AlertDescription>Text content is required.</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-muted/30 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button onClick={handleAddText} className="flex-1 order-1 sm:order-2">
            {contentToEdit ? "Update Text" : "Add Text"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
