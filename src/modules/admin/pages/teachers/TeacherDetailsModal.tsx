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
import EditTeacherModal from "./EditTeacherModal";
import { EditTeacherDTO } from "../../../teacher/types/teacher.schema";
import {
  useAdminEditTeacher,
  useAdminDeleteTeacher,
} from "../../services/admin-teacher.service";
import { toast } from "react-toastify";
import DeleteTeacherConfirmationModal from "./DeleteTeacherConfirmationModal";
import { useQueryClient } from "@tanstack/react-query";

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
  const { teachers, sections, assessments, students, adminId } =
    useAdminContext();
  const queryClient = useQueryClient();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [teacherSections, setTeacherSections] = useState<Section[]>([]);
  const [teacherAssessments, setTeacherAssessments] = useState<Assessment[]>(
    [],
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutate: updateTeacher, isPending: isUpdating } =
    useAdminEditTeacher(adminId);
  const { mutate: deleteTeacher, isPending: isDeleting } =
    useAdminDeleteTeacher(adminId);

  const getSectionStudentCount = (sectionId: string) => {
    return students.filter((student) => student.sectionId === sectionId).length;
  };

  // calculate total students in teacher's sections
  const totalStudentsInSections = teacherSections.reduce((total, section) => {
    return total + getSectionStudentCount(section.id);
  }, 0);

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
  }, [isOpen, teacherId, teachers, sections, assessments, students]);

  const getFullName = () => {
    if (!teacher) return "";
    return `${teacher.lastName}, ${teacher.firstName}${teacher.middleName ? ` ${teacher.middleName}` : ""
      }`.trim();
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleArchive = () => {
    console.log("Archive teacher:", teacher?.id);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!teacher) return;

    deleteTeacher(teacher.id, {
      onSuccess: () => {
        toast.success("Teacher deleted successfully");
        setIsDeleteModalOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "teachers"],
        });
        onClose();
      },
      onError: (error) => {
        console.error("Failed to delete teacher:", error);
        toast.error("Failed to delete teacher");
      },
    });
  };

  const handleUpdateTeacher = async (
    teacherId: string,
    data: EditTeacherDTO,
  ) => {
    return new Promise<void>((resolve, reject) => {
      updateTeacher(
        { teacherId, teacherData: data },
        {
          onSuccess: (updatedTeacher) => {
            setTeacher(updatedTeacher);
            resolve();
          },
          onError: (error) => {
            console.error("Failed to update teacher:", error);
            reject(error);
          },
        },
      );
    });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm h-[100dvh] w-[100dvw] md:h-[90dvh] md:w-[90dvw] lg:w-[85dvw] xl:w-[80dvw] md:max-w-7xl md:max-h-[800px] overflow-hidden flex flex-col">
          {/* header */}
          <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 overflow-hidden">
                    {teacher && (
                      <img
                        src={getProfilePicture(
                          teacher.profilePicture ?? "Default",
                        )}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {teacher?.verified.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <FaCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                    {teacher ? getFullName() : "Teacher Details"}
                  </h1>
                  {teacher && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                      <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        <FaEnvelope className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        <FaVenusMars className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>{teacher.gender}</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 text-sm sm:text-base px-3 py-1.5 rounded-full ${teacher.verified.verified
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                          } w-fit`}
                      >
                        {teacher.verified.verified ? (
                          <>
                            <FaCheck className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="font-medium">Verified</span>
                          </>
                        ) : (
                          <>
                            <FaXmark className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="font-medium">Unverified</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* close button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm transition-colors duration-200 ml-2"
            >
              <FaTimes className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {!teacher ? (
              <div className="text-center py-16 sm:py-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaTimes className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Teacher Not Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  The requested teacher information could not be loaded.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {/* sections */}
                <div className="flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Sections
                    </h2>
                    <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full w-fit">
                      {teacherSections.length} section
                      {teacherSections.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {teacherSections.length > 0 ? (
                    <div className="h-80 sm:h-96 lg:h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-sm p-4 sm:p-6">
                      <div className="space-y-4 sm:space-y-6">
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
                    <div className="h-80 sm:h-96 lg:h-[500px] flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-sm border-2 border-dashed border-gray-200 dark:border-gray-700 p-6">
                      <div className="text-center">
                        <FaUsers className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2 text-base sm:text-lg">
                          No Sections
                        </h3>
                        <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500 max-w-sm">
                          This teacher is not currently assigned to any
                          sections.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* assessments */}
                <div className="flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Teacher Assessments
                    </h2>
                    <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full w-fit">
                      {teacherAssessments.length} assessment
                      {teacherAssessments.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {teacherAssessments.length > 0 ? (
                    <div className="h-80 sm:h-96 lg:h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-sm p-4 sm:p-6">
                      <div className="grid gap-4 sm:gap-6">
                        {teacherAssessments.map((assessment) => (
                          <AssessmentCard
                            key={assessment.id}
                            assessment={assessment}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-80 sm:h-96 lg:h-[500px] flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-sm border-2 border-dashed border-gray-200 dark:border-gray-700 p-6">
                      <div className="text-center">
                        <FaFileAlt className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2 text-base sm:text-lg">
                          No Assessments Created
                        </h3>
                        <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500 max-w-sm">
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

      {/* edit teacher modal */}
      <EditTeacherModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        teacher={teacher}
        onUpdateTeacher={handleUpdateTeacher}
        isSubmitting={isUpdating}
      />

      {/* delete teacher confirmation modal */}
      <DeleteTeacherConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        teacher={teacher}
        sectionsCount={teacherSections.length}
        assessmentsCount={teacherAssessments.length}
        studentsCount={totalStudentsInSections}
        isDeleting={isDeleting}
      />
    </>
  );
}
