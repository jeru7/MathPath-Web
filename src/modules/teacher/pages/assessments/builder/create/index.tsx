import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useState, type ReactElement } from "react";
import PageCard from "./PageCard";
import { createPortal } from "react-dom";
import { getStartingQuestionNumber } from "../../utils/question.util";
import Modals, { ModalType } from "./modals/Modals";
import {
  AssessmentContent,
  AssessmentPage,
} from "../../../../../core/types/assessment/assessment.types";
import { useAssessmentBuilder } from "../context/assessment-builder.context";
import { nanoid } from "nanoid";
import { FaPlus } from "react-icons/fa";

export default function CreateAssessment(): ReactElement {
  // reducers
  const { state, dispatch } = useAssessmentBuilder();

  // states
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string>(
    state.pages[0].id,
  );
  const [contentToEdit, setContentToEdit] = useState<AssessmentContent | null>(
    null,
  );

  // handlers
  const handleAddPage = (page: AssessmentPage) => {
    dispatch({
      type: "ADD_PAGE",
      payload: page,
    });
  };

  const handleDeletePage = (pageId: string) => {
    if (state.pages.length === 1) return;
    dispatch({
      type: "DELETE_PAGE",
      payload: pageId,
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    document.body.getBoundingClientRect();
    setActiveId(event.active.id);
  };

  const getTaskPos = (id: number | string) => {
    return state.pages.findIndex((page) => id === page.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id === over?.id || !over) return;

    const originalPos = getTaskPos(active.id);
    const newPos = getTaskPos(over.id);

    dispatch({
      type: "SET_PAGE",
      payload: arrayMove(state.pages, originalPos, newPos),
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = getTaskPos(active.id);
    const newIndex = getTaskPos(over.id);

    if (oldIndex !== newIndex) {
      dispatch({
        type: "SET_PAGE",
        payload: arrayMove(state.pages, oldIndex, newIndex),
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-fit px-96 gap-4">
      <section className="flex flex-col gap-4 h-fit min-h-full">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          collisionDetection={closestCorners}
        >
          <SortableContext items={state.pages}>
            {/* page list */}
            {state.pages.map((page, index) => {
              const startingQuestionNumber = getStartingQuestionNumber(
                page.id,
                state.pages,
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
                  onEditContent={(
                    content: AssessmentContent,
                    type: ModalType,
                  ) => {
                    setContentToEdit(content);
                    setSelectedPageId(page.id);
                    setActiveModal(type);
                  }}
                  onDelete={handleDeletePage}
                  isSingle={state.pages.length === 1}
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
                    const activePage = state.pages.find(
                      (page) => page.id === activeId,
                    );
                    if (!activePage) return null;
                    const startingQuestionNumber = getStartingQuestionNumber(
                      activePage.id,
                      state.pages,
                    );

                    return (
                      <PageCard
                        page={activePage}
                        pageNumber={0}
                        startingQuestionNumber={startingQuestionNumber}
                        onShowModal={(modalType) => {
                          setActiveModal(modalType);
                        }}
                      />
                    );
                  })()
                : null}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>

        {/* modals */}
        {activeModal && (
          <Modals
            activeModal={activeModal}
            onClose={() => {
              setContentToEdit(null);
              setActiveModal(null);
            }}
            pageId={selectedPageId}
            contentToEdit={contentToEdit}
          />
        )}
      </section>
      {/* add page button */}
      <div className="flex justify-center">
        <button
          className="flex gap-1 items-center justify-center text-gray-300 border-gray-300 border rounded-full w-10 h-10 hover:cursor-pointer hover:text-gray-500 hover:border-gray-500 transition-all duration-200"
          onClick={() =>
            handleAddPage({
              id: nanoid(),
              title: null,
              contents: [],
            })
          }
        >
          <FaPlus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
