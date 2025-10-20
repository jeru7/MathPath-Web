import { type ReactElement, useState, useRef, useEffect } from "react";
import {
  RequestType,
  Request,
} from "../../../core/types/requests/request.type";
import { useTeacherContext } from "../../context/teacher.context";
import RequestTable from "./components/request-table/RequestTable";
import RequestDetailsModal from "./components/RequestDetailsModal";

export default function Requests(): ReactElement {
  const { requests, teacherId } = useTeacherContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<RequestType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showModal, setShowModal] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const handleClearFilters = () => {
    setSelectedType("all");
    setSelectedStatus("all");
    setSearchTerm("");
  };

  const handleTypeChange = (type: RequestType | "all") => {
    setSelectedType(type);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="flex flex-col h-full min-h-screen w-full max-w-[2400px] gap-2 bg-inherit p-2">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
          Requests
        </h3>
      </header>

      <RequestTable
        requests={requests}
        searchTerm={searchTerm}
        selectedType={selectedType}
        selectedStatus={selectedStatus}
        showFilters={showFilters}
        filterDropdownRef={filterDropdownRef}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onClearSearch={() => setSearchTerm("")}
        onTypeChange={handleTypeChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
        onShowFiltersChange={setShowFilters}
        onRequestClick={handleRequestClick}
      />

      <RequestDetailsModal
        isOpen={showModal}
        request={selectedRequest}
        onClose={handleCloseModal}
        teacherId={teacherId}
      />
    </main>
  );
}
