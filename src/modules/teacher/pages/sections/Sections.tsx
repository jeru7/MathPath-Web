import { useEffect, useState, type ReactElement } from "react";
import CreateSectionForm from "./components/CreateSectionForm";
import { useTeacherContext } from "../../context/teacher.context";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Section } from "../../../core/types/section/section.type";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  useTeacherDeleteSection,
  useTeacherEditSection,
  useTeacherArchiveSection,
  useTeacherRestoreSection,
} from "../../services/teacher-section.service";
import SectionTable from "../../../core/components/tables/section-table/SectionTable";
import SectionDetailsModal from "../../../core/components/tables/section-table/SectionDetailsModal";
import { getStudentCountForSection } from "../../../core/utils/section/section.util";
import DeleteSectionConfirmationModal from "../../../core/components/tables/section-table/DeleteSectionConfirmationModal";
import EditSectionModal from "../../../core/components/tables/section-table/EditSectionModal";
import { EditSectionDTO } from "../../../core/types/section/section.schema";
import { APIErrorResponse } from "../../../core/types/api/api.type";
import { handleApiError } from "../../../core/utils/api/error.util";
import SectionArchiveModal from "../../../core/components/tables/section-table/section-archive/SectionArchiveModal";
import SectionArchiveConfirmationModal from "../../../core/components/tables/section-table/SectionArchiveConfirmationModal";

