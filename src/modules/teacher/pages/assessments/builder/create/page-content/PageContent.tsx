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

type PageContentProps = {
  contents: AssessmentContent[];
  questionNumber: number;
  pageId: string;
  onEditContent?: (content: AssessmentContent, type: ModalType) => void;
};

export default function PageContent({
  contents,
  questionNumber,
  pageId,
  onEditContent,
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
    dispatch({
      type: "UPDATE_PAGE_CONTENT",
      payload: { pageId, contents: newContents },
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    document.body.getBoundingClientRect();
    setActiveId(event.active.id);
  };

  const getTaskPos = (id: number | string) => {
    return contents.findIndex((choice) => id === choice.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id === over?.id || !over) return;

    const originalPos = getTaskPos(active.id);
    const newPos = getTaskPos(over.id);

    handleContentChanges(pageId, arrayMove(contents, originalPos, newPos));
  };

  const handleDeleteContent = (content: AssessmentContent) => {
    dispatch({ type: "DELETE_CONTENT", payload: { pageId, content } });
  };

  return (
    <section className="flex flex-col gap-8 overflow-hidden ">
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
                  onEdit={() => onEditContent?.(content, content.type)}
                />
              );
            } else if (content.type === "image") {
              return (
                <Image
                  key={content.id}
                  content={content}
                  onDeleteContent={handleDeleteContent}
                  onEdit={() => onEditContent?.(content, content.type)}
                />
              );
            } else if (content.type === "text") {
              return (
                <Text
                  key={content.id}
                  content={content}
                  onDeleteContent={handleDeleteContent}
                  onEdit={() => onEditContent?.(content, content.type)}
                />
              );
            }
          })}
        </SortableContext>

        {/* dummy for floating draggable */}
        {createPortal(
          <DragOverlay>
            {activeId
              ? (() => {
                  const activeContent = contents.find(
                    (content) => content.id === activeId,
                  );
                  if (!activeContent) return null;

                  if (activeContent.type === "question") {
                    return (
                      <div className="rounded scale-105 bg-white p-2 border border-gray-300">
                        <Question
                          content={activeContent}
                          questionNumber={0}
                          activeId={activeId}
                          onDeleteContent={handleDeleteContent}
                          onEdit={() => onEditContent}
                        />
                      </div>
                    );
                  } else if (activeContent.type === "image") {
                    return (
                      <div className="rounded scale-105 bg-white p-2 border border-gray-300">
                        <Image
                          content={activeContent}
                          onDeleteContent={handleDeleteContent}
                          onEdit={() => onEditContent}
                        />
                      </div>
                    );
                  } else if (activeContent.type === "text") {
                    return (
                      <div className="rounded scale-105 bg-white p-2 border border-gray-300">
                        <Text
                          content={activeContent}
                          onDeleteContent={handleDeleteContent}
                          onEdit={() => onEditContent}
                        />
                      </div>
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
