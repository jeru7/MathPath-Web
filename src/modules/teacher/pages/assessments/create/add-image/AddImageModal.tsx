import { useRef, useState, type ReactElement } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import ModalActions from "../components/actions/ModalActions";
import { toast } from "react-toastify";

type AddImageModalProps = {
  onClose: () => void;
  onAddImage: (pageId: string, imageUrl: string) => void;
  pageId: string;
};
export default function AddImageModal({
  onClose,
  onAddImage,
  pageId,
}: AddImageModalProps): ReactElement {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type.");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type.");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddImage = () => {
    if (!previewUrl) {
      toast.error("There are no image yet.");
      return;
    }

    onAddImage(pageId, previewUrl);
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

      <section className="flex flex-col h-full bg-inherit rounded-b-sm p-4 min-h-[400px] gap-4">
        <div className="flex flex-col flex-1 gap-4 h-full">
          {/* drag-drop area */}
          <div
            className="flex-1 border border-dashed border-gray-400 rounded p-6 flex flex-col items-center justify-center gap-3 text-center text-gray-500 hover:cursor-pointer"
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

        {/* actions */}
        <ModalActions onAddContent={handleAddImage} onCancelClick={onClose} />
      </section>
    </motion.article>
  );
}
