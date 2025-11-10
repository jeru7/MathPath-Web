import { useState, type ReactElement } from "react";
import { AssessmentContent } from "../../../../../../core/types/assessment/assessment.type";
import Question from "./Question";
import Image from "./Image";
import Text from "./Text";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
  closestCorners,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { useAssessmentBuilder } from "../../context/assessment-builder.context";
import { ModalType } from "../modals/Modals";
import { deleteImage } from "../../../../../../core/utils/cloudinary/cloudinary.util";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";

type PageContentProps = {
  contents: AssessmentContent[];
  questionNumber: number;
  pageId: string;
  onEditContent?: (content: AssessmentContent, type: ModalType) => void;
  isEditMode?: boolean;
};

export default function PageContent({
  contents,
  questionNumber,
  pageId,
  onEditContent,
  isEditMode = false,
}: PageContentProps): ReactElement {
  // reducer
  const { dispatch } = useAssessmentBuilder();
  // states
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // handlers
  const handleContentChanges = (
    pageId: string,
    newContents: AssessmentContent[],
  ) => {
    if (isEditMode) return;

    dispatch({
      type: "UPDATE_PAGE_CONTENT",
      payload: { pageId, contents: newContents },
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (isEditMode) return;
    document.body.getBoundingClientRect();
    setActiveId(event.active.id);
  };

  const getTaskPos = (id: number | string) => {
    return contents.findIndex((choice) => id === choice.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (isEditMode) return;
    const { active, over } = event;
    if (active.id === over?.id || !over) return;

    const originalPos = getTaskPos(active.id);
    const newPos = getTaskPos(over.id);

    handleContentChanges(pageId, arrayMove(contents, originalPos, newPos));
  };

  const handleDeleteContent = async (content: AssessmentContent) => {
    if (isEditMode) return;

    if (content.type === "image") {
      try {
        await deleteImage(content.data.publicId);
      } catch {
        toast.error("Failed to delete image.");
        return;
      }
    }
    dispatch({ type: "DELETE_CONTENT", payload: { pageId, content } });
  };

  const handleEditContent = (content: AssessmentContent, type: ModalType) => {
    if (isEditMode) return;
    onEditContent?.(content, type);
  };

  return (
    <section className="flex flex-col gap-4 sm:gap-6 overflow-hidden">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <SortableContext
          items={contents}
          strategy={verticalListSortingStrategy}
        >
          {/* content list items */}
          {contents.map((content) => {
            if (content.type === "question") {
              const currentQuestionNumber = questionNumber;
              questionNumber++;

              return (
                <Question
                  key={content.id}
                  content={content}
                  questionNumber={currentQuestionNumber}
                  activeId={activeId}
                  onDeleteContent={handleDeleteContent}
                  onEdit={() => handleEditContent(content, content.type)}
                  isEditMode={isEditMode}
                />
              );
            } else if (content.type === "image") {
              return (
                <Image
                  key={content.id}
                  content={content}
                  onDeleteContent={handleDeleteContent}
                  onEdit={() => handleEditContent(content, content.type)}
                  isEditMode={isEditMode}
                />
              );
            } else if (content.type === "text") {
              return (
                <Text
                  key={content.id}
                  content={content}
                  onDeleteContent={handleDeleteContent}
                  onEdit={() => handleEditContent(content, content.type)}
                  isEditMode={isEditMode}
                />
              );
            }
          })}
        </SortableContext>

        {/* dummy for floating draggable - only show when not in edit mode */}
        {!isEditMode &&
          createPortal(
            <DragOverlay>
              {activeId
                ? (() => {
                  const activeContent = contents.find(
                    (content) => content.id === activeId,
                  );
                  if (!activeContent) return null;

                  if (activeContent.type === "question") {
                    return (
                      <Card className="scale-105 shadow-lg border-primary/50 bg-card">
                        <Question
                          content={activeContent}
                          questionNumber={0}
                          activeId={activeId}
                          onDeleteContent={handleDeleteContent}
                          onEdit={() => onEditContent}
                          isEditMode={isEditMode}
                        />
                      </Card>
                    );
                  } else if (activeContent.type === "image") {
                    return (
                      <Card className="scale-105 shadow-lg border-primary/50 bg-card">
                        <Image
                          content={activeContent}
                          onDeleteContent={handleDeleteContent}
                          onEdit={() => onEditContent}
                          isEditMode={isEditMode}
                        />
                      </Card>
                    );
                  } else if (activeContent.type === "text") {
                    return (
                      <Card className="scale-105 shadow-lg border-primary/50 bg-card">
                        <Text
                          content={activeContent}
                          onDeleteContent={handleDeleteContent}
                          onEdit={() => onEditContent}
                          isEditMode={isEditMode}
                        />
                      </Card>
                    );
                  }

                  return null;
                })()
                : null}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </section>
  );
}
