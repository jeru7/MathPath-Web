import { useRef, useState, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { FaImage, FaUpload } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAssessmentBuilder } from "../../../context/assessment-builder.context";
import { AssessmentContent } from "../../../../../../../core/types/assessment/assessment.type";
import { uploadImage } from "../../../../../../../core/utils/cloudinary/cloudinary.util";

type AddImageModalProps = {
  onClose: () => void;
  pageId: string;
  contentToEdit: AssessmentContent | null;
  open: boolean;
};

export default function AddImageModal({
  onClose,
  pageId,
  contentToEdit,
  open,
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[100dvw] h-[100dvh] max-w-none sm:max-w-lg sm:max-h-[90vh] sm:h-fit overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl">
              {contentToEdit ? "Edit Image" : "Add Image"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            Upload an image for your assessment. Maximum file size: 200KB
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col">
          <div className="flex flex-col gap-4 flex-1">
            <div className="space-y-2 flex-1 flex flex-col">
              <Label htmlFor="image-upload" className="text-sm font-medium">
                Upload Image
              </Label>
              <Card
                className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-colors bg-muted/20 flex-1"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleUploadClick}
              >
                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-3 flex-1 justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-[40dvh] sm:max-h-48 object-contain rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <FaUpload className="w-3 h-3" />
                        Click or drag to replace image
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 flex-1 justify-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center">
                        <FaImage className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Drag and drop or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG up to 200KB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </CardContent>
              </Card>
            </div>

            <AnimatePresence>
              {isValidated && isEmpty && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>
                      Please select an image to continue.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-muted/30 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 order-2 sm:order-1"
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddImage}
            disabled={isUploading}
            className="flex-1 order-1 sm:order-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : contentToEdit ? (
              "Update Image"
            ) : (
              "Add Image"
            )}
          </Button>
        </div>
      </DialogContent>

      {isUploading &&
        createPortal(
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-lg border shadow-sm">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Uploading image...</p>
            </div>
          </div>,
          document.body,
        )}
    </Dialog>
  );
}
