import { type ReactElement } from "react";
import { FaTimes, FaDownload } from "react-icons/fa";
import {
  AssessmentData,
  StageData,
  StudentData,
} from "../../../../teacher/types/teacher-data-report";
import ModalOverlay from "../../modal/ModalOverlay";

type PreviewDownloadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isGenerating: boolean;
  previewData: {
    data: StudentData[] | AssessmentData[] | StageData[];
    fileSize: string;
    recordCount: number;
  } | null;
  currentReport:
  | {
    headers: string[];
    dataKeys: string[];
  }
  | undefined;
  selectedFormat: string;
};

export default function PreviewDownloadModal({
  isOpen,
  onClose,
  onConfirm,
  isGenerating,
  previewData,
  currentReport,
  selectedFormat,
}: PreviewDownloadModalProps): ReactElement {
  const formatPreviewValue = (header: string, value: unknown): string => {
    if (typeof value === "number") {
      return header.toLowerCase().includes("percentage") ||
        header.toLowerCase().includes("correctness") ||
        header.toLowerCase().includes("score") ||
        header.toLowerCase().includes("winrate") ||
        header.toLowerCase().includes("easy") ||
        header.toLowerCase().includes("medium") ||
        header.toLowerCase().includes("hard")
        ? `${value}%`
        : String(value);
    }
    return String(value || "N/A");
  };

  const getValueFromData = (
    row: StudentData | AssessmentData | StageData,
    dataKey: string,
  ): unknown => {
    return row[dataKey as keyof typeof row];
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm w-[100svw] h-[100svh] md:max-w-4xl md:w-full sm:h-fit overflow-hidden flex flex-col">
        {/* header */}
        <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
              Download Confirmation
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-blue-600 dark:text-blue-400">
            <div className="flex items-center gap-1">
              <span className="font-medium">
                {previewData?.recordCount || 0}
              </span>
              <span>records</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">
                {previewData?.fileSize || "0 B"}
              </span>
              <span>file size</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">
                {selectedFormat.toUpperCase()}
              </span>
              <span>format</span>
            </div>
          </div>
        </div>

        {/* main content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview (First 5 records)
            </h4>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {currentReport?.headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {previewData?.data.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {currentReport?.dataKeys.map((dataKey, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-3 py-2 text-gray-900 dark:text-white whitespace-nowrap"
                          >
                            {formatPreviewValue(
                              currentReport?.headers[cellIndex] || "",
                              getValueFromData(row, dataKey),
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Showing {Math.min(previewData?.data.length || 0, 5)} of{" "}
              {previewData?.data.length || 0} records
            </p>
          </div>
        </div>

        {/* action buttons */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 mt-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed order-2 sm:order-1"
            >
              <FaTimes className="w-3 h-3" />
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-green-400 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <FaDownload className="w-3 h-3" />
                  Confirm Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
