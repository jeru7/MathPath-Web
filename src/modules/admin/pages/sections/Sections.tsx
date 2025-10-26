import { useEffect, useState, type ReactElement } from "react";
import { useAdminContext } from "../../context/admin.context";
import { AnimatePresence, motion } from "framer-motion";
import { GoPlus } from "react-icons/go";
import { useNavigate, useLocation } from "react-router-dom";
import { Section } from "../../../core/types/section/section.type";
import SectionDetailsModal from "../../../teacher/pages/sections/components/SectionDetailsModal";
import SectionTable from "./SectionTable";
import CreateSectionForm from "./CreateSectionForm";

export default function Sections(): ReactElement {
  const { sections } = useAdminContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
          sections={sections}
          onShowForm={handleCreateSection}
          onSectionClick={handleSectionClick}
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
          section={selectedSection}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          sections={sections}
        />
      )}
    </main>
  );
}
