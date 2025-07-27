import { useState, type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import RichTextField from "../../RichTextField";
import ModalActions from "../ModalActions";
import { useAssessmentBuilder } from "../../../context/assessment-builder.context";
import { AssessmentContent } from "../../../../../../../core/types/assessment/assessment.type";

type AddTextModalProps = {
  onClose: () => void;
  pageId: string;
  contentToEdit: AssessmentContent | null;
};

export default function AddTextModal({
  onClose,
  pageId,
  contentToEdit,
}: AddTextModalProps): ReactElement {
  const { dispatch } = useAssessmentBuilder();
  const [textContent, setTextContent] = useState<string>("");
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const handleTextContentChange = (text: string) => {
    setTextContent(text);
    if (text.trim().length > 0) setIsEmpty(false);
  };

  const handleAddText = () => {
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
    <motion.article
      className="w-[800px] h-fit rounded-sm drop-shadow-sm top-1/2 -translate-y-[60%] left-1/2 right-1/2 -translate-x-1/2 absolute bg-white"
      key="add-text-modal"
      initial={{ opacity: 0, scale: 1, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1, y: 50 }}
      transition={{ duration: 0.25 }}
    >
      <header className="p-4 bg-white rounded-t-sm flex items-center justify-between border-b border-b-gray-300">
        <h3>New Text</h3>
        {/* close button */}
        <button
          className="opacity-80 hover:opacity-100 hover:cursor-pointer transition-all duration-200"
          type="button"
          onClick={onClose}
        >
          <IoClose />
        </button>
      </header>
      <section className="flex flex-col gap-4 h-full bg-inherit rounded-b-sm p-4">
        <div className="flex gap-4">
          {/* label */}
          <label
            htmlFor="question"
            className="font-semibold w-32 min-w-32 text-right"
          >
            Text
          </label>
          {/* text editor */}
          <div className="flex flex-col w-full gap-2">
            <RichTextField
              value={
                contentToEdit ? (contentToEdit.data as string) : textContent
              }
              onContentChange={handleTextContentChange}
            />
            <AnimatePresence>
              {isEmpty && (
                <motion.p
                  key="error-empty"
                  className="text-sm text-red-500 self-end"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5, transition: { duration: 0.1 } }}
                >
                  Text is required.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* actions */}
        <ModalActions onAddContent={handleAddText} onCancelClick={onClose} />
      </section>
    </motion.article>
  );
}
