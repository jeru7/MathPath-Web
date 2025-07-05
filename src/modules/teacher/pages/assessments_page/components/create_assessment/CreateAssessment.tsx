import { type ReactElement } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../../core/styles/customDatePopper.css";
import { TbEdit } from "react-icons/tb";
import { MdDragIndicator } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsPatchQuestionFill } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineTextSnippet } from "react-icons/md";

export default function CreateAssessment(): ReactElement {
  return (
    <main className="flex h-full w-full flex-col gap-2 bg-inherit p-4">
      <header className="flex w-full items-center justify-between py-1">
        <h3 className="text-2xl font-bold">Create Assessment</h3>
      </header>

      <div className="flex h-full flex-col">
        <section className="flex justify-center relative">
          <button className="absolute py-1 px-4 border rounded-sm left-0 top-1/2 -translate-y-1/2">
            <p>Back</p>
          </button>
          <section className="flex rounded-sm">
            {/* Step 1 */}
            <article className="border-t border-l border-gray-300 flex px-4 py-2 rounded-tl-sm gap-2 bg-white items-center w-[200px]">
              <div className="flex">
                <div className="flex items-center justify-center bg-[var(--primary-yellow)] w-10 h-10 rounded-full">
                  <p className="text-white text-xl font-bold">1</p>
                </div>
              </div>
              <div className="flex flex-col font-semibold text-lg">
                <p className="text-base font-semibold">Create</p>
              </div>
            </article>
            {/* Step 2 */}
            <article className="border border-gray-300 flex px-4 py-2 gap-2 items-center w-[200px] opacity-50">
              <div className="flex">
                <div className="flex items-center justify-center bg-gray-300 w-10 h-10 rounded-full">
                  <p className="text-white text-xl font-bold">2</p>
                </div>
              </div>
              <div className="flex flex-col text-lg">
                <p className="text-base font-semibold">Configure</p>
              </div>
            </article>
            {/* Step 3 */}
            <article className="flex px-4 rounded-e-sm border-t border-r border-b border-gray-300 gap-2 items-center w-[200px] opacity-50">
              <div className="flex">
                <div className="flex items-center justify-center bg-gray-300 w-10 h-10 rounded-full">
                  <p className="text-white text-xl font-bold">3</p>
                </div>
              </div>
              <div className="flex flex-col font-semibold text-lg">
                <p className="text-base font-semibold">Publish</p>
              </div>
            </article>
          </section>
        </section>
        <section className="bg-white shadow-sm rounded-sm h-full px-96 py-12 flex flex-col gap-4">
          {/* Initial page */}
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
                <button className="text-gray-400 border border-gray-400 flex gap-1 items-center rounded-sm py-2 px-5 hover:cursor-pointer hover:text-gray-600 transition-colors duration-200">
                  <BsPatchQuestionFill />
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

          {/* add page and next step button */}
          <section className="flex justify-center relative">
            <button className="flex gap-1 items-center justify-center text-gray-300 border-gray-300 border rounded-full w-10 h-10 hover:cursor-pointer hover:text-gray-500 hover:border-gray-500 transition-all duration-200">
              <FaPlus className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1 py-1 px-3 text-white bg-[var(--primary-green)]/80 rounded-sm absolute right-0 top-1/2 -translate-y-1/2 hover:cursor-pointer hover:bg-[var(--primary-green)] transition-colors duration-200">
              <p className="text-base font-semibold">Next</p>
              <MdKeyboardArrowRight className="h-4 w-4" />
            </button>
          </section>
        </section>
      </div>
    </main>
  );
}
