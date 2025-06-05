import { type ReactElement } from "react";
import { FaEnvelopeOpenText } from "react-icons/fa6";

export default function ActivityItem(): ReactElement {
  return (
    <article className="flex gap-2 items-center py-2 border-b border-b-gray-300 justify-between">
      <div className="absolute left-0.5 w-4 h-4 bg-[var(--secondary-green)] rounded-full z-10 transform"></div>
      <div className="flex gap-2">
        <FaEnvelopeOpenText className="text-[var(--primary-orange)] h-7 w-7" />
        <div className="flex flex-col">
          <p className="text-xs">Answered the new assessment</p>
          <p className="text-xs text-gray-400">05/28/25</p>
        </div>
      </div>
      <p className="text-xs text-gray-400">6:00 PM</p>
    </article>
  );
}
