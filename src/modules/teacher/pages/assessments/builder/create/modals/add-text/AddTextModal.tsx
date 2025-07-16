import { useState, type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import RichTextField from "../../RichTextField";
import ModalActions from "../ModalActions";
import { toast } from "react-toastify";

type AddTextModalProps = {
  onClose: () => void;
  onAddText: (pageId: string, text: string) => void;
  pageId: string;
};

export default function AddTextModal({
  onClose,
  onAddText,
  pageId,
}: AddTextModalProps): ReactElement {
  const [textContent, setTextContent] = useState<string>("");

  const handleTextContentChange = (text: string) => {
    setTextContent(text);
  };

  const handleAddText = () => {
    if (textContent.length === 0 || textContent === "") {
      toast.error("Please provide text content.");
      return;
    }

    onAddText(pageId, textContent);
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
            <RichTextField onContentChange={handleTextContentChange} />
          </div>
        </div>
        {/* actions */}
        <ModalActions onAddContent={handleAddText} onCancelClick={onClose} />
      </section>
    </motion.article>
  );
}
