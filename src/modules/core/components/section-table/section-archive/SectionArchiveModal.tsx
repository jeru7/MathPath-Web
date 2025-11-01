import { type ReactElement, useState } from "react";
import { IoClose } from "react-icons/io5";
import SectionArchiveList from "./SectionArchiveList";
import { SectionTableContext } from "../SectionTable";
import { Section } from "../../../types/section/section.type";
import ModalOverlay from "../../modal/ModalOverlay";
import SectionDetailsModal from "../SectionDetailsModal";

type SectionArchiveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  onRestoreSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  context: SectionTableContext;
};

export default function SectionArchiveModal({
  isOpen,
  onClose,
  sections,
  onRestoreSection,
  onDeleteSection,
  context,
}: SectionArchiveModalProps): ReactElement {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);
  };

  const handleCloseDetailsModal = () => {
    setSelectedSection(null);
  };

  const handleRestore = () => {
    if (selectedSection) {
      onRestoreSection(selectedSection.id);
      setSelectedSection(null);
    }
  };

  const handleDelete = () => {
    if (selectedSection) {
      onDeleteSection(selectedSection.id);
      setSelectedSection(null);
    }
  };

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-sm border border-white dark:border-gray-700 h-[100svh] w-[100svw] md:h-[85svh] md:w-[90svw] lg:w-[75svw] md:max-w-7xl md:max-h-[800px] overflow-hidden flex flex-col">
          {/* header */}
          <div className="flex items-center justify-between p-4 sm:p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Archived Sections
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {sections.length} archived section
                {sections.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-900 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <IoClose className="w-4 h-4" />
            </button>
          </div>

          {/* content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <SectionArchiveList
              sections={sections}
              onSectionClick={handleSectionClick}
            />
          </div>
        </div>
      </ModalOverlay>

      {/* section details modal for archived sections */}
      {selectedSection && (
        <SectionDetailsModal
          section={selectedSection}
          isOpen={!!selectedSection}
          onClose={handleCloseDetailsModal}
          sections={context.sections}
          context={context}
          onArchive={handleRestore}
          onDelete={handleDelete}
          disableEdit={true}
          archiveLabel="Restore"
        />
      )}
    </>
  );
}
