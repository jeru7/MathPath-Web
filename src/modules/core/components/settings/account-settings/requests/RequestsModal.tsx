import { type ReactElement } from "react";
import { FaTimes, FaHistory } from "react-icons/fa";
import { Request } from "../../../../types/requests/request.type";
import { format } from "date-fns-tz";

type RequestsModalProps = {
  showRequestsModal: boolean;
  onClose: () => void;
  accountRequests: Request[];
  isLoadingRequests: boolean;
  onRequestClick: (request: Request) => void;
};

export default function RequestsModal({
  showRequestsModal,
  onClose,
  accountRequests,
  isLoadingRequests,
  onRequestClick,
}: RequestsModalProps): ReactElement {
  if (!showRequestsModal) return <></>;

  const RequestListItem = ({ request }: { request: Request }) => {
    const getStatusColor = (status: string): string => {
      switch (status) {
        case "approved":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case "rejected":
          return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "pending":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      }
    };

    return (
      <div
        className="border border-gray-200 dark:border-gray-700 rounded-sm p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
        onClick={() => onRequestClick(request)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  request.status,
                )}`}
              >
                {request.status.charAt(0).toUpperCase() +
                  request.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(request.createdAt), "MMM d 'at' h:mm a", {
                  timeZone: "Asia/Manila",
                })}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Account Information Change Request
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm shadow-sm w-full max-w-4xl mx-4 flex flex-col max-h-[90vh]">
        {/* header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Account Change Requests
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View your pending and past account modification requests
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm hover:cursor-pointer"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {isLoadingRequests ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : accountRequests.length === 0 ? (
              <div className="text-center py-8">
                <FaHistory className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Requests Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  You haven't submitted any account change requests yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {accountRequests.map((request) => (
                  <RequestListItem key={request.id} request={request} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
