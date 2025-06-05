import { type ReactElement } from "react";
import { IoGameController } from "react-icons/io5";

export default function BadgeItem(): ReactElement {
  return (
    <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
      <div className="rounded-full flex items-center h-fit w-fit justify-center p-3 bg-amber-400">
        <IoGameController className="h-12 w-12" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center">
          <p className="font-semibold text-md">Badges Name</p>
          <p className="text-xs text-gray-400">Badges Description</p>
        </div>
      </div>

      <div className="w-full rounded-full bg-gray-200 h-2">
        <div className="h-full bg-[var(--primary-green)] rounded-full w-full"></div>
      </div>
    </article>
  );
}
