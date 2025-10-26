import { type ReactElement, useEffect, useState } from "react";
import { useAdminContext } from "../../context/admin.context";
import {
  FaCheck,
  FaXmark,
  FaEnvelope,
  FaCalendar,
  FaVenusMars,
  FaUsers,
  FaClock,
  FaPlay,
  FaEye,
} from "react-icons/fa6";
import { Teacher } from "../../../teacher/types/teacher.type";
import { Section } from "../../../core/types/section/section.type";
import { format } from "date-fns-tz";
import { TIMEZONE } from "../../../core/constants/date.constant";
import { getProfilePicture } from "../../../core/utils/profile-picture.util";
import ModalOverlay from "../../../core/components/modal/ModalOverlay";
import {
  Assessment,
  AssessmentStatus,
} from "../../../core/types/assessment/assessment.type";
import { FaFileAlt, FaPencilAlt, FaTimes } from "react-icons/fa";
import { getSectionBanner } from "../../../core/utils/section/section.util";
import FooterActions from "../../../core/components/modal/FooterActions";

type TeacherDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string | null;
};

type StatusConfig = {
  color: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ASSESSMENT_STATUS_CONFIG: Record<AssessmentStatus, StatusConfig> = {
  draft: {
    color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    icon: FaPencilAlt,
  },
  "in-progress": {
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    icon: FaPlay,
  },
  published: {
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    icon: FaEye,
  },
  finished: {
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    icon: FaCheck,
  },
};

export default function TeacherDetailsModal({
  isOpen,
  onClose,
  teacherId,
}: TeacherDetailsModalProps): ReactElement {
  const { teachers, sections, assessments } = useAdminContext();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [teacherSections, setTeacherSections] = useState<Section[]>([]);
  const [teacherAssessments, setTeacherAssessments] = useState<Assessment[]>(
    [],
  );

  useEffect(() => {
    if (isOpen && teacherId) {
      const foundTeacher = teachers.find((t) => t.id === teacherId);
      setTeacher(foundTeacher || null);

      if (foundTeacher) {
        const assignedSections = sections.filter((section) =>
          section?.teacherIds?.includes(foundTeacher.id),
        );
        setTeacherSections(assignedSections);

        const teacherAssessments = assessments.filter(
          (assessment) => assessment.teacher === foundTeacher.id,
        );
        setTeacherAssessments(teacherAssessments);
      } else {
        setTeacherSections([]);
        setTeacherAssessments([]);
      }
    } else {
      setTeacher(null);
      setTeacherSections([]);
      setTeacherAssessments([]);
    }
  }, [isOpen, teacherId, teachers, sections, assessments]);

  const getFullName = () => {
    if (!teacher) return "";
    return `${teacher.lastName}, ${teacher.firstName}${teacher.middleName ? ` ${teacher.middleName}` : ""
      }`.trim();
  };

  const getSectionColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "primary-green": "border-l-green-500",
      "tertiary-green": "border-l-emerald-500",
      "primary-orange": "border-l-orange-500",
      "primary-yellow": "border-l-yellow-500",
    };
    return colorMap[color] || "border-l-gray-500";
  };

  const getAssessmentStatusConfig = (
    status: AssessmentStatus,
  ): StatusConfig => {
    return ASSESSMENT_STATUS_CONFIG[status] || ASSESSMENT_STATUS_CONFIG.draft;
  };

  const formatTimeLimit = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  // TODO: edit, archive and delete teacher
  const handleEdit = () => {
    console.log("Edit teacher:", teacher?.id);
  };

  const handleArchive = () => {
    console.log("Archive teacher:", teacher?.id);
  };

  const handleDelete = () => {
    console.log("Delete teacher:", teacher?.id);
  };

  const renderSectionCard = (section: Section) => {
    const teacherCount = section?.teacherIds?.length || 0;

    return (
      <div
        key={section.id}
        className={`bg-white dark:bg-gray-800 rounded-sm border-l-4 border border-y-gray-300 border-r-gray-300 dark:border-y-gray-700 dark:border-r-gray-700 ${getSectionColorClass(
          section.color,
        )} border p-4`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
              {section.name || "Unnamed Section"}
            </h4>
            <div className="w-20 object-contain overflow-hidden rounded-sm">
              <img
                src={getSectionBanner(section.banner)}
                alt="Section banner"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <FaUsers className="w-3 h-3" />
              <span>
                {teacherCount} teacher{teacherCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaCalendar className="w-3 h-3" />
              <span>
                {format(new Date(section.updatedAt), "MMM d, yyyy", {
                  timeZone: TIMEZONE,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAssessmentCard = (assessment: Assessment) => {
    const statusConfig = getAssessmentStatusConfig(assessment.status);
    const StatusIcon = statusConfig.icon;
    const totalQuestions = assessment.pages.reduce((count, page) => {
      return (
        count +
        page.contents.filter((content) => content.type === "question").length
      );
    }, 0);

    return (
      <div
        key={assessment.id}
        className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
              {assessment.title || "Untitled Assessment"}
            </h4>
            {assessment.topic && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {assessment.topic}
              </p>
            )}
          </div>
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} flex-shrink-0`}
          >
            <StatusIcon className="w-3 h-3" />
            <span className="capitalize">
              {assessment.status.replace("-", " ")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-2">
            <FaFileAlt className="w-3 h-3 opacity-70" />
            <span>{totalQuestions} Qs</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="w-3 h-3 opacity-70" />
            <span>{formatTimeLimit(assessment.timeLimit)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUsers className="w-3 h-3 opacity-70" />
            <span>
              {assessment.sections.length} section
              {assessment.sections.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheck className="w-3 h-3 opacity-70" />
            <span>{assessment.passingScore}% pass</span>
          </div>
        </div>

        {assessment.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {assessment.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span>
            {format(new Date(assessment.createdAt), "MMM d, yyyy", {
              timeZone: TIMEZONE,
            })}
          </span>
          {assessment.date.start && (
            <span>
              {format(new Date(assessment.date.start), "MMM d")}
              {assessment.date.end &&
                ` - ${format(new Date(assessment.date.end), "MMM d")}`}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm min-w-7xl h-[85vh] overflow-hidden flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 overflow-hidden">
                {teacher && (
                  <img
                    src={getProfilePicture(teacher.profilePicture ?? "Default")}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {teacher?.verified.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <FaCheck className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {teacher ? getFullName() : "Teacher Details"}
              </h1>
              {teacher && (
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaEnvelope className="w-4 h-4" />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaVenusMars className="w-4 h-4" />
                    <span>{teacher.gender}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${teacher.verified.verified
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                      }`}
                  >
                    {teacher.verified.verified ? (
                      <>
                        <FaCheck className="w-3 h-3" />
                        <span className="font-medium">Verified</span>
                      </>
                    ) : (
                      <>
                        <FaXmark className="w-3 h-3" />
                        <span className="font-medium">Unverified</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* close button */}
          <button
            onClick={onClose}
            className="self-start p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm transition-colors duration-200"
          >
            <FaTimes className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {!teacher ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaTimes className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Teacher Not Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                The requested teacher information could not be loaded.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {/* sections */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Sections
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                    {teacherSections.length} sections
                  </span>
                </div>

                {teacherSections.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {teacherSections.map(renderSectionCard)}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <FaUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">
                      No Sections
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      This teacher is not currently assigned to any sections.
                    </p>
                  </div>
                )}
              </div>

              {/* assessments */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Teacher Assessments
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                    {teacherAssessments.length} assessments
                  </span>
                </div>

                {teacherAssessments.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {teacherAssessments.map(renderAssessmentCard)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-sm p-8 text-center border-2 min-h-64 border-dashed border-gray-200 dark:border-gray-700">
                    <FaFileAlt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">
                      No Assessments Created
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      This teacher hasn't created any assessments yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {teacher && (
              <>
                <span>Last updated:</span>
                <span className="font-medium">
                  {format(
                    new Date(teacher.updatedAt),
                    "MMM d, yyyy 'at' h:mm a",
                    {
                      timeZone: TIMEZONE,
                    },
                  )}
                </span>
              </>
            )}
          </div>

          {/* action buttons */}
          {teacher && (
            <FooterActions
              lastUpdated={teacher?.updatedAt}
              onEdit={handleEdit}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}
