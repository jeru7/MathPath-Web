import { useEffect, useRef, useState, type ReactElement } from "react";
import { format } from "date-fns";
import { Section } from "../../../../../core/types/section/section.type";
import { FaEllipsisH } from "react-icons/fa";
import { useTeacherContext } from "../../../../context/teacher.context";
import { formatToPhDate } from "../../../../../core/utils/date.util";
import { getSectionBanner } from "../../../../../core/utils/section/section.util";
import { useTeacherDeleteSection } from "../../../../services/teacher.service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function SectionCard({
  section,
}: {
  section: Section;
}): ReactElement {
  const { onlineStudents, students, assessments, teacherId } =
    useTeacherContext();
  const { mutate: deleteSection } = useTeacherDeleteSection(teacherId);
  const queryClient = useQueryClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const studentCount = students.filter(
    (student) => student.sectionId === section.id,
  ).length;

  const assessmentCount = assessments.filter((assessment) =>
    assessment.sections.includes(section.id),
  ).length;

  const onlineStudentCount = (): number => {
    const onlineInSection = onlineStudents.filter(
      (student) => student.sectionId === section.id,
    );

    return onlineInSection.length;
  };

  const onlinePercentage = students.length
    ? Math.round((onlineStudentCount() / students.length) * 100)
    : 0;

  const handleEdit = () => {
    console.log("Edit section", section.id);
    setMenuOpen(false);
  };

  const handleDelete = (sectionId: string) => {
    deleteSection(sectionId, {
      onSuccess: () => {
        toast.success("Section created successfully.");
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "sections"],
        });
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section
      className={`flex flex-col rounded-sm bg-white opacity-90 border-gray-300 border hover:cursor-pointer hover:opacity-100 h-full xl:max-w-[350px]`}
    >
      <div
        className={`bg-[var(--${section.color})] h-1 w-full rounded-t-md `}
      ></div>
      <div className="flex flex-col justify-between p-2 flex-1">
        {/* Banner */}
        <div className="rounded-sm flex items-center justify-center">
          <img
            src={getSectionBanner(section.banner)}
            alt="section banner"
            className="object-contain w-full max-w-[320px]"
          />
        </div>
        {/* Header */}
        <header className="flex flex-col">
          <div className="relative flex items-center justify-between">
            <h3 className="text-lg font-semibold">{section.name}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
            >
              <FaEllipsisH className="w-8 hover:scale-105 hover:cursor-pointer" />
            </button>
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded shadow-md z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 hover:cursor-pointer"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500 hover:cursor-pointer"
                  onClick={() => handleDelete(section.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <p className="text-[10px] text-[var(--primary-gray)]">{`Last checked on ${format(formatToPhDate(section.lastChecked.toString()), "MMMM d, yyyy")}`}</p>
        </header>
        {/* Section details - Top */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold">{studentCount}</p>
            <p className="text-xs text-[var(--primary-gray)]">Students</p>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold">{assessmentCount}</p>
            <p className="text-xs text-[var(--primary-gray)]">Assessments</p>
          </div>
        </div>
        {/* Section details - Bottom */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <p className="">Online</p>
            <p className="">{onlineStudentCount()}</p>
          </div>
          {/* Online Bar */}
          <div className="relative h-1 rounded-full">
            <div
              className="absolute left-0 top-0 h-full w-full rounded-full opacity-50"
              style={{
                backgroundColor: `var(--${section.color})`,
              }}
            ></div>
            <div
              className="h-full rounded-full"
              style={{
                width: `${onlinePercentage}%`,
                backgroundColor: `var(--${section.color})`,
              }}
            ></div>
          </div>
          <p className="text-right text-[10px] text-[var(--primary-gray)]">{`Created on ${format(formatToPhDate(section.createdAt.toString()), "MMMM d, yyyy")}`}</p>
        </div>
      </div>
    </section>
  );
}
