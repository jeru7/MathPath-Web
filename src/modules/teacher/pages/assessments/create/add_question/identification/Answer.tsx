import { type ReactElement } from "react";

export default function Answer(): ReactElement {
  return (
    <article className="flex border border-gray-300 rounded-sm items-center">
      <div className="flex items-center w-full p-2">
        <input
          type="text"
          placeholder="Type here..."
          className="outline-none w-full text-sm"
        />
      </div>
    </article>
  );
}
