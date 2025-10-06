import { useRef, useState, type ReactElement } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import ModalActions from "../ModalActions";
import { toast } from "react-toastify";
import { useAssessmentBuilder } from "../../../context/assessment-builder.context";
import { AssessmentContent } from "../../../../../../../core/types/assessment/assessment.type";
import { createPortal } from "react-dom";
import { uploadImage } from "../../../../../../../core/utils/cloudinary/cloudinary.util";

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
  const { dispatch } = useAssessmentBuilder();

  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleAddImage = async () => {
    setIsValidated(true);

    if (!previewUrl) {
      setIsEmpty(true);
      return;
    }

    try {
      setIsUploading(true);

      let imageUrl = previewUrl;
      let publicId = null;

      if (fileRef.current) {
        const { secureUrl, publicId: pid } = await uploadImage(fileRef.current);
        imageUrl = secureUrl;
        publicId = pid;
      }

      if (contentToEdit) {
        dispatch({
          type: "UPDATE_IMAGE",
          payload: {
            pageId,
            contentId: contentToEdit.id,
            imageUrl,
            publicId,
          },
        });
      } else {
        dispatch({
          type: "ADD_IMAGE",
          payload: {
            pageId,
            imageUrl,
            publicId,
          },
        });
      }

      onClose();
    } catch (error) {
      toast.error("Failed to upload image.");
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.article
      className="h-full min-h-[100vh] w-full flex flex-col fixed md:w-[800px] md:h-fit md:min-h-0 md:rounded-sm md:drop-shadow-sm md:top-1/2 md:-translate-y-[60%] md:left-1/2 md:right-1/2 md:-translate-x-1/2 md:absolute bg-white dark:bg-gray-800 transition-colors duration-200"
      key="add-image-modal"
      initial={{ opacity: 0, scale: 1, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1, y: 50 }}
      transition={{ duration: 0.25 }}
    >
      <header className="p-4 bg-white dark:bg-gray-800 rounded-t-sm flex items-center justify-between border-b border-b-gray-300 dark:border-b-gray-600 transition-colors duration-200">
        <h3 className="text-gray-900 dark:text-gray-100 transition-colors duration-200">
          New Image
        </h3>
        <button
          className="hidden md:block opacity-80 hover:opacity-100 hover:cursor-pointer transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          type="button"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>
      </header>

      <section className="flex flex-col flex-1 bg-inherit rounded-b-sm p-4 min-h-[400px] gap-4">
        <div className="flex flex-col flex-1 gap-4 h-full">
          {/* drag-drop area */}
          <div
            className="h-[400px] border border-dashed border-gray-400 dark:border-gray-500 rounded p-6 flex flex-col items-center justify-center gap-3 text-center text-gray-500 dark:text-gray-400 hover:cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
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
                <p className="text-sm text-gray-400 dark:text-gray-500 transition-colors duration-200">
                  Click again to reupload
                </p>
              </article>
            ) : (
              <article>
                <p className="hidden md:block font-medium">
                  Drop an image here
                </p>
                <p className="hidden md:block text-sm text-gray-400 dark:text-gray-500 transition-colors duration-200">
                  or click to upload
                </p>
                <p className="md:hidden font-medium">Click to upload</p>
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
        {isValidated && isEmpty && (
          <motion.p
            className="text-sm text-red-500 dark:text-red-400 self-center transition-colors duration-200"
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

      {isUploading &&
        createPortal(
          <div className="fixed h-screen w-screen bg-black/20 dark:bg-black/40 z-50 top-0 left-0 transition-colors duration-200"></div>,
          document.body,
        )}
    </motion.article>
  );
}
