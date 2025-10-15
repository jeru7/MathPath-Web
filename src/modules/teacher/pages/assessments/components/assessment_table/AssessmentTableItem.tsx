import { useEffect, useRef, useState, type ReactElement } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { getSectionBanner } from "../../../../../core/utils/section/section.util";
import { useNavigate, useParams } from "react-router-dom";
import { useTeacherSections } from "../../../../services/teacher.service";
import AssessmentStatus from "./AssessmentStatus";
import { format } from "date-fns-tz";

type AssessmentTableItemProps = {
  assessment: Assessment;
  onAssessmentClick?: (assessment: Assessment) => void;
  onDeleteAssessment?: (assessment: Assessment) => void;
};

export default function AssessmentTableItem({
  assessment,
  onAssessmentClick,
  onDeleteAssessment,
}: AssessmentTableItemProps): ReactElement {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const { data: sections } = useTeacherSections(teacherId ?? "");

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const sectionBanners = sections
    ?.filter((section) => assessment.sections.includes(section.id))
    .map((section) => section.banner);

  const handleRowClick = () => {
    if (onAssessmentClick) {
      onAssessmentClick(assessment);
    } else {
      navigate(`${assessment.id}`);
    }
  };

  const handleDeleteAssessment = () => {
    if (onDeleteAssessment) {
      onDeleteAssessment(assessment);
    }
    setMenuOpen(false);
  };

  const handleEdit = () => {
    if (assessment.status === "draft") {
      navigate(`${assessment.id}/create`);
    }
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
    <>
      <tr
        className="w-full font-medium text-sm xl:text-base hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer overflow-visible transition-colors duration-200"
        onClick={handleRowClick}
      >
        {/* title */}
        <td className="w-[15%] xl:w-[20%]">
          <div
            title={assessment.title ? assessment.title : "(No title)"}
            className={`truncate whitespace-nowrap overflow-hidden max-w-[500px] ${
              assessment.title
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {assessment.title ? assessment.title : "(No title)"}
          </div>
        </td>
        {/* topic */}
        <td className="w-[15%] xl:w-[20%]">
          <div
            title={assessment.topic ? assessment.topic : "(No title)"}
            className={`truncate whitespace-nowrap overflow-hidden max-w-[400px] ${
              assessment.topic
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {assessment.topic ? assessment.topic : "(No topic)"}
          </div>
        </td>
        {/* section */}
        <td className="w-[15%]">
          <div
            className={`flex gap-2 justify-center ${
              assessment.sections.length === 0
                ? "text-gray-400 dark:text-gray-500"
                : ""
            }`}
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
        {/* status */}
        <td className="w-[10%]">
          <div className="w-full flex items-center justify-center">
            <AssessmentStatus status={assessment.status} />
          </div>
        </td>
        {/* deadline */}
        <td
          className={`w-[10%] text-center ${
            assessment.date.end
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {assessment.date.end
            ? format(new Date(assessment.date.end), "MMM d 'at' h:mm a", {
                timeZone: "Asia/Manila",
              })
            : "N/A"}
        </td>
        <td className="w-[5%] text-center relative">
          <button
            className="hover:scale-110 hover:cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-200"
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
              className="absolute right-20 w-28 top-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded shadow-md z-50 transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer text-gray-900 dark:text-gray-100 transition-colors duration-200 ${
                  assessment.status !== "draft" ? "hidden" : "block"
                }`}
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 dark:text-red-400 hover:cursor-pointer transition-colors duration-200"
                type="button"
                onClick={handleDeleteAssessment}
              >
                Delete
              </button>
            </div>
          )}
        </td>
      </tr>
    </>
  );
}
