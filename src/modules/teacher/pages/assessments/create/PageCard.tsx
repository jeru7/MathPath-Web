import { type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { MdDragIndicator } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { BsPatchQuestion } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineTextSnippet } from "react-icons/md";

type PageCardProps = {
  setShowAddQuestion: (show: boolean) => void;
};
export default function PageCard({
  setShowAddQuestion,
}: PageCardProps): ReactElement {
  return (
    <article className="flex flex-col rounded-t-sm border border-gray-300 rounded-b-sm">
      <header className="flex justify-between items-center p-4 rounded-t-xs bg-[var(--tertiary-green)]">
        <p className="text-white font-semibold">Page: 1</p>
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
      <section className="bg-white rounded-b-xs p-4">
        <div className="flex justify-center gap-8">
          <button
            className="text-gray-400 border border-gray-400 flex gap-1 items-center rounded-sm py-2 px-5 hover:cursor-pointer hover:text-gray-600 transition-colors duration-200"
            onClick={() => setShowAddQuestion(true)}
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
        </div>
      </section>
    </article>
  );
}
