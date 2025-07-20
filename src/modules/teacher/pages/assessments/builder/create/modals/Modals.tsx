import { AnimatePresence } from "framer-motion";
import { useState, type ReactElement } from "react";
import AddQuestionModal from "./add-question/AddQuestionModal";
import AddImageModal from "./add-image/AddImageModal";
import AddTextModal from "./add-text/AddTextModal";
import { AssessmentContent } from "../../../../../../core/types/assessment/assessment.type";

export type ModalType = "question" | "image" | "text";
type ModalsProps = {
  activeModal: ModalType | null;
  onClose: () => void;
  pageId: string;
  contentToEdit: AssessmentContent | null;
};
export default function Modals({
  activeModal,
  onClose,
  pageId,
  contentToEdit,
}: ModalsProps): ReactElement {
  // states
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // handlers
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
                pageId={pageId}
                contentToEdit={contentToEdit}
              />
            ) : activeModal === "image" ? (
              <AddImageModal
                onClose={handleClose}
                pageId={pageId}
                contentToEdit={contentToEdit}
              />
            ) : activeModal === "text" ? (
              <AddTextModal
                onClose={handleClose}
                pageId={pageId}
                contentToEdit={contentToEdit}
              />
            ) : null}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
