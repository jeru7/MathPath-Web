import { useMemo, type ReactElement } from "react";
import { Student } from "../../../../../student/types/student.type";
import { getProfilePicture } from "../../../../../core/utils/profile-picture.util";
import { FaFire, FaGamepad } from "react-icons/fa";
import { FaEnvelope, FaUser } from "react-icons/fa6";

type StudentItemProps = {
  student: Student;
  index: number;
  onStudentClick: (student: Student) => void;
};

export default function StudentItem({
  student,
  index,
  onStudentClick,
}: StudentItemProps): ReactElement {
  const progress = useMemo(() => {
    const totalStages = student.stages?.length || 0;
    const completedStages =
      student.stages?.filter((stage) => stage.completed)?.length || 0;
    const progress =
      totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

    return {
      level: student.level || 1,
      progress,
      completedStages,
      totalStages,
      streak: student.streak || 0,
    };
  }, [student]);

  // const isActive = useMemo(() => {
  //   if (!student.lastOnline) return false;
  //   const lastOnline = new Date(student.lastOnline);
  //   const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  //   return lastOnline > sevenDaysAgo;
  // }, [student.lastOnline]);

  return (
    <div
      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm transition-all duration-200 hover:border-green-200 dark:hover:border-green-800 group cursor-pointer"
      onClick={() => onStudentClick(student)}
    >
      {/* student number: hidden on mobile */}
      <div className="hidden sm:flex flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-sm items-center justify-center">
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {index + 1}
        </span>
      </div>

      <div className="flex-shrink-0">
        {student.profilePicture ? (
          <img
            src={getProfilePicture(student.profilePicture)}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
          />
        ) : (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center border border-gray-200 dark:border-gray-600">
            <span className="text-xs sm:text-sm font-semibold text-white">
              {student.firstName[0]}
              {student.lastName[0]}
            </span>
          </div>
        )}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start sm:items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {student.firstName} {student.lastName}
            </h4>
            {/* <div className="flex items-center gap-1 flex-shrink-0"> */}
            {/*   <div */}
            {/*     className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-300"}`} */}
            {/*   /> */}
            {/*   <span */}
            {/*     className={`text-xs font-medium hidden xs:inline ${isActive ? "text-green-600 dark:text-green-400" : "text-gray-500"}`} */}
            {/*   > */}
            {/*     {isActive ? "Active" : "Inactive"} */}
            {/*   </span> */}
            {/* </div> */}
          </div>

          {/* level */}
          <div className="flex items-center gap-1 sm:hidden">
            <FaGamepad className="w-3 h-3 text-blue-500" />
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
              {progress.level}
            </span>
          </div>
        </div>

        {/* email and gender */}
        <div className="hidden xs:flex items-center gap-3 sm:gap-4 text-xs text-gray-600 dark:text-gray-400 mb-2">
          <div className="flex items-center gap-1">
            <FaEnvelope className="w-3 h-3" />
            <span className="truncate max-w-[100px] sm:max-w-[120px]">
              {student.email}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaUser className="w-3 h-3" />
            <span className="capitalize">{student.gender}</span>
          </div>
        </div>

        {/* stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1">
              <FaGamepad className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                Lvl {progress.level}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {progress.completedStages}/{progress.totalStages} stages
              </span>
            </div>
          </div>

          {progress.streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
              <FaFire className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                {progress.streak}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
