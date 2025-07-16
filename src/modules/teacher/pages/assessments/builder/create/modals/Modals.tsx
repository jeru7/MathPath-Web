import { AnimatePresence } from "framer-motion";
import { useState, type ReactElement } from "react";
import AddQuestionModal from "./add-question/AddQuestionModal";
import AddImageModal from "./add-image/AddImageModal";
import AddTextModal from "./add-text/AddTextModal";
import { AssessmentQuestion } from "../../../../../../core/types/assessment/assessment.types";

export type ModalType = "question" | "image" | "text";
type ModalsProps = {
  activeModal: ModalType | null;
  onClose: () => void;
  pageId: string;
  onAddQuestion: (pageId: string, newQuestion: AssessmentQuestion) => void;
  onAddText: (pageId: string, newText: string) => void;
  onAddImage: (pageId: string, imageUrl: string) => void;
};
export default function Modals({
  activeModal,
  onClose,
  pageId,
  onAddQuestion,
  onAddText,
  onAddImage,
}: ModalsProps): ReactElement {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleClose = () => setIsVisible(false);

  return (
    <AnimatePresence onExitComplete={onClose}>
      {isVisible && (
        // overlay
        <div className="fixed w-screen h-screen bg-black/20 z-50 top-0 left-0">
          {/* wrapper */}
          <div className="w-full h-full relative">
            {activeModal === "question" ? (
              <AddQuestionModal
                onClose={handleClose}
                onAddQuestion={onAddQuestion}
                pageId={pageId}
              />
            ) : activeModal === "image" ? (
              <AddImageModal
                onClose={handleClose}
                onAddImage={onAddImage}
                pageId={pageId}
              />
            ) : activeModal === "text" ? (
              <AddTextModal
                onClose={handleClose}
                onAddText={onAddText}
                pageId={pageId}
              />
            ) : null}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
