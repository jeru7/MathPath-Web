import { type ReactElement, useEffect, useState } from "react";
import { useAdminContext } from "../../context/admin.context";
import {
  FaCheck,
  FaXmark,
  FaEnvelope,
  FaVenusMars,
  FaUsers,
} from "react-icons/fa6";
import { Teacher } from "../../../teacher/types/teacher.type";
import { Section } from "../../../core/types/section/section.type";
import { getProfilePicture } from "../../../core/utils/profile-picture.util";
import ModalOverlay from "../../../core/components/modal/ModalOverlay";
import { Assessment } from "../../../core/types/assessment/assessment.type";
import { FaFileAlt, FaTimes } from "react-icons/fa";
import FooterActions from "../../../core/components/modal/FooterActions";
import SectionCard from "./SectionCard";
import AssessmentCard from "./AssessmentCard";

type TeacherDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string | null;
};
export default function TeacherDetailsModal({
  isOpen,
  onClose,
  teacherId,
}: TeacherDetailsModalProps): ReactElement {
  const { teachers, sections, assessments, students } = useAdminContext();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [teacherSections, setTeacherSections] = useState<Section[]>([]);
  const [teacherAssessments, setTeacherAssessments] = useState<Assessment[]>(
    [],
  );

  const getSectionStudentCount = (sectionId: string) => {
    return students.filter((student) => student.sectionId === sectionId).length;
  };

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
            <div className="flex flex-col gap-8">
              {/* sections */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Sections
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                    {teacherSections.length} sections
                  </span>
                </div>

                {teacherSections.length > 0 ? (
                  <div className="h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-sm p-4">
                    <div className="space-y-4">
                      {teacherSections.map((section) => (
                        <SectionCard
                          key={section.id}
                          section={section}
                          studentCount={getSectionStudentCount(section.id)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-sm border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <FaUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">
                        No Sections
                      </h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        This teacher is not currently assigned to any sections.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* assessments */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Teacher Assessments
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                    {teacherAssessments.length} assessments
                  </span>
                </div>

                {teacherAssessments.length > 0 ? (
                  <div className="h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-sm p-4">
                    <div className="grid gap-4">
                      {teacherAssessments.map((assessment) => (
                        <AssessmentCard
                          key={assessment.id}
                          assessment={assessment}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-sm border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <FaFileAlt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">
                        No Assessments Created
                      </h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        This teacher hasn't created any assessments yet.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
    </ModalOverlay>
  );
}
