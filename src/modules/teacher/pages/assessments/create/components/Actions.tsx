import { type ReactElement } from "react";
import { FaPlus } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function Actions(): ReactElement {
  return (
    <section className="flex justify-center relative">
      <button className="flex gap-1 items-center justify-center text-gray-300 border-gray-300 border rounded-full w-10 h-10 hover:cursor-pointer hover:text-gray-500 hover:border-gray-500 transition-all duration-200">
        <FaPlus className="w-3 h-3" />
      </button>
      <button className="flex items-center gap-1 py-1 px-3 text-white bg-[var(--primary-green)]/80 rounded-sm absolute right-0 top-1/2 -translate-y-1/2 hover:cursor-pointer hover:bg-[var(--primary-green)] transition-colors duration-200">
        <p className="text-base font-semibold">Next</p>
        <MdKeyboardArrowRight className="h-4 w-4" />
      </button>
    </section>
  );
}
