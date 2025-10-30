import { type ReactElement, useState } from "react";
import {
  FaDownload,
  FaFileExcel,
  FaFileCsv,
  FaUsers,
  FaChartBar,
  FaGamepad,
} from "react-icons/fa";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import PreviewDownloadModal from "./PreviewDownloadModal";
import {
  AssessmentData,
  StageData,
  StudentData,
} from "../../../../teacher/types/teacher-data-report";
import { useTeacherContext } from "../../../../teacher/context/teacher.context";
import {
  useTeacherAssessmentData,
  useTeacherStageData,
  useTeacherStudentData,
} from "../../../../teacher/services/teacher-data-report.service";

type ReportConfig = {
  reportType: "student_overview" | "assessment_student" | "stage_student";
  format: "excel" | "csv";
  section: string;
  assessment?: string;
};

type ReportType = {
  id: "student_overview" | "assessment_student" | "stage_student";
  label: string;
  description: string;
  icon: ReactElement;
  headers: string[];
  dataKeys: string[];
};

type PreviewData = {
  data: StudentData[] | AssessmentData[] | StageData[];
  fileSize: string;
  recordCount: number;
};

export default function TeacherReportsCard(): ReactElement {
  const { teacherId, assessments, sections } = useTeacherContext();
  const [selectedReport, setSelectedReport] =
    useState<ReportType["id"]>("student_overview");
  const [selectedFormat, setSelectedFormat] = useState<"excel" | "csv">(
    "excel",
  );
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedAssessment, setSelectedAssessment] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const { data: studentData, isLoading: studentLoading } =
    useTeacherStudentData(
      teacherId,
      selectedSection !== "all" ? selectedSection : undefined,
    );
  const { data: assessmentData, isLoading: assessmentLoading } =
    useTeacherAssessmentData(
      teacherId,
      selectedSection !== "all" ? selectedSection : undefined,
      selectedAssessment || undefined,
    );
  const { data: stageData, isLoading: stageLoading } = useTeacherStageData(
    teacherId,
    selectedSection !== "all" ? selectedSection : undefined,
  );

  console.log("Available assessments:", assessments);
  console.log("Available assessments data:", assessmentData);

  const reportTypes: ReportType[] = [
    {
      id: "student_overview",
      label: "Student Data",
      description: "Student data report",
      icon: <FaUsers className="w-4 h-4" />,
      headers: [
        "LRN",
        "Full Name",
        "Section",
        "Assessments Taken",
        "Stage Attempts",
        "Current Stage",
        "Avg Correctness",
        "Overall Assessment Score",
        "Date Created",
        "Area of Difficulty",
      ],
      dataKeys: [
        "lrn",
        "fullName",
        "sectionName",
        "totalAssessmentsTaken",
        "totalStageAttempts",
        "currentStage",
        "overallAverageCorrectness",
        "overallAssessmentScorePercentage",
        "dateCreated",
        "areaOfDifficulty",
      ],
    },
    {
      id: "assessment_student",
      label: "Assessment Data",
      description: "Assessment data report",
      icon: <FaChartBar className="w-4 h-4" />,
      headers: [
        "Title",
        "Topic",
        "Avg Score %",
        "Avg Time (seconds)",
        "Total Attempts",
      ],
      dataKeys: [
        "title",
        "topic",
        "averageScorePercentage",
        "averageTimeTaken",
        "totalAttemptsTaken",
      ],
    },
    {
      id: "stage_student",
      label: "Stage Data",
      description: "Stage data report",
      icon: <FaGamepad className="w-4 h-4" />,
      headers: [
        "Stage",
        "Topic",
        "Avg Correctness",
        "Total Attempts",
        "Avg Time",
        "Win Rate",
        "Easy %",
        "Medium %",
        "Hard %",
      ],
      dataKeys: [
        "stage",
        "topic",
        "averageCorrectness",
        "totalStageAttempts",
        "averageTimeTaken",
        "winRate",
        "easy",
        "medium",
        "hard",
      ],
    },
  ];

  const handlePreview = async (): Promise<void> => {
    setIsGenerating(true);
    try {
      const config: ReportConfig = {
        reportType: selectedReport,
        format: selectedFormat,
        section: selectedSection,
        assessment: selectedAssessment,
      };

      const data = await fetchReportData(config);
      const fileSize = await calculateFileSize(data, config.format);

      setPreviewData({
        data,
        fileSize,
        recordCount: data.length,
      });
      setShowPreviewModal(true);
    } catch (error) {
      console.error("Preview failed:", error);
      toast.error("Failed to generate preview");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (): Promise<void> => {
    if (!previewData) return;

    setIsGenerating(true);
    try {
      const config: ReportConfig = {
        reportType: selectedReport,
        format: selectedFormat,
        section: selectedSection,
        assessment: selectedAssessment,
      };

      await generateAndDownloadReport(previewData.data, config);
      setShowPreviewModal(false);
      setPreviewData(null);
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancelDownload = (): void => {
    setShowPreviewModal(false);
    setPreviewData(null);
  };

  const calculateFileSize = async (
    data: StudentData[] | AssessmentData[] | StageData[],
    format: "excel" | "csv",
  ): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate file size calculation based on data length and format
        const baseSize = data.length * 100; // 100 bytes per record
        const formatMultiplier = format === "excel" ? 1.5 : 1;
        const sizeInBytes = baseSize * formatMultiplier;

        if (sizeInBytes < 1024) {
          resolve(`${sizeInBytes} B`);
        } else if (sizeInBytes < 1048576) {
          resolve(`${(sizeInBytes / 1024).toFixed(1)} KB`);
        } else {
          resolve(`${(sizeInBytes / 1048576).toFixed(1)} MB`);
        }
      }, 100);
    });
  };

  const fetchReportData = async (
    config: ReportConfig,
  ): Promise<StudentData[] | AssessmentData[] | StageData[]> => {
    switch (config.reportType) {
      case "student_overview":
        return studentData || [];
      case "assessment_student":
        return assessmentData || [];
      case "stage_student":
        return stageData || [];
      default:
        return [];
    }
  };

  const generateAndDownloadReport = async (
    data: StudentData[] | AssessmentData[] | StageData[],
    config: ReportConfig,
  ): Promise<void> => {
    if (config.format === "excel") {
      await downloadAsExcel(data, config.reportType);
    } else {
      await downloadAsCSV(data, config.reportType);
    }
  };

  const downloadAsExcel = async (
    data: StudentData[] | AssessmentData[] | StageData[],
    reportType: string,
  ): Promise<void> => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // Auto-size columns
    const maxWidth = data.reduce((w, r) => {
      const rowLength = Math.max(
        ...Object.values(r).map((v) => String(v).length),
      );
      return Math.max(w, rowLength);
    }, 10);
    worksheet["!cols"] = [{ wch: maxWidth }];

    XLSX.writeFile(
      workbook,
      `report_${reportType}_${getFormattedTimestamp()}.xlsx`,
    );
  };

  const downloadAsCSV = async (
    data: StudentData[] | AssessmentData[] | StageData[],
    reportType: string,
  ): Promise<void> => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => `"${String(row[header as keyof typeof row] || "")}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report_${reportType}_${getFormattedTimestamp()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFormattedTimestamp = (): string => {
    return new Date().toISOString().split("T")[0].replace(/-/g, "");
  };

  const currentReport = reportTypes.find(
    (report) => report.id === selectedReport,
  );

  // Determine loading state for the preview button
  const isLoadingData =
    (selectedReport === "student_overview" && studentLoading) ||
    (selectedReport === "assessment_student" && assessmentLoading) ||
    (selectedReport === "stage_student" && stageLoading);

  return (
    <>
      <PreviewDownloadModal
        isOpen={showPreviewModal}
        onClose={handleCancelDownload}
        onConfirm={handleDownload}
        isGenerating={isGenerating}
        previewData={previewData}
        currentReport={currentReport}
        selectedFormat={selectedFormat}
      />

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
              Data Reports
            </h4>
          </div>
        </div>

        <div className="space-y-4">
          {/* Report Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {reportTypes.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-3 border rounded-lg text-left transition-all ${selectedReport === report.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`p-1 rounded ${selectedReport === report.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                      }`}
                  >
                    {report.icon}
                  </div>
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {report.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {report.description}
                </p>
              </button>
            ))}
          </div>

          {/* Quick Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {/* Format Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Format
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFormat("excel")}
                  className={`flex items-center gap-1 px-3 py-2 text-xs rounded border transition-all ${selectedFormat === "excel"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-600"
                    }`}
                >
                  <FaFileExcel className="w-3 h-3" />
                  Excel
                </button>
                <button
                  onClick={() => setSelectedFormat("csv")}
                  className={`flex items-center gap-1 px-3 py-2 text-xs rounded border transition-all ${selectedFormat === "csv"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-600"
                    }`}
                >
                  <FaFileCsv className="w-3 h-3" />
                  CSV
                </button>
              </div>
            </div>

            {/* Section Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Sections</option>
                {sections?.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assessment Selection */}
            {selectedReport === "assessment_student" && (
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assessment
                </label>
                <select
                  value={selectedAssessment}
                  onChange={(e) => setSelectedAssessment(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Assessments</option>
                  {assessments?.map((assessment) => (
                    <option key={assessment.id} value={assessment.id}>
                      {assessment.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2 w-fit ml-auto">
            <button
              onClick={handlePreview}
              disabled={isGenerating || isLoadingData}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed w-auto mx-auto"
            >
              {isGenerating || isLoadingData ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isLoadingData ? "Loading Data..." : "Generating Preview..."}
                </>
              ) : (
                <>
                  <FaDownload className="w-4 h-4" />
                  Download Data
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
