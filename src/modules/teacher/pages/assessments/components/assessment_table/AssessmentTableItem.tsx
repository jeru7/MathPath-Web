import { useEffect, useRef, useState, type ReactElement } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { getSectionBanner } from "../../../../../core/utils/section/section.util";
import { useNavigate, useParams } from "react-router-dom";
import { useTeacherSections } from "../../../../services/teacher.service";
import AssessmentStatus from "./AssessmentStatus";
import { format } from "date-fns-tz";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteAssessment } from "../../../../services/teacher-assessment.service";

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
  const [showWarning, setShowWarning] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const sectionBanners = sections
    ?.filter((section) => assessment.sections.includes(section.id))
    .map((section) => section.banner);

  const handleDeleteAssessment = () => {
    if (assessment.status !== "draft") {
      setShowWarning(true);
      setMenuOpen(false);
      return;
    }

    proceedWithDeletion();
  };

  const proceedWithDeletion = () => {
    deleteAssessment(assessment.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "assessments"],
        });
      },
    });
    setShowWarning(false);
    setMenuOpen(false);
  };

  const cancelDeletion = () => {
    setShowWarning(false);
  };

  const getWarningMessage = () => {
    switch (assessment.status) {
      case "published":
        return "This assessment has been published and is currently active. Deleting it will remove it from all assigned sections. Are you sure you want to continue?";
      case "in-progress":
        return "This assessment is currently in progress by students. Deleting it may disrupt ongoing assessments. Are you sure you want to continue?";
      default:
        return "Are you sure you want to delete this assessment?";
    }
  };

  const getWarningTitle = () => {
    switch (assessment.status) {
      case "published":
        return "Delete Published Assessment";
      case "in-progress":
        return "Delete In-Progress Assessment";
      default:
        return "Delete Assessment";
    }
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
        onClick={() => navigate(`${assessment.id}`)}
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
                onClick={() => navigate(`${assessment.id}/create`)}
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

      {/* TODO: separate file component */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm shadow-sm max-w-md w-full p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {getWarningTitle()}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {getWarningMessage()}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDeletion}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-sm hover:cursor-pointer transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={proceedWithDeletion}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-sm hover:cursor-pointer transition-colors duration-200"
                >
                  Delete Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
