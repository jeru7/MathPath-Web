import { type ReactElement } from "react";
import { FaFile } from "react-icons/fa6";

export default function Todo(): ReactElement {
  return (
    <article className="w-full h-full rounded-sm shadow-sm p-3 bg-white flex flex-col gap-1">
      <p className="font-semibold text-gray-900">To-do</p>
      <div className="w-full h-full flex items-center justify-start">
        <div className="flex gap-2 items-center justify-center">
          <FaFile className="text-[var(--primary-green)]" />
          <p className="hover:text-[var(--primary-green)] text-sm hover:cursor-pointer transition-colors duration-200">
            1 Assessment due
          </p>
        </div>
      </div>
    </article>
  );
}
