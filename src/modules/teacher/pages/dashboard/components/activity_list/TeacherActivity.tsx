import { type ReactElement } from "react";
import { FaCircle } from "react-icons/fa";
import { getProfilePictures } from "../../../../../core/utils/profile-picture.util";

export default function TeacherActivity(): ReactElement {
  return (
    <article className="flex gap-2 items-center py-2 border-b border-b-gray-300 justify-between">
      <div className="absolute left-0.5 w-4 h-4 bg-[var(--secondary-green)] rounded-full z-10 transform"></div>
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 rounded-full">
          <img
            src={getProfilePictures("Boy_1")}
            alt="Student profile picture."
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-xs">
            John Emmanuel finished <span className="font-semibold">Quiz 1</span>
            .
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
