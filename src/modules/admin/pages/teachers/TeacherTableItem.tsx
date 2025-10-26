import { type ReactElement } from "react";
import { Teacher } from "../../../teacher/types/teacher.type";
import { FaCheck, FaXmark } from "react-icons/fa6";

type TeacherTableItemProps = {
  teacher: Teacher;
  onClick: (teacherId: string) => void;
};

export default function TeacherTableItem({
  teacher,
  onClick,
}: TeacherTableItemProps): ReactElement {
  const handleClick = () => {
    onClick(teacher.id);
  };

  const getFullName = () => {
    return `${teacher.lastName}, ${teacher.firstName}${teacher.middleName ? ` ${teacher.middleName.charAt(0)}.` : ""}`.trim();
  };

  const getStatusIcon = () => {
    if (teacher.verified.verified) {
      return (
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <FaCheck className="w-3 h-3" />
          <span className="text-xs">Verified</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
          <FaXmark className="w-3 h-3" />
          <span className="text-xs">Unverified</span>
        </div>
      );
    }
  };

  const getGenderDisplay = (gender: string) => {
    switch (gender.toLowerCase()) {
      case "male":
        return "Male";
      case "female":
        return "Female";
      default:
        return gender;
    }
  };

  return (
    <tr
      className="w-full font-medium text-sm xl:text-base hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer overflow-visible transition-colors duration-200"
      onClick={handleClick}
    >
      {/* email */}
      <td className="text-left w-[30%] text-gray-900 dark:text-gray-100">
        {teacher.email}
      </td>

      {/* name */}
      <td className="w-[30%] text-left">
        <div className="flex items-center gap-2 max-w-[180px] xl:max-w-none">
          <p className="whitespace-nowrap overflow-hidden text-ellipsis text-gray-900 dark:text-gray-100">
            {getFullName()}
          </p>
        </div>
      </td>

      {/* gender */}
      <td className="w-[20%] text-gray-900 dark:text-gray-100">
        {getGenderDisplay(teacher.gender)}
      </td>

      {/* verification status */}
      <td className="w-[20%]">{getStatusIcon()}</td>
    </tr>
  );
}
