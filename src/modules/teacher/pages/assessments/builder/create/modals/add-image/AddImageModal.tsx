import { useRef, useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import ModalActions from "../ModalActions";
import { toast } from "react-toastify";
import { useAssessmentBuilder } from "../../../context/assessment-builder.context";
import { AssessmentContent } from "../../../../../../../core/types/assessment/assessment.type";

type AddImageModalProps = {
  onClose: () => void;
  pageId: string;
  contentToEdit: AssessmentContent | null;
};
export default function AddImageModal({
  onClose,
  pageId,
  contentToEdit,
}: AddImageModalProps): ReactElement {
  // reducers
  const { state: assessment, dispatch } = useAssessmentBuilder();

  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const MAX_FILE_SIZE = 200 * 1024; // 200kb

  // ref
  const fileRef = useRef<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // value watcher
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    (contentToEdit?.data as string) ?? null,
  );

  // handlers
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Image must be less than 200kb.", {
          position: "top-center",
        });
        return;
      }
      fileRef.current = file;
      setPreviewUrl(URL.createObjectURL(file));
      setIsEmpty(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      fileRef.current = file;
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddImage = () => {
    setIsValidated(true);

    if (!previewUrl) {
      setIsEmpty(true);
      return;
    }

    if (contentToEdit) {
      dispatch({
        type: "UPDATE_IMAGE",
        payload: {
          pageId,
          contentId: contentToEdit.id,
          imageUrl: previewUrl,
        },
      });
    } else {
      dispatch({
        type: "ADD_IMAGE",
        payload: { pageId, imageUrl: previewUrl },
      });
    }

    onClose();
  };

  return (
    <motion.article
      className="w-[800px] h-fit rounded-sm drop-shadow-sm top-1/2 -translate-y-[60%] left-1/2 right-1/2 -translate-x-1/2 absolute bg-white"
      key="add-image-modal"
      initial={{ opacity: 0, scale: 1, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1, y: 50 }}
      transition={{ duration: 0.25 }}
    >
      <header className="p-4 bg-white rounded-t-sm flex items-center justify-between border-b border-b-gray-300">
        <h3>New Image</h3>
        <button
          className="opacity-80 hover:opacity-100 hover:cursor-pointer transition-all duration-200"
          type="button"
          onClick={onClose}
        >
          <IoClose />
        </button>
      </header>

      <section className="flex flex-col h-fit bg-inherit rounded-b-sm p-4 min-h-[400px] gap-4">
        <div className="flex flex-col flex-1 gap-4 h-full">
          {/* drag-drop area */}
          <div
            className="h-[400px] border border-dashed border-gray-400 rounded p-6 flex flex-col items-center justify-center gap-3 text-center text-gray-500 hover:cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleUploadClick}
          >
            {previewUrl ? (
              <article className="flex flex-col gap-4">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="max-w-xs max-h-64 object-contain"
                />
                <p className="text-sm text-gray-400">Click again to reupload</p>
              </article>
            ) : (
              <article>
                <p className="font-medium">Drop an image here</p>
                <p className="text-sm text-gray-400">or click to upload</p>
              </article>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <AnimatePresence></AnimatePresence>
        {isValidated && isEmpty && (
          <motion.p
            className="text-sm text-red-500 self-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5, transition: { duration: 0.1 } }}
          >
            Image cannot be empty.
          </motion.p>
        )}
        {/* actions */}
        <ModalActions onAddContent={handleAddImage} onCancelClick={onClose} />
      </section>
    </motion.article>
  );
}
