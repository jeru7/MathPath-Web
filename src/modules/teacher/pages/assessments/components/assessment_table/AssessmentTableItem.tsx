import { useEffect, useRef, useState, type ReactElement } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { getSectionBanner } from "../../../../../core/utils/section/section.util";
import { useNavigate, useParams } from "react-router-dom";
import { useTeacherSections } from "../../../../services/teacher.service";
import AssessmentStatus from "./AssessmentStatus";
import { format } from "date-fns-tz";
import { useDeleteAssessment } from "../../../../../core/services/assessments/assessment.service";
import { useQueryClient } from "@tanstack/react-query";

type AssessmentTableItemProps = {
  assessment: Assessment;
};

export default function AssessmentTableItem({
  assessment,
}: AssessmentTableItemProps): ReactElement {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const { data: sections } = useTeacherSections(teacherId ?? "");
  const { mutate: deleteAssessment } = useDeleteAssessment(teacherId ?? "");
  const queryClient = useQueryClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const sectionBanners = sections
    ?.filter((section) => assessment.sections.includes(section.id))
    .map((section) => section.banner);

  const handleDeleteAssessment = () => {
    deleteAssessment(assessment.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "assessments"],
        });
      },
    });
    setMenuOpen(false);
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
    <tr
      className="w-full font-medium text-sm xl:text-base hover:bg-gray-100 hover:cursor-pointer overflow-visible"
      onClick={() => navigate(`${assessment.id}`)}
    >
      {/* Title */}
      <td className="w-[15%] xl:w-[20%]">
        <div
          title={assessment.title ? assessment.title : "(No title)"}
          className={`truncate whitespace-nowrap overflow-hidden max-w-[500px] ${assessment.title ? "" : "text-gray-400"}`}
        >
          {assessment.title ? assessment.title : "(No title)"}
        </div>
      </td>
      {/* Topic */}
      <td className="w-[15%] xl:w-[20%]">
        <div
          title={assessment.topic ? assessment.topic : "(No title)"}
          className={`truncate whitespace-nowrap overflow-hidden max-w-[400px] ${assessment.topic ? "" : "text-gray-400"}`}
        >
          {assessment.topic ? assessment.topic : "(No topic)"}
        </div>
      </td>
      {/* Section */}
      <td className="w-[15%]">
        <div
          className={`flex gap-2 justify-center ${assessment.sections.length === 0 ? "text-gray-400" : ""}`}
        >
          {assessment.sections.length === 0
            ? "(No sections)"
            : sectionBanners
              ? sectionBanners?.map((banner, index) => (
                  <img
                    key={index}
                    src={getSectionBanner(banner)}
                    alt="Section banner."
                    className="rounded-sm w-8 h-5"
                  />
                ))
              : "N/A"}
        </div>
      </td>
      {/* Status */}
      <td className="w-[10%]">
        <div className="w-full flex items-center justify-center">
          <AssessmentStatus status={assessment.status} />
        </div>
      </td>
      {/* Deadline */}
      <td
        className={`w-[10%] text-center ${assessment.date.end ? "" : "text-gray-400"}`}
      >
        {assessment.date.end
          ? format(new Date(assessment.date.end), "MMM d 'at' h:mm a", {
              timeZone: "Asia/Manila",
            })
          : "N/A"}
      </td>
      <td className="w-[5%] text-center relative">
        <button
          className="hover:scale-110 hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
        >
          <HiDotsVertical />
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-20 w-28 top-0 bg-white border border-gray-200 rounded shadow-md z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`w-full text-left px-3 py-2 hover:bg-gray-100 hover:cursor-pointer ${assessment.status !== "draft" ? "hidden" : "block"}`}
              onClick={() => navigate(`${assessment.id}/create`)}
            >
              Edit
            </button>
            <button
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500 hover:cursor-pointer"
              type="button"
              onClick={handleDeleteAssessment}
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
