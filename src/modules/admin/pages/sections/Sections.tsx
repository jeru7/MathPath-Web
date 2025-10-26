import { useEffect, useState, type ReactElement } from "react";
import { useAdminContext } from "../../context/admin.context";
import { AnimatePresence, motion } from "framer-motion";
import { GoPlus } from "react-icons/go";
import { useNavigate, useLocation } from "react-router-dom";
import { Section } from "../../../core/types/section/section.type";
import CreateSectionForm from "./CreateSectionForm";
import SectionTable from "../../../core/components/section-table/SectionTable";
import SectionDetailsModal from "../../../core/components/section-table/SectionDetailsModal";
import DeleteConfirmationModal from "../../../core/components/section-table/DeleteSectionConfirmationModal";
import { useAdminDeleteSection } from "../../services/admin-section.service";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { getStudentCountForSection } from "../../../core/utils/section/section.util";

export default function Sections(): ReactElement {
  const adminContext = useAdminContext();
  const { sections, adminId, students } = adminContext;
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { mutate: deleteSection } = useAdminDeleteSection(adminId);

  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
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
        },
        onError: (error) => {
          toast.error("Failed to delete section.");
          console.error("Delete section error:", error);
        },
      });
    }
  };

  const isCreateSectionRoute = location.pathname.endsWith("/add-section");

  return (
    <main className="flex flex-col h-full min-h-screen w-full max-w-[2400px] gap-2 bg-inherit p-2">
      <AnimatePresence>
        {showAddButton && (
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
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
          Sections
        </h3>
      </header>

      {/* section grid list */}
      <section className="flex-1 flex bg-white border border-white dark:bg-gray-800 dark:border-gray-700 rounded-sm shadow-sm">
        <SectionTable
          context={adminContext}
          sections={sections}
          onShowForm={handleCreateSection}
          onSectionClick={handleSectionClick}
          onDeleteSection={handleDeleteInitiate}
        />
      </section>

      {/* create section modal */}
      <CreateSectionForm
        isOpen={isCreateSectionRoute}
        onClose={handleCloseCreateModal}
      />

      {/* section details modal */}
      {selectedSection && (
        <SectionDetailsModal
          context={adminContext}
          section={selectedSection}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          sections={sections}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        section={sectionToDelete}
        studentCount={getStudentCountForSection(sectionToDelete, students)}
      />
    </main>
  );
}
