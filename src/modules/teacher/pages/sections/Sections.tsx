import { useEffect, useState, type ReactElement } from "react";
import CreateSectionForm from "./components/CreateSectionForm";
import { useTeacherContext } from "../../context/teacher.context";
import { AnimatePresence, motion } from "framer-motion";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import SectionTable from "./components/section-table/SectionTable";
import SectionDetailsModal from "./components/SectionDetailsModal";
import { Section } from "../../../core/types/section/section.type";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "./components/DeleteSectionConfirmationModal";
import { useTeacherDeleteSection } from "../../services/teacher-section.service";

export default function Sections(): ReactElement {
  const { sections, students, teacherId } = useTeacherContext();
  const { mutate: deleteSection } = useTeacherDeleteSection(teacherId);
  const queryClient = useQueryClient();

  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const showForm = location.pathname.endsWith("/add-section");

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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSection(null);
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

  const getStudentCountForSection = (section: Section | null): number => {
    if (!section) return 0;
    return students.filter((student) => student.sectionId === section.id)
      .length;
  };

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
            onClick={() => navigate("add-section")}
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
          sections={sections}
          onShowForm={() => navigate("add-section")}
          onSectionClick={handleSectionClick}
          onDeleteSection={handleDeleteInitiate}
        />
      </section>

      {showForm && <CreateSectionForm onCloseForm={() => navigate("..")} />}

      {/* section details modal */}
      {selectedSection && (
        <SectionDetailsModal
          section={selectedSection}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        section={sectionToDelete}
        studentCount={getStudentCountForSection(sectionToDelete)}
      />
    </main>
  );
}
