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
import { Assessment } from "../../../core/types/assessment/assessment.type";
import { FaFileAlt, FaTimes } from "react-icons/fa";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const { teachers, rawSections, rawAssessments, rawStudents, adminId } =
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
    return rawStudents.filter((student) => student.sectionId === sectionId)
      .length;
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
        const assignedSections = rawSections.filter((section) =>
          section?.teacherIds?.includes(foundTeacher.id),
        );
        setTeacherSections(assignedSections);

        const teacherAssessments = rawAssessments.filter(
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
  }, [isOpen, teacherId, teachers, rawSections, rawAssessments, rawStudents]);

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
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[100dvw] h-[100dvh] max-w-none flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 overflow-hidden">
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
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <FaCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  {teacher ? getFullName() : "Teacher Details"}
                </DialogTitle>
                {teacher && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FaEnvelope className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FaVenusMars className="w-4 h-4 flex-shrink-0" />
                      <span>{teacher.gender}</span>
                    </div>
                    <Badge
                      variant={
                        teacher.verified.verified ? "default" : "secondary"
                      }
                      className={`${teacher.verified.verified
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                        }`}
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
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6">
            {!teacher ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaTimes className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Teacher Not Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  The requested teacher information could not be loaded.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* sections */}
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Sections
                    </h2>
                    <Badge variant="outline">
                      {teacherSections.length} section
                      {teacherSections.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {teacherSections.length > 0 ? (
                    <div className="h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-sm p-4">
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
                    <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-sm border-2 border-dashed border-gray-200 dark:border-gray-700 p-6">
                      <div className="text-center">
                        <FaUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">
                          No Sections
                        </h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm">
                          This teacher is not currently assigned to any
                          sections.
                        </p>
                      </div>
                    </div>
                  )}
                </Card>

                {/* assessments */}
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Teacher Assessments
                    </h2>
                    <Badge variant="outline">
                      {teacherAssessments.length} assessment
                      {teacherAssessments.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {teacherAssessments.length > 0 ? (
                    <div className="h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-sm p-4">
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
                    <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-sm border-2 border-dashed border-gray-200 dark:border-gray-700 p-6">
                      <div className="text-center">
                        <FaFileAlt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">
                          No Assessments Created
                        </h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm">
                          This teacher hasn't created any assessments yet.
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>

          {/* action buttons */}
          {teacher && (
            <div className="border-t pt-4 mt-4 flex-shrink-0 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center justify-between">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Badge variant="outline" className="text-xs">
                  Last updated:{" "}
                  {new Date(teacher.updatedAt).toLocaleDateString()}
                </Badge>
              </div>
              <div className="flex gap-2 justify-center sm:justify-end">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={handleArchive}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  Archive
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
