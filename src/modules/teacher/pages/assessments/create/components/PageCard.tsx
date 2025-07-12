import { type ReactElement } from "react";
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

type PageCardProps = {
  page: AssessmentPage;
  startingQuestionNumber: number;
  onShowAddQuestion: (show: boolean) => void;
  onContentsChange: (pageId: string, newContents: AssessmentContent[]) => void;
};
export default function PageCard({
  page,
  startingQuestionNumber,
  onShowAddQuestion,
  onContentsChange,
}: PageCardProps): ReactElement {
  return (
    <article className="flex flex-col rounded-t-sm border border-gray-300 rounded-b-sm">
      {/* header */}
      <header className="flex justify-between items-center p-4 rounded-t-xs bg-[var(--tertiary-green)]">
        {/* title */}
        <p className="text-white font-semibold">{page.title ?? "No title"}</p>
        {/* control buttons */}
        <div className="flex items-center gap-2">
          <button className="text-gray-100 hover:cursor-pointer hover:text-white transition-colors duration-200">
            <TbEdit className="h-6 w-6" />
          </button>
          <button className="text-gray-100 hover:cursor-pointer hover:text-white transition-colors duration-200">
            <MdDragIndicator className="h-6 w-6" />
          </button>
          <button className="text-gray-100 hover:cursor-pointer hover:text-white transition-colors duration-200">
            <IoClose className="h-6 w-6" />
          </button>
        </div>
      </header>
      <section
        className={`bg-white rounded-b-xs p-4 flex flex-col ${page.contents.length > 0 ? "gap-4" : ""}`}
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
