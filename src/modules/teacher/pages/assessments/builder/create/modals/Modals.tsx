import { useState, type ReactElement, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // When activeModal changes, open the modal
    if (activeModal) {
      setIsOpen(true);
    }
  }, [activeModal]);

  const handleClose = () => {
    setIsOpen(false);
    // Let the animation complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <>
      {activeModal === "question" && (
        <AddQuestionModal
          open={isOpen}
          onClose={handleClose}
          pageId={pageId}
          contentToEdit={contentToEdit}
        />
      )}
      {activeModal === "image" && (
        <AddImageModal
          open={isOpen}
          onClose={handleClose}
          pageId={pageId}
          contentToEdit={contentToEdit}
        />
      )}
      {activeModal === "text" && (
        <AddTextModal
          open={isOpen}
          onClose={handleClose}
          pageId={pageId}
          contentToEdit={contentToEdit}
        />
      )}
    </>
  );
}
