import { useState, type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { MdDragIndicator } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { BsPatchQuestion } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineTextSnippet } from "react-icons/md";
import {
  AssessmentContent,
  AssessmentPage,
} from "../../../../../core/types/assessment/assessment.type";
import PageContent from "./page-content/PageContent";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ModalType } from "./modals/Modals";
import { useAssessmentBuilder } from "../context/assessment-builder.context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PageCardProps = {
  page: AssessmentPage;
  pageNumber: number;
  startingQuestionNumber: number;
  onShowModal: (modal: ModalType) => void;
  onEditContent?: (content: AssessmentContent, type: ModalType) => void;
  onDelete?: (pageId: string) => void;
  isSingle?: boolean;
  hasError?: boolean;
  isEditMode?: boolean;
};

export default function PageCard({
  page,
  pageNumber,
  startingQuestionNumber,
  onShowModal,
  onEditContent,
  onDelete,
  isSingle,
  hasError,
  isEditMode = false,
}: PageCardProps): ReactElement {
  // reducer
  const { dispatch } = useAssessmentBuilder();

  // states
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // dnd methods
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  // handlers
  const handlePageTitleChange = (pageId: string, newTitle: string) => {
    if (isEditMode) return;

    dispatch({
      type: "UPDATE_PAGE_TITLE",
      payload: { pageId, title: newTitle },
    });
  };

  const handleEditClick = () => {
    if (isEditMode) return;
    setIsEdit(!isEdit);
  };

  const handleDeleteClick = () => {
    if (isEditMode) return;
    onDelete?.(page.id);
  };

  const handleAddContent = (modalType: ModalType) => {
    if (isEditMode) return;
    onShowModal(modalType);
  };

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    border: isDragging ? "2px solid hsl(var(--primary))" : "",
    backgroundColor: isDragging ? "hsl(var(--muted))" : "",
  };

  // if in edit mode and dragging is attempted, don't apply drag styles
  const editModeStyle = isEditMode
    ? {
      cursor: "default",
      opacity: 1,
    }
    : {};

  return (
    <Card
      className={cn(
        "w-full max-w-[800px] transition-colors duration-200",
        hasError && "border-destructive",
        isDragging && !isEditMode && "opacity-50",
        isEditMode && "bg-muted/50",
      )}
      ref={setNodeRef}
      style={{ ...style, ...editModeStyle }}
      {...attributes}
    >
      {/* header */}
      <CardHeader
        className={cn(
          "p-3 sm:p-4 bg-primary text-primary-foreground rounded-t-sm",
          isDragging && !isEditMode && "opacity-0",
          isEditMode && "bg-primary/70",
        )}
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {isEdit && !isEditMode ? (
              // title input
              <Input
                type="text"
                value={page.title ?? `Page ${pageNumber}`}
                className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 placeholder:text-primary-foreground/60"
                onChange={(e) => handlePageTitleChange(page.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEdit(false);
                  }
                }}
                onBlur={() => setIsEdit(false)}
                placeholder="Enter page title"
              />
            ) : (
              // title display
              <p
                className={cn(
                  "text-sm sm:text-base font-semibold",
                  pageNumber === 0 && "opacity-0",
                  isEditMode && "opacity-90",
                )}
              >
                {page.title && page.title.trim() !== ""
                  ? page.title
                  : `Page ${pageNumber}`}
              </p>
            )}
          </div>

          {/* control buttons */}
          <div className="flex items-center gap-2">
            {/* edit button */}
            {!isEditMode && (
              <Button
                size="sm"
                onClick={handleEditClick}
                className="h-8 w-8 p-0 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20"
              >
                <TbEdit className="h-4 w-4" />
              </Button>
            )}

            {/* drag handle */}
            {!isEditMode && (
              <div
                className={cn(
                  "h-8 w-8 p-0 flex items-center justify-center text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20 rounded-md cursor-grab",
                  isSingle && "hidden",
                )}
                {...listeners}
              >
                <MdDragIndicator className="h-4 w-4" />
              </div>
            )}

            {/* delete button */}
            {!isEditMode && (
              <Button
                size="sm"
                onClick={handleDeleteClick}
                className={cn(
                  "h-8 w-8 p-0 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20",
                  isSingle && "hidden",
                )}
              >
                <IoClose className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          "p-2 sm:p-4 flex flex-col rounded-b-lg",
          page.contents.length > 0 && "gap-4",
          isDragging && !isEditMode && "opacity-0",
          isEditMode && "bg-muted/30",
        )}
      >
        {/* content list */}
        <PageContent
          contents={page.contents}
          questionNumber={startingQuestionNumber}
          pageId={page.id}
          onEditContent={onEditContent}
          isEditMode={isEditMode}
        />

        {/* add content buttons */}
        {!isEditMode && (
          <section className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddContent("question")}
              className="flex gap-2 items-center"
            >
              <BsPatchQuestion className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Add question</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddContent("image")}
              className="flex gap-2 items-center"
            >
              <CiImageOn className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Add image</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddContent("text")}
              className="flex gap-2 items-center"
            >
              <MdOutlineTextSnippet className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Add text</span>
            </Button>
          </section>
        )}

        {/* edit mode message */}
        {isEditMode && (
          <p className="text-center py-4 italic text-xs text-muted-foreground">
            Content editing is disabled in edit mode
          </p>
        )}
      </CardContent>
    </Card>
  );
}
