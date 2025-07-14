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
} from "../../../../../core/types/assessment/assessment.types";
import PageContent from "./PageContent";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type PageCardProps = {
  page: AssessmentPage;
  pageNumber: number;
  startingQuestionNumber: number;
  onShowAddQuestion: (show: boolean) => void;
  onContentsChange: (pageId: string, newContents: AssessmentContent[]) => void;
  onTitleChange: (pageId: string, newTitle: string) => void;
  onDeletePage: (pageId: string) => void;
};

export default function PageCard({
  page,
  pageNumber,
  startingQuestionNumber,
  onShowAddQuestion,
  onContentsChange,
  onTitleChange,
  onDeletePage,
}: PageCardProps): ReactElement {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    border: isDragging ? "2px solid var(--primary-green)" : "",
    backgroundColor: isDragging ? "var(--secondary-green)" : "",
  };

  return (
    <article
      className={`flex flex-col rounded-t-sm border border-gray-300 rounded-b-sm ${isDragging ? "opacity-50" : ""}`}
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
              value={
                page.title || page.title === ""
                  ? page.title
                  : `Page ${pageNumber}`
              }
              className="bg-[var(--secondary-green)] outline-none text-sm px-2 py-1"
              onChange={(e) => onTitleChange(page.id, e.target.value)}
            />
          ) : (
            // title
            <p
              className={`text-white font-semibold ${pageNumber === 0 ? "opacity-0" : "opacity-100"}`}
            >
              {page.title ? page.title : `Page ${pageNumber}`}
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
            className="text-gray-100 hover:cursor-pointer hover:text-white transition-colors duration-200"
            {...listeners}
          >
            <MdDragIndicator className="h-6 w-6" />
          </div>
          <button
            className="text-gray-100 hover:cursor-pointer hover:text-white transition-colors duration-200"
            onClick={() => onDeletePage(page.id)}
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
          onContentsChange={onContentsChange}
          pageId={page.id}
        />

        {/* add content buttons */}
        <section className="flex justify-center gap-8">
          <button
            className="text-gray-400 border border-gray-400 flex gap-1 items-center rounded-sm py-2 px-5 hover:cursor-pointer hover:text-gray-600 transition-colors duration-200"
            onClick={() => onShowAddQuestion(true)}
          >
            <BsPatchQuestion />
            <p>Add question</p>
          </button>
          <button className="text-gray-400 border border-gray-400 flex gap-1 items-center rounded-sm py-2 px-5 hover:cursor-pointer hover:text-gray-600 transition-colors duration-200">
            <CiImageOn />
            <p>Add image</p>
          </button>
          <button className="text-gray-400 border border-gray-400 flex gap-1 items-center rounded-sm py-2 px-5 hover:cursor-pointer hover:text-gray-600 transition-colors duration-200">
            <MdOutlineTextSnippet />
            <p>Add text</p>
          </button>
        </section>
      </section>
    </article>
  );
}
