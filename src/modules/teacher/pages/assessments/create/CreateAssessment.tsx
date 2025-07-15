import { useEffect, useState, type ReactElement } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../core/styles/customDatePopper.css";
import Stepper from "./components/Stepper";
import PageCard from "./components/PageCard";
import {
  AssessmentContent,
  AssessmentPage,
  AssessmentQuestion,
} from "../../../../core/types/assessment/assessment.types";
import { nanoid } from "nanoid";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { getStartingQuestionNumber } from "../utils/question.util";
import Modals, { ModalType } from "./components/Modals";
import BuilderActions from "./components/actions/BuilderActions";

export default function CreateAssessment(): ReactElement {
  // states
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const [pages, setPages] = useState<AssessmentPage[]>([
    { id: nanoid(), contents: [] },
  ]);
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0].id);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  useEffect(() => {
    console.log(pages);
  }, [pages]);

  // handlers
  const handleAddQuestion = (pageId: string, question: AssessmentQuestion) => {
    setPages((prevPages) => {
      return prevPages.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            contents: [
              ...page.contents,
              {
                id: nanoid(),
                type: "question",
                data: question,
              },
            ],
          };
        } else {
          return page;
        }
      });
    });
  };

  const handleAddImage = (pageId: string, imageUrl: string) => {
    setPages((prevPages) => {
      return prevPages.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            contents: [
              ...page.contents,
              {
                id: nanoid(),
                type: "image",
                data: imageUrl,
              },
            ],
          };
        } else {
          return page;
        }
      });
    });
  };

  const handleAddText = (pageId: string, text: string) => {
    setPages((prevPages) => {
      return prevPages.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            contents: [
              ...page.contents,
              {
                id: nanoid(),
                type: "text",
                data: text,
              },
            ],
          };
        } else {
          return page;
        }
      });
    });
  };

  const handlePageContentChanges = (
    pageId: string,
    newContents: AssessmentContent[],
  ) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        pageId === page.id ? { ...page, contents: newContents } : page,
      ),
    );
  };

  const handlePageTitleChange = (pageId: string, newTitle: string) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        pageId === page.id ? { ...page, title: newTitle } : page,
      ),
    );
  };

  const handleAddPage = (page: AssessmentPage) => {
    setPages([...pages, page]);
  };

  const handleDeletePage = (pageId: string) => {
    if (pages.length === 1) return;
    const newPages = pages.filter((page) => page.id !== pageId);
    setPages(newPages);
  };

  const handleDragStart = (event: DragStartEvent) => {
    document.body.getBoundingClientRect();
    setActiveId(event.active.id);
  };

  const getTaskPos = (id: number | string) => {
    return pages.findIndex((page) => id === page.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id === over?.id || !over) return;

    const originalPos = getTaskPos(active.id);
    const newPos = getTaskPos(over.id);

    setPages(arrayMove(pages, originalPos, newPos));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = getTaskPos(active.id);
    const newIndex = getTaskPos(over.id);

    if (oldIndex !== newIndex) {
      setPages(arrayMove(pages, oldIndex, newIndex));
    }
  };

  return (
    <main className="flex h-fit w-full flex-col gap-2 bg-inherit p-4 min-h-screen">
      <header className="flex w-full items-center justify-between py-1">
        <h3 className="text-2xl font-bold">Create Assessment</h3>
      </header>

      <div className="flex h-full flex-col">
        <section className="flex justify-center relative">
          <button className="absolute py-1 px-4 border rounded-sm left-0 top-1/2 -translate-y-1/2">
            <p>Back</p>
          </button>
          <Stepper currentStep={1} />
        </section>
        <section className="bg-white shadow-sm rounded-sm px-96 py-12 flex flex-col gap-4 h-fit min-h-full overflow-hidden">
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            collisionDetection={closestCorners}
          >
            <SortableContext items={pages}>
              {/* page list */}
              {pages.map((page, index) => {
                const startingQuestionNumber = getStartingQuestionNumber(
                  page.id,
                  pages,
                );

                const pageCard = (
                  <PageCard
                    key={page.id}
                    page={page}
                    pageNumber={index + 1}
                    startingQuestionNumber={startingQuestionNumber}
                    onShowModal={(modalType) => {
                      setSelectedPageId(page.id);
                      setActiveModal(modalType);
                    }}
                    onContentsChange={handlePageContentChanges}
                    onTitleChange={handlePageTitleChange}
                    onDeletePage={handleDeletePage}
                  />
                );

                return pageCard;
              })}
            </SortableContext>
            {/* dummy for floating draggable page card */}
            {createPortal(
              <DragOverlay>
                {activeId
                  ? (() => {
                      const activePage = pages.find(
                        (content) => content.id === activeId,
                      );
                      if (!activePage) return null;
                      const startingQuestionNumber = getStartingQuestionNumber(
                        activePage.id,
                        pages,
                      );

                      return (
                        <PageCard
                          page={activePage}
                          pageNumber={0}
                          startingQuestionNumber={startingQuestionNumber}
                          onShowModal={(modalType) => {
                            setActiveModal(modalType);
                          }}
                          onContentsChange={handlePageContentChanges}
                          onTitleChange={handlePageTitleChange}
                          onDeletePage={handleDeletePage}
                        />
                      );
                    })()
                  : null}
              </DragOverlay>,
              document.body,
            )}
          </DndContext>
          <BuilderActions onAddPage={handleAddPage} />
        </section>
      </div>

      {/* modals */}
      {activeModal && (
        <Modals
          activeModal={activeModal}
          onClose={() => setActiveModal(null)}
          pageId={selectedPageId}
          onAddQuestion={handleAddQuestion}
          onAddText={handleAddText}
          onAddImage={handleAddImage}
        />
      )}
    </main>
  );
}
