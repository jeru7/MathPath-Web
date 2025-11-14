import { useEffect, useState, type ReactElement } from "react";
import { useAdminContext } from "../../context/admin.context";
import { AnimatePresence, motion } from "framer-motion";
import { GoPlus } from "react-icons/go";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Section } from "../../../core/types/section/section.type";
import CreateSectionForm from "./CreateSectionForm";
import SectionTable from "../../../core/components/tables/section-table/SectionTable";
import SectionDetailsModal from "../../../core/components/tables/section-table/SectionDetailsModal";
import DeleteSectionConfirmationModal from "../../../core/components/tables/section-table/DeleteSectionConfirmationModal";
import {
  useAdminArchiveSection,
  useAdminDeleteSection,
  useAdminEditSection,
  useAdminRestoreSection,
} from "../../services/admin-section.service";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { getStudentCountForSection } from "../../../core/utils/section/section.util";
import { EditSectionDTO } from "../../../core/types/section/section.schema";
import { APIErrorResponse } from "../../../core/types/api/api.type";
import { handleApiError } from "../../../core/utils/api/error.util";
import EditSectionModal from "../../../core/components/tables/section-table/EditSectionModal";
import SectionArchiveModal from "../../../core/components/tables/section-table/section-archive/SectionArchiveModal";
import SectionArchiveConfirmationModal from "../../../core/components/tables/section-table/SectionArchiveConfirmationModal";

export default function Sections(): ReactElement {
  const adminContext = useAdminContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId } = useParams();
  const {
    rawSections,
    archivedSections,
    rawStudents,
    archivedStudents,
    adminId,
    rawAssessments,
    rawTeachers,
  } = adminContext;
  const queryClient = useQueryClient();

  const { mutate: deleteSection } = useAdminDeleteSection(adminId);
  const { mutate: editSection, isPending: isUpdating } =
    useAdminEditSection(adminId);
  const { mutate: archiveSection } = useAdminArchiveSection(adminId);
  const { mutate: restoreSection } = useAdminRestoreSection(adminId);

  const [showAddButton, setShowAddButton] = useState<boolean>(false);
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

  // calculate exclusive assessment count for the section to delete
  const getExclusiveAssessmentCount = (section: Section | null): number => {
    if (!section) return 0;

    return rawAssessments.filter(
      (assessment) =>
        assessment.sections.includes(section.id) &&
        assessment.sections.length === 1,
    ).length;
  };

  useEffect(() => {
    if (sectionId) {
      const section = rawSections.find((s) => s.id === sectionId);
      setSelectedSection(section || null);
    } else {
      setSelectedSection(null);
    }
  }, [sectionId, rawSections]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const atBottom = scrollPosition >= pageHeight - 10;

      setShowAddButton(!atBottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSectionToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (sectionToDelete) {
      deleteSection(sectionToDelete.id, {
        onSuccess: () => {
          toast.success("Section deleted successfully.");
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "sections"],
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
            queryKey: ["admin", adminId, "sections"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "archived-sections"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "archived-students"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "students"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "assessments"],
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
          queryKey: ["admin", adminId, "sections"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "archived-sections"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "archived-students"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "students"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "assessments"],
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
          queryKey: ["admin", adminId, "sections"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "archived-sections"],
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
              queryKey: ["admin", adminId, "sections"],
            });
            resolve();
          },
          onError: (error: unknown) => {
            const errorData: APIErrorResponse = handleApiError(error);

            // handle specific error cases
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
    <main className="flex flex-col h-full min-h-screen w-full mt-4 md:mt-4 gap-2 bg-inherit p-2">
      <AnimatePresence>
        {showAddButton && !hideFab && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 100, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-full h-16 w-16 bg-[var(--primary-green)]/90 fixed z-5 right-5 bottom-5 flex items-center justify-center md:hidden"
            type="button"
            onClick={handleCreateSection}
          >
            <GoPlus className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          Sections
        </h3>
      </header>

      {/* section grid list */}
      <section className="flex-1 flex ">
        <SectionTable
          userType="admin"
          context={adminContext}
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
          context={adminContext}
        />
      )}

      {/* section details modal */}
      {selectedSection && (
        <SectionDetailsModal
          context={adminContext}
          isAdmin={true}
          section={selectedSection}
          isOpen={isSectionDetailsRoute}
          onClose={handleCloseDetailsModal}
          sections={rawSections}
          teachers={rawTeachers}
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
          isSubmitting={isUpdating}
        />
      )}

      {/* delete section confirmation modal */}
      <DeleteSectionConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        section={sectionToDelete}
        studentCount={getStudentCountForSection(sectionToDelete, rawStudents)}
        assessmentCount={getExclusiveAssessmentCount(sectionToDelete)}
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
