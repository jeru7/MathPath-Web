import { useState, type ReactElement } from "react";
import { AssessmentContent } from "../../../../../core/types/assessment/assessment.types";
import Question from "./page-content/Question";
import Image from "./page-content/Image";
import Text from "./page-content/Text";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
  closestCorners,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";

type PageContentProps = {
  contents: AssessmentContent[];
  questionNumber: number;
  onContentsChange: (pageId: string, newContents: AssessmentContent[]) => void;
  pageId: string;
};

export default function PageContent({
  contents,
  questionNumber,
  onContentsChange,
  pageId,
}: PageContentProps): ReactElement {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

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

    onContentsChange(pageId, arrayMove(contents, originalPos, newPos));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = getTaskPos(active.id);
    const newIndex = getTaskPos(over.id);

    if (oldIndex !== newIndex) {
      onContentsChange(pageId, arrayMove(contents, oldIndex, newIndex));
    }
  };

  return (
    <section className="flex flex-col gap-8 overflow-hidden ">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
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
                  content={content}
                  questionNumber={currentQuestionNumber}
                  activeId={activeId}
                />
              );
            } else if (content.type === "image") {
              return <Image content={content} />;
            } else if (content.type === "text") {
              return <Text content={content} />;
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
                    const contentIndex = contents.findIndex(
                      (c) => c.id === activeContent.id,
                    );
                    const questionNumberForOverlay =
                      contents
                        .slice(0, contentIndex)
                        .filter((c) => c.type === "question").length + 1;

                    return (
                      <div className="rounded scale-105 bg-white p-2 border border-gray-300">
                        <Question
                          content={activeContent}
                          questionNumber={questionNumberForOverlay}
                          activeId={activeId}
                        />
                      </div>
                    );
                  } else if (activeContent.type === "image") {
                    return (
                      <div className="rounded scale-105 bg-white p-2 border border-gray-300">
                        <Image content={activeContent} />
                      </div>
                    );
                  } else if (activeContent.type === "text") {
                    return (
                      <div className="rounded scale-105 bg-white p-2 border border-gray-300">
                        <Text content={activeContent} />
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