export default function Sections(): ReactElement {
  const teacherContext = useTeacherContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId } = useParams();
  const {
    rawSections,
    archivedSections,
    allStudents,
    archivedStudents,
    teacherId,
    rawAssessments,
  } = teacherContext;
  const { mutate: deleteSection } = useTeacherDeleteSection(teacherId);
  const { mutate: editSection, isPending: isEditPending } =
    useTeacherEditSection(teacherId);
  const queryClient = useQueryClient();

  const { mutate: archiveSection } = useTeacherArchiveSection(teacherId);
  const { mutate: restoreSection } = useTeacherRestoreSection(teacherId);

  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
  const [sectionToArchive, setSectionToArchive] = useState<Section | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [hideFab, setHideFab] = useState<boolean>(false);

  const pathEnd = location.pathname.split("/").pop();
  const isCreateSectionRoute = pathEnd === "add-section";
  const isSectionDetailsRoute =
    selectedSection !== null && pathEnd === selectedSection.id;
  const showArchiveRoute = location.pathname.endsWith("/archives");

  useEffect(() => {
    if (sectionId) {
      const section = rawSections.find((s) => s.id === sectionId);
      setSelectedSection(section || null);
    } else {
      setSelectedSection(null);
    }
  }, [sectionId, rawSections]);

  useEffect(() => {
    if (isCreateSectionRoute || showArchiveRoute) {
      setHideFab(true);
    } else {
      setHideFab(false);
    }
  }, [isCreateSectionRoute, showArchiveRoute]);

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);
    navigate(section.id);
  };

  const handleCloseDetailsModal = () => {
    navigate("..");
    setSelectedSection(null);
  };

  const handleCreateSection = () => {
    navigate("add-section");
  };

  const handleCloseCreateModal = () => {
    navigate("..");
  };

  const handleDeleteInitiate = (section: Section) => {
    setSectionToDelete(section);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (sectionToDelete) {
      deleteSection(sectionToDelete.id, {
        onSuccess: () => {
          toast.success("Section deleted successfully.");
          queryClient.invalidateQueries({
            queryKey: ["teacher", teacherId, "sections"],
          });
          setIsDeleteModalOpen(false);
          setSectionToDelete(null);

          if (selectedSection?.id === sectionToDelete.id) {
            navigate("..");
            setSelectedSection(null);
          }
        },
        onError: (error) => {
          toast.error("Failed to delete section.");
          console.error("Delete section error:", error);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSectionToDelete(null);
  };

  // Archive handlers
  const handleArchiveInitiate = (section: Section) => {
    setSectionToArchive(section);
    setIsArchiveModalOpen(true);
  };

  const handleArchiveConfirm = () => {
    if (sectionToArchive) {
      archiveSection(sectionToArchive.id, {
        onSuccess: () => {
          toast.success("Section archived successfully.");
          queryClient.invalidateQueries({
            queryKey: ["teacher", teacherId, "sections"],
          });
          queryClient.invalidateQueries({
            queryKey: ["teacher", teacherId, "archived-sections"],
          });
          queryClient.invalidateQueries({
            queryKey: ["teacher", teacherId, "archived-students"],
          });
          queryClient.invalidateQueries({
            queryKey: ["teacher", teacherId, "students"],
          });
          setIsArchiveModalOpen(false);
          setSectionToArchive(null);

          if (selectedSection?.id === sectionToArchive.id) {
            navigate("..");
            setSelectedSection(null);
          }
        },
        onError: (error) => {
          toast.error("Failed to archive section.");
          console.error("Archive section error:", error);
        },
      });
    }
  };

  const handleArchiveCancel = () => {
    setIsArchiveModalOpen(false);
    setSectionToArchive(null);
  };

  const handleRestoreSection = (sectionId: string) => {
    restoreSection(sectionId, {
      onSuccess: () => {
        toast.success("Section restored successfully");
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "sections"],
        });
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "archived-sections"],
        });
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "archived-students"],
        });
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "students"],
        });
      },
      onError: () => {
        toast.error("Failed to restore section");
      },
    });
  };

  const handlePermanentDelete = (sectionId: string) => {
    deleteSection(sectionId, {
      onSuccess: () => {
        toast.success("Section permanently deleted");
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "sections"],
        });
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "archived-sections"],
        });
      },
      onError: () => {
        toast.error("Failed to delete section");
      },
    });
  };

  const handleEditInitiate = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdateSection = async (
    sectionId: string,
    data: EditSectionDTO,
  ) => {
    return new Promise<void>((resolve, reject) => {
      editSection(
        { sectionId, sectionData: data },
        {
          onSuccess: () => {
            toast.success("Section updated successfully.");
            queryClient.invalidateQueries({
              queryKey: ["teacher", teacherId, "sections"],
            });
            resolve();
          },
          onError: (error: unknown) => {
            const errorData: APIErrorResponse = handleApiError(error);

            if (errorData.error === "SECTION_NAME_TAKEN") {
              toast.error("A section with this name already exists.");
            } else if (errorData.error === "INVALID_SECTION_COLOR") {
              toast.error("Invalid section color provided.");
            } else if (errorData.error === "INVALID_SECTION_BANNER") {
              toast.error("Invalid section banner provided.");
            } else {
              toast.error("Failed to update section.");
            }

            reject(error);
          },
        },
      );
    });
  };

  return (
    <main className="flex flex-col h-full min-h-screen w-full gap-2 bg-inherit p-2 mt-4 md:mt-0">
      {/* header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
          Sections
        </h3>
      </header>

      {/* section grid list */}
      <section className="flex-1 flex bg-inherit">
        <SectionTable
          userType="teacher"
          context={teacherContext}
          sections={rawSections}
          onShowForm={handleCreateSection}
          onSectionClick={handleSectionClick}
          showArchive={true}
          hideFab={hideFab}
        />
      </section>

      {/* create section modal */}
      <CreateSectionForm
        isOpen={isCreateSectionRoute}
        onClose={handleCloseCreateModal}
      />

      {/* archive modal */}
      {showArchiveRoute && archivedSections && (
        <SectionArchiveModal
          isOpen={showArchiveRoute}
          onClose={() => navigate("..")}
          sections={archivedSections}
          onRestoreSection={handleRestoreSection}
          onDeleteSection={handlePermanentDelete}
          context={teacherContext}
        />
      )}

      {/* section details modal */}
      {selectedSection && (
        <SectionDetailsModal
          context={teacherContext}
          section={selectedSection}
          isOpen={isSectionDetailsRoute}
          onClose={handleCloseDetailsModal}
          sections={rawSections}
          onEdit={handleEditInitiate}
          onDelete={() => handleDeleteInitiate(selectedSection)}
          onArchive={() => handleArchiveInitiate(selectedSection)}
        />
      )}

      {/* edit section modal */}
      {selectedSection && (
        <EditSectionModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          section={selectedSection}
          onUpdateSection={handleUpdateSection}
          isSubmitting={isEditPending}
        />
      )}

      {/* delete confirmation modal */}
      <DeleteSectionConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        section={sectionToDelete}
        studentCount={getStudentCountForSection(sectionToDelete, allStudents)}
      />

      {/* archive confirmation modal */}
      <SectionArchiveConfirmationModal
        isOpen={isArchiveModalOpen}
        onClose={handleArchiveCancel}
        onConfirm={handleArchiveConfirm}
        section={sectionToArchive}
        students={archivedStudents}
        assessments={rawAssessments}
      />
    </main>
  );
}
