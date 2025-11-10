import { type ReactElement, useState } from "react";
import { Request } from "../../../core/types/requests/request.type";
import { useTeacherContext } from "../../context/teacher.context";
import RequestTable from "./components/request-table/RequestTable";
import RequestDetailsModal from "./components/RequestDetailsModal";

export default function Requests(): ReactElement {
  const { requests, teacherId } = useTeacherContext();

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  return (
    <main className="flex flex-col h-full min-h-screen w-full gap-2 bg-inherit p-2 mt-4 md:mt-0">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
          Requests
        </h3>
      </header>

      <RequestTable requests={requests} onRequestClick={handleRequestClick} />

      <RequestDetailsModal
        isOpen={showModal}
        request={selectedRequest}
        onClose={handleCloseModal}
        teacherId={teacherId}
      />
    </main>
  );
}
