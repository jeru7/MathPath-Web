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

type PageCardProps = {
  page: AssessmentPage;
  pageNumber: number;
  startingQuestionNumber: number;
  onShowModal: (modal: ModalType) => void;
  onEditContent?: (content: AssessmentContent, type: ModalType) => void;
  onDelete?: (pageId: string) => void;
  isSingle?: boolean;
  hasError?: boolean;
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
    dispatch({
      type: "UPDATE_PAGE_TITLE",
      payload: { pageId, title: newTitle },
    });
  };

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    border: isDragging ? "2px solid var(--primary-green)" : "",
    backgroundColor: isDragging ? "var(--secondary-green)" : "",
  };

  return (
    <article
      className={`flex flex-col rounded-t-sm border rounded-b-sm ${hasError ? "border-red-500" : "border-gray-300"} ${isDragging ? "opacity-50" : ""}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      {/* header */}
      <header
        className={`flex justify-between items-center p-4 rounded-t-xs bg-[var(--tertiary-green)] ${isDragging ? "opacity-0" : ""}`}
      >
        <div>
          {isEdit ? (
            // title input
            <input
              type="text"
              name="title"
              value={page.title ?? `Page ${pageNumber}`}
              className="bg-[var(--secondary-green)] outline-none text-sm px-2 py-1"
              onChange={(e) => handlePageTitleChange(page.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEdit(false);
                }
              }}
              onBlur={() => setIsEdit(false)}
            />
          ) : (
            // title
            <p
              className={`text-white font-semibold ${pageNumber === 0 ? "opacity-0" : "opacity-100"}`}
            >
              {page.title && page.title.trim() !== ""
                ? page.title
                : `Page ${pageNumber}`}
            </p>
          )}
        </div>
        {/* control buttons */}
        <div className="flex items-center gap-2">
          <button
            className="text-gray-100 hover:cursor-pointer hover:text-white transition-colors duration-200"
            onClick={() => setIsEdit(!isEdit)}
          >
            <TbEdit
              className={`h-6 w-6 ${isEdit ? "text-[var(--primary-green)]" : ""}`}
            />
          </button>
          <div
            className={`text-gray-100 hover:cursor-pointer hover:text-white transition-colors duration-200 ${isSingle ? "hidden" : ""}`}
            {...listeners}
          >
            <MdDragIndicator className="h-6 w-6" />
          </div>
          <button
            className={`text-gray-100 hover:cursor-pointer hover:text-white transition-colors duration-200 ${isSingle ? "hidden" : ""}`}
            onClick={() => onDelete?.(page.id)}
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>
      </header>
      <section
        className={`bg-white rounded-b-xs p-4 flex flex-col ${page.contents.length > 0 ? "gap-4" : ""} ${isDragging ? "opacity-0" : ""}`}
      >
        {/* content list */}
        <PageContent
          contents={page.contents}
          questionNumber={startingQuestionNumber}
          pageId={page.id}
          onEditContent={onEditContent}
        />

        {/* add content buttons */}
        <section className="flex justify-center gap-8">
          <button
            className="text-gray-400 border border-gray-400 flex gap-1 items-center rounded-sm py-2 px-5 hover:cursor-pointer hover:text-gray-600 transition-colors duration-200"
            onClick={() => onShowModal("question")}
          >
            <BsPatchQuestion />
            <p>Add question</p>
          </button>
          <button
            className="text-gray-400 border border-gray-400 flex gap-1 items-center rounded-sm py-2 px-5 hover:cursor-pointer hover:text-gray-600 transition-colors duration-200"
            onClick={() => onShowModal("image")}
          >
            <CiImageOn />
            <p>Add image</p>
          </button>
          <button
            className="text-gray-400 border border-gray-400 flex gap-1 items-center rounded-sm py-2 px-5 hover:cursor-pointer hover:text-gray-600 transition-colors duration-200"
            onClick={() => onShowModal("text")}
          >
            <MdOutlineTextSnippet />
            <p>Add text</p>
          </button>
        </section>
      </section>
    </article>
  );
}
