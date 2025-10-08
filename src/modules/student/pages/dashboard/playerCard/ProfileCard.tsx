import { type ReactElement } from "react";
import { capitalizeWord } from "../../../../core/utils/string.util";
import { Student } from "../../../types/student.type";
import { useStudentSection } from "../../../services/student.service";
import { getProfilePicture } from "../../../../core/utils/profile-picture.util";

type ProfileCardProps = {
  student: Student;
};

export default function ProfileCard({
  student,
}: ProfileCardProps): ReactElement {
  const { data: section } = useStudentSection(student.id, student.sectionId);
  const currentExp = student?.exp.current ?? 0;
  const nextLevelExp = student?.exp.nextLevel ?? 1;
  const expPercentage = Math.round((currentExp / nextLevelExp) * 100);

  return (
    <article className="w-full bg-white dark:bg-gray-800 border border-white dark:border-gray-700 rounded-sm shadow-sm p-3 transition-colors duration-200">
      <div className="flex items-center gap-3">
        {/* profile picture */}
        <div className="flex-shrink-0">
          <div className="rounded-full border border-gray-300 dark:border-gray-600 h-12 w-12 overflow-hidden transition-colors duration-200">
            <img
              src={getProfilePicture(student.profilePicture)}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* profile info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate transition-colors duration-200">
            {capitalizeWord(student?.firstName.toString())}{" "}
            {student?.middleName?.charAt(0).toUpperCase()}.{" "}
            {capitalizeWord(student?.lastName.toString())}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs truncate transition-colors duration-200">
            {section?.name}
          </p>
          <div className="flex gap-1 mt-1">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded transition-colors duration-200">
              Student
            </span>
          </div>
        </div>

        {/* level */}
        <div className="text-center">
          <div className="rounded-full bg-[var(--secondary-green)] h-10 w-10 flex items-center justify-center">
            <p className="text-white font-bold text-sm">{student?.level}</p>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 transition-colors duration-200">
            Level
          </p>
        </div>
      </div>

      {/* progress bar */}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-600 dark:text-gray-300 text-xs transition-colors duration-200">
            Progress
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs transition-colors duration-200">
            {expPercentage}%
          </span>
        </div>
        <div className="relative bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors duration-200">
          <div
            className="rounded-full bg-[var(--secondary-green)] h-full"
            style={{ width: `${expPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-200">
          <span>{currentExp} EXP</span>
          <span>{nextLevelExp} EXP</span>
        </div>
      </div>
    </article>
  );
}
