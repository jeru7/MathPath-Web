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
      className={`flex flex-col w-full rounded-t-sm border rounded-b-sm ${hasError ? "border-red-500" : "border-gray-300 dark:border-gray-600"} ${isDragging ? "opacity-50" : ""} transition-colors duration-200`}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      {/* header */}
      <header
        className={`flex justify-between items-center p-2 sm:p-4 rounded-t-xs bg-[var(--tertiary-green)] dark:bg-green-600 ${isDragging ? "opacity-0" : ""} transition-colors duration-200`}
      >
        <div>
          {isEdit ? (
            // title input
            <input
              type="text"
              name="title"
              value={page.title ?? `Page ${pageNumber}`}
              className="bg-green-400 dark:bg-green-500 outline-none text-xs sm:text-sm px-2 py-1 text-white placeholder-green-200 rounded transition-colors duration-200"
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
            // title
            <p
              className={`text-white text-xs sm:text-sm font-semibold ${pageNumber === 0 ? "opacity-0" : "opacity-100"} transition-colors duration-200`}
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
            className="text-green-100 hover:cursor-pointer hover:text-white transition-colors duration-200"
            onClick={() => setIsEdit(!isEdit)}
          >
            <TbEdit
              className={`h-4 w-4 sm:h-6 sm:w-6 ${isEdit ? "text-green-300" : ""} transition-colors duration-200`}
            />
          </button>
          <div
            className={`text-green-100 hover:cursor-pointer hover:text-white transition-colors duration-200 ${isSingle ? "hidden" : ""}`}
            {...listeners}
          >
            <MdDragIndicator className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
          <button
            className={`text-green-100 hover:cursor-pointer hover:text-white transition-colors duration-200 ${isSingle ? "hidden" : ""}`}
            onClick={() => onDelete?.(page.id)}
          >
            <IoClose className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        </div>
      </header>
      <section
        className={`bg-white dark:bg-gray-800 rounded-b-xs p-4 flex flex-col ${page.contents.length > 0 ? "gap-4" : ""} ${isDragging ? "opacity-0" : ""} transition-colors duration-200`}
      >
        {/* content list */}
        <PageContent
          contents={page.contents}
          questionNumber={startingQuestionNumber}
          pageId={page.id}
          onEditContent={onEditContent}
        />

        {/* add content buttons */}
        <section className="flex justify-center gap-2 sm:gap-8">
          <button
            className="text-gray-400 dark:text-gray-500 border border-gray-400 dark:border-gray-600 flex gap-1 items-center rounded-sm py-1 px-2 sm:py-2 sm:px-5 hover:cursor-pointer hover:text-gray-600 dark:hover:text-gray-400 hover:border-gray-600 dark:hover:border-gray-400 transition-colors duration-200 bg-white dark:bg-gray-700"
            onClick={() => onShowModal("question")}
          >
            <BsPatchQuestion className="hidden sm:block h-3 w-3 sm:h-6 sm:w-6" />
            <p className="text-nowrap text-xs sm:text-base">Add question</p>
          </button>
          <button
            className="text-gray-400 dark:text-gray-500 border border-gray-400 dark:border-gray-600 flex gap-1 items-center rounded-sm py-1 px-2 sm:py-2 sm:px-5 hover:cursor-pointer hover:text-gray-600 dark:hover:text-gray-400 hover:border-gray-600 dark:hover:border-gray-400 transition-colors duration-200 bg-white dark:bg-gray-700"
            onClick={() => onShowModal("image")}
          >
            <CiImageOn className="hidden sm:block h-3 w-3 sm:h-6 sm:w-6" />
            <p className="text-nowrap text-xs sm:text-base">Add image</p>
          </button>
          <button
            className="text-gray-400 dark:text-gray-500 border border-gray-400 dark:border-gray-600 flex gap-1 items-center rounded-sm py-1 px-2 sm:py-2 sm:px-5 hover:cursor-pointer hover:text-gray-600 dark:hover:text-gray-400 hover:border-gray-600 dark:hover:border-gray-400 transition-colors duration-200 bg-white dark:bg-gray-700"
            onClick={() => onShowModal("text")}
          >
            <MdOutlineTextSnippet className="hidden sm:block h-3 w-3 sm:h-6 sm:w-6" />
            <p className="text-nowrap text-xs sm:text-base">Add text</p>
          </button>
        </section>
      </section>
    </article>
  );
}
