import { type ReactElement } from "react";
import { Section } from "../../../../../core/types/section/section.type";
import { getSectionBanner } from "../../../../../core/utils/section/section.util";
import { IoClose } from "react-icons/io5";
import { useTeacherContext } from "../../../../context/teacher.context";

type SectionItemProps = {
  data: Section;
  onDelete: (section: Section) => void;
};
export default function SectionItem({
  data,
  onDelete,
}: SectionItemProps): ReactElement {
  const { students } = useTeacherContext();

  const studentCount = students.filter(
    (student) => student.sectionId === data.id,
  ).length;

  return (
    <li className="w-full flex justify-between pl-1 py-1 pr-4 border-gray-300 border rounded-xs group">
      <div className="flex gap-2">
        <img
          src={getSectionBanner(data.banner)}
          alt="section banner"
          className="w-16 h-full object-cover"
        />
        <div className="flex flex-col gap-1">
          <p className="font-bold text-sm">{data.name}</p>
          <p className="text-xs">Students: {studentCount}</p>
        </div>
      </div>
      <button
        className="flex items-center opacity-0 justify-center hover:cursor-pointer group-hover:opacity-100 transition-all duration-200"
        type="button"
        onClick={() => onDelete(data)}
      >
        <IoClose />
      </button>
    </li>
  );
}
