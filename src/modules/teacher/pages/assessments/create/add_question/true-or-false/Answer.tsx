import { type ReactElement } from "react";

export default function Answer(): ReactElement {
  return (
    <article className="flex rounded-sm items-center gap-4">
      <button
        className="border-gray-300 border rounded-xs py-2 px-5 hover:cursor-pointer hover:bg-[var(--primary-green)]/80 hover:text-white transition-colors duration-200"
        type="button"
      >
        True
      </button>
      <button
        className="border-gray-300 border rounded-xs py-2 px-5 hover:cursor-pointer hover:bg-red-400/80 transition-colors duration-200"
        type="button"
      >
        False
      </button>
    </article>
  );
}
