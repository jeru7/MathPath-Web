import { type ReactElement, useState } from "react";
import SectionArchiveList from "./SectionArchiveList";
import { SectionTableContext } from "../SectionTable";
import { Section } from "../../../../types/section/section.type";
import SectionDetailsModal from "../SectionDetailsModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl h-[85vh] max-h-[800px] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold">
                  Archived Sections
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">
                    {sections.length} archived section
                    {sections.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* content */}
          <div className="flex-1 overflow-y-auto p-6">
            <SectionArchiveList
              sections={sections}
              onSectionClick={handleSectionClick}
            />
          </div>

          {/* footer */}
          <div className="border-t p-4 bg-muted/50">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Select a section to view details or restore
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* section details modal for archived sections */}
      {selectedSection && (
        <SectionDetailsModal
          section={selectedSection}
          isOpen={!!selectedSection}
          onClose={handleCloseDetailsModal}
          sections={context.rawSections}
          context={context}
          onArchive={handleRestore}
          onDelete={handleDelete}
          disableEdit={true}
          disableDelete={true}
          archiveLabel="Restore"
        />
      )}
    </>
  );
}
