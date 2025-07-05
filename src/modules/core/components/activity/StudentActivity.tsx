import { type ReactElement } from "react";
import { FaCircle } from "react-icons/fa";
import { FaEnvelopeOpenText } from "react-icons/fa6";

export default function StudentActivity(): ReactElement {
  return (
    <article className="flex gap-2 items-center py-2 border-b border-b-gray-300 justify-between">
      <div className="absolute left-0.5 w-4 h-4 bg-[var(--secondary-green)] rounded-full z-10 transform"></div>
      <div className="flex gap-2 items-center">
        <FaEnvelopeOpenText className="text-[var(--primary-orange)] h-8 w-8" />
        <div className="flex flex-col">
          <p className="text-xs">
            You finished <span className="font-semibold">Quiz 1</span>.
          </p>
          <div className="text-gray-400 flex items-center gap-1">
            <p className="text-xs">3 mins ago</p>
            <FaCircle className="w-1 h-1" />
            <p className="text-xs">Assessment</p>
          </div>
        </div>
      </div>
    </article>
  );
}
