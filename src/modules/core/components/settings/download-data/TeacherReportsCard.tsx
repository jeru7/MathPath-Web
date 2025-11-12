import { type ReactElement, useState } from "react";
import {
  FaDownload,
  FaFileExcel,
  FaFileCsv,
  FaUsers,
  FaChartBar,
  FaGamepad,
  FaList,
} from "react-icons/fa";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import PreviewDownloadModal from "./PreviewDownloadModal";
import { useTeacherContext } from "../../../../teacher/context/teacher.context";
import {
  useTeacherStudentData,
  useTeacherAssessmentCombined,
  useTeacherStageData,
} from "../../../../teacher/services/teacher-data-report.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAdminContext } from "@/modules/admin/context/admin.context";
import {
  AssessmentAttemptData,
  AssessmentData,
  PreviewDataItem,
  StageData,
  StudentData,
} from "@/modules/core/types/data-report.type";
import {
  useAdminAssessmentCombined,
  useAdminStageData,
  useAdminStudentData,
} from "@/modules/admin/services/admin-data-report.service";

type ReportType = {
  id: "student_overview" | "assessment_student" | "stage_student";
  label: string;
  description: string;
  icon: ReactElement;
  headers: string[];
  dataKeys: string[];
  subHeaders?: string[];
  subDataKeys?: string[];
};

type PreviewData = {
  data: PreviewDataItem[];
  fileSize: string;
  recordCount: number;
};

const isAssessmentData = (item: PreviewDataItem): item is AssessmentData => {
  return "assessmentTitle" in item;
};

const isStudentData = (item: PreviewDataItem): item is StudentData => {
  return "lrn" in item;
};

const isStageData = (item: PreviewDataItem): item is StageData => {
  return "stage" in item;
};

type ReportsCardProps = {
  userType: "teacher" | "admin";
  userId: string;
};

export default function TeacherReportsCard({
  userType,
  userId,
}: ReportsCardProps): ReactElement {
  const isTeacher = userType === "teacher";
  const useUserContext = isTeacher ? useTeacherContext : useAdminContext;
  const useUserStudentData = isTeacher
    ? useTeacherStudentData
    : useAdminStudentData;
  const useUserAssessmentCombined = isTeacher
    ? useTeacherAssessmentCombined
    : useAdminAssessmentCombined;
  const useUserStageData = isTeacher ? useTeacherStageData : useAdminStageData;

  const { rawSections, rawAssessments } = useUserContext();

  const [selectedReport, setSelectedReport] =
    useState<ReportType["id"]>("student_overview");
  const [selectedFormat, setSelectedFormat] = useState<"excel" | "csv">(
    "excel",
  );
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedAssessment, setSelectedAssessment] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [includeAttempts, setIncludeAttempts] = useState(false);

  // student data report
  const { data: studentData, isLoading: studentLoading } = useUserStudentData(
    userId,
    selectedSection !== "all" ? selectedSection : undefined,
  );

  // assessment combined data report
  const { data: assessmentData, isLoading: assessmentLoading } =
    useUserAssessmentCombined(
      userId,
      selectedSection !== "all" ? selectedSection : undefined,
      selectedAssessment !== "all" ? selectedAssessment : undefined,
      selectedReport === "assessment_student" ? includeAttempts : false,
    );

  // stage data report
  const { data: stageData, isLoading: stageLoading } = useUserStageData(
    userId,
    selectedSection !== "all" ? selectedSection : undefined,
  );

  const reportTypes: ReportType[] = [
    {
      id: "student_overview",
      label: "Student Overview Data Report",
      description: "Comprehensive student performance analysis",
      icon: <FaUsers className="w-5 h-5" />,
      headers: [
        "LRN",
        "Full Name",
        "Section",
        "Assessments Taken",
        "Assessments Passed",
        "Assessments Passing Rate",
        "Stage Attempts",
        "Current Stage",
        "Average Answer Correctness",
        "Win Rate",
        "Area of Difficulty",
      ],
      dataKeys: [
        "lrn",
        "fullName",
        "sectionName",
        "assessmentsTaken",
        "assessmentsPassed",
        "assessmentsPassingRate",
        "stageAttempts",
        "currentStage",
        "averageAnswerCorrectness",
        "winRate",
        "areaOfDifficulty",
      ],
    },
    {
      id: "assessment_student",
      label: "Assessment Data Report",
      description: "Detailed assessment performance metrics",
      icon: <FaChartBar className="w-5 h-5" />,
      headers: [
        "Assessment Title",
        "Topic",
        "Total Points",
        "Average Score",
        "Average Time Taken",
        "Passing Rate",
        "Total Attempts",
      ],
      dataKeys: [
        "assessmentTitle",
        "topic",
        "score",
        "averageScore",
        "averageTimeTaken",
        "passingRate",
        "totalAttempts",
      ],
      subHeaders: [
        "Assessment Title",
        "Student Name",
        "Score",
        "Time Taken",
        "Date Completed",
        "Result",
      ],
      subDataKeys: [
        "assessmentTitle",
        "studentName",
        "score",
        "timeTaken",
        "dateCompleted",
        "result",
      ],
    },
    {
      id: "stage_student",
      label: "Stage Performance Data Report",
      description: "Game stage progression and performance analytics",
      icon: <FaGamepad className="w-5 h-5" />,
      headers: [
        "Stage",
        "Topic",
        "Average Correctness",
        "Total Stage Attempts",
        "Average Time Taken",
        "Win Rate",
        "Easy Questions",
        "Medium Questions",
        "Hard Questions",
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
    if (selectedReport === "assessment_student") {
      setIsGenerating(true);
      try {
        if (!assessmentData) {
          throw new Error("No assessment data available");
        }

        const dataToPreview = assessmentData.overview;

        const fileSize = await calculateFileSize(dataToPreview, selectedFormat);

        setPreviewData({
          data: dataToPreview,
          fileSize,
          recordCount: dataToPreview.length,
        });
        setShowPreviewModal(true);
      } catch {
        // console.error("Preview failed:", error);
        toast.error("Failed to generate preview");
      } finally {
        setIsGenerating(false);
      }
    } else if (selectedReport === "student_overview") {
      setIsGenerating(true);
      try {
        const data: PreviewDataItem[] = (studentData as StudentData[]) || [];
        const fileSize = await calculateFileSize(data, selectedFormat);

        setPreviewData({
          data,
          fileSize,
          recordCount: data.length,
        });
        setShowPreviewModal(true);
      } catch {
        // console.error("Preview failed:", error);
        toast.error("Failed to generate preview");
      } finally {
        setIsGenerating(false);
      }
    } else if (selectedReport === "stage_student") {
      setIsGenerating(true);
      try {
        const data: PreviewDataItem[] = (stageData as StageData[]) || [];
        const fileSize = await calculateFileSize(data, selectedFormat);

        setPreviewData({
          data,
          fileSize,
          recordCount: data.length,
        });
        setShowPreviewModal(true);
      } catch {
        // console.error("Preview failed:", error);
        toast.error("Failed to generate preview");
      } finally {
        setIsGenerating(false);
      }
    } else {
      toast.info("This report type is coming soon!");
    }
  };

  const handleDownload = async (): Promise<void> => {
    if (!previewData) return;

    setIsGenerating(true);
    try {
      const shouldDownloadAttempts =
        selectedReport === "assessment_student" &&
        assessmentData &&
        assessmentData.attempts.length > 0 &&
        includeAttempts;

      if (shouldDownloadAttempts) {
        await generateAndDownloadReportWithAttempts(
          assessmentData.overview,
          assessmentData.attempts,
        );
      } else {
        await generateAndDownloadReport(previewData.data);
      }
      setShowPreviewModal(false);
      setPreviewData(null);
      toast.success("Report downloaded successfully!");
    } catch {
      // console.error("Download failed:", error);
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
    data: PreviewDataItem[],
    format: "excel" | "csv",
  ): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const baseSize = data.length * 150;
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

  const generateAndDownloadReport = async (
    data: PreviewDataItem[],
  ): Promise<void> => {
    if (selectedFormat === "excel") {
      await downloadAsExcel(data);
    } else {
      await downloadAsCSV(data);
    }
  };

  const generateAndDownloadReportWithAttempts = async (
    overviewData: AssessmentData[],
    attemptData: AssessmentAttemptData[],
  ): Promise<void> => {
    if (selectedFormat === "excel") {
      await downloadAsExcelWithAttempts(overviewData, attemptData);
    } else {
      await downloadAsCSVWithAttempts(overviewData, attemptData);
    }
  };

  const downloadAsExcel = async (data: PreviewDataItem[]): Promise<void> => {
    const currentReport = reportTypes.find(
      (report) => report.id === selectedReport,
    );
    if (!currentReport) return;

    if (selectedReport === "assessment_student") {
      const assessmentData = data.filter(isAssessmentData);
      const orderedData = assessmentData.map((row) => {
        const orderedRow: Record<string, unknown> = {};
        currentReport.headers.forEach((header, index) => {
          const dataKey = currentReport.dataKeys[index];
          orderedRow[header] = row[dataKey as keyof AssessmentData];
        });
        return orderedRow;
      });

      const worksheet = XLSX.utils.json_to_sheet(orderedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Assessment Overview");

      const colWidths = currentReport.headers.map((header) => {
        const maxContentWidth = Math.max(
          ...orderedData.map((row) => String(row[header] || "").length),
          header.length,
        );
        return { wch: Math.min(Math.max(maxContentWidth, 10), 50) };
      });
      worksheet["!cols"] = colWidths;

      XLSX.writeFile(
        workbook,
        `assessment_report_${getFormattedTimestamp()}.xlsx`,
      );
    } else if (selectedReport === "stage_student") {
      const stageData = data.filter(isStageData);
      const orderedData = stageData.map((row) => {
        const orderedRow: Record<string, unknown> = {};
        currentReport.headers.forEach((header, index) => {
          const dataKey = currentReport.dataKeys[index];
          orderedRow[header] = row[dataKey as keyof StageData];
        });
        return orderedRow;
      });

      const worksheet = XLSX.utils.json_to_sheet(orderedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Stage Performance");

      const colWidths = currentReport.headers.map((header) => {
        const maxContentWidth = Math.max(
          ...orderedData.map((row) => String(row[header] || "").length),
          header.length,
        );
        return { wch: Math.min(Math.max(maxContentWidth, 10), 50) };
      });
      worksheet["!cols"] = colWidths;

      XLSX.writeFile(
        workbook,
        `stage_performance_${getFormattedTimestamp()}.xlsx`,
      );
    } else {
      const studentData = data.filter(isStudentData);
      const orderedData = studentData.map((row) => {
        const orderedRow: Record<string, unknown> = {};
        currentReport.headers.forEach((header, index) => {
          const dataKey = currentReport.dataKeys[index];
          orderedRow[header] = row[dataKey as keyof StudentData];
        });
        return orderedRow;
      });

      const worksheet = XLSX.utils.json_to_sheet(orderedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Student Overview");

      const colWidths = currentReport.headers.map((header) => {
        const maxContentWidth = Math.max(
          ...orderedData.map((row) => String(row[header] || "").length),
          header.length,
        );
        return { wch: Math.min(Math.max(maxContentWidth, 10), 50) };
      });
      worksheet["!cols"] = colWidths;

      XLSX.writeFile(
        workbook,
        `student_overview_${getFormattedTimestamp()}.xlsx`,
      );
    }
  };

  const downloadAsExcelWithAttempts = async (
    overviewData: AssessmentData[],
    attemptData: AssessmentAttemptData[],
  ): Promise<void> => {
    const currentReport = reportTypes.find(
      (report) => report.id === selectedReport,
    );
    if (!currentReport) return;

    const timestamp = getFormattedTimestamp();

    const assessmentWorksheet = XLSX.utils.json_to_sheet(
      overviewData.map((row) => {
        const orderedRow: Record<string, unknown> = {};
        currentReport.headers.forEach((header, index) => {
          const dataKey = currentReport.dataKeys[index];
          orderedRow[header] = row[dataKey as keyof AssessmentData];
        });
        return orderedRow;
      }),
    );

    const assessmentWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      assessmentWorkbook,
      assessmentWorksheet,
      "Assessment Overview",
    );

    const assessmentColWidths = currentReport.headers.map((header) => {
      const maxContentWidth = Math.max(
        ...overviewData.map(
          (row) => String(row[header as keyof AssessmentData] || "").length,
        ),
        header.length,
      );
      return { wch: Math.min(Math.max(maxContentWidth, 10), 50) };
    });
    assessmentWorksheet["!cols"] = assessmentColWidths;

    XLSX.writeFile(assessmentWorkbook, `assessment_overview_${timestamp}.xlsx`);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const attemptWorksheet = XLSX.utils.json_to_sheet(
      attemptData.map((row) => {
        const orderedRow: Record<string, unknown> = {};
        currentReport.subHeaders!.forEach((header, index) => {
          const dataKey = currentReport.subDataKeys![index];
          orderedRow[header] = row[dataKey as keyof AssessmentAttemptData];
        });
        return orderedRow;
      }),
    );

    const attemptWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      attemptWorkbook,
      attemptWorksheet,
      "Student Attempts",
    );

    const attemptColWidths = currentReport.subHeaders!.map((header) => {
      const maxContentWidth = Math.max(
        ...attemptData.map(
          (row) =>
            String(row[header as keyof AssessmentAttemptData] || "").length,
        ),
        header.length,
      );
      return { wch: Math.min(Math.max(maxContentWidth, 10), 50) };
    });
    attemptWorksheet["!cols"] = attemptColWidths;

    XLSX.writeFile(attemptWorkbook, `assessment_attempts_${timestamp}.xlsx`);
  };

  const downloadAsCSV = async (data: PreviewDataItem[]): Promise<void> => {
    const currentReport = reportTypes.find(
      (report) => report.id === selectedReport,
    );
    if (!currentReport) return;

    if (selectedReport === "assessment_student") {
      const assessmentData = data.filter(isAssessmentData);
      const orderedData = assessmentData.map((row) => {
        const orderedRow: Record<string, unknown> = {};
        currentReport.headers.forEach((header, index) => {
          const dataKey = currentReport.dataKeys[index];
          orderedRow[header] = row[dataKey as keyof AssessmentData];
        });
        return orderedRow;
      });

      const headers = currentReport.headers;
      const csvContent = [
        headers.join(","),
        ...orderedData.map((row) =>
          headers.map((header) => `"${String(row[header] || "")}"`).join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `assessment_report_${getFormattedTimestamp()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (selectedReport === "stage_student") {
      const stageData = data.filter(isStageData);
      const orderedData = stageData.map((row) => {
        const orderedRow: Record<string, unknown> = {};
        currentReport.headers.forEach((header, index) => {
          const dataKey = currentReport.dataKeys[index];
          orderedRow[header] = row[dataKey as keyof StageData];
        });
        return orderedRow;
      });

      const headers = currentReport.headers;
      const csvContent = [
        headers.join(","),
        ...orderedData.map((row) =>
          headers.map((header) => `"${String(row[header] || "")}"`).join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `stage_performance_${getFormattedTimestamp()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const studentData = data.filter(isStudentData);
      const orderedData = studentData.map((row) => {
        const orderedRow: Record<string, unknown> = {};
        currentReport.headers.forEach((header, index) => {
          const dataKey = currentReport.dataKeys[index];
          orderedRow[header] = row[dataKey as keyof StudentData];
        });
        return orderedRow;
      });

      const headers = currentReport.headers;
      const csvContent = [
        headers.join(","),
        ...orderedData.map((row) =>
          headers.map((header) => `"${String(row[header] || "")}"`).join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `student_overview_${getFormattedTimestamp()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const downloadAsCSVWithAttempts = async (
    overviewData: AssessmentData[],
    attemptData: AssessmentAttemptData[],
  ): Promise<void> => {
    const currentReport = reportTypes.find(
      (report) => report.id === selectedReport,
    );
    if (!currentReport) return;

    const timestamp = getFormattedTimestamp();

    const assessmentHeaders = currentReport.headers;
    const assessmentCsvContent = [
      assessmentHeaders.join(","),
      ...overviewData.map((row) => {
        const values = currentReport.dataKeys.map((dataKey) => {
          const value = row[dataKey as keyof AssessmentData];
          return `"${String(value || "").replace(/"/g, '""')}"`;
        });
        return values.join(",");
      }),
    ].join("\n");

    const assessmentBlob = new Blob([assessmentCsvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const assessmentUrl = URL.createObjectURL(assessmentBlob);
    const assessmentLink = document.createElement("a");
    assessmentLink.href = assessmentUrl;
    assessmentLink.download = `assessment_overview_${timestamp}.csv`;
    document.body.appendChild(assessmentLink);
    assessmentLink.click();
    document.body.removeChild(assessmentLink);
    URL.revokeObjectURL(assessmentUrl);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const attemptHeaders = currentReport.subHeaders!;
    const attemptCsvContent = [
      attemptHeaders.join(","),
      ...attemptData.map((row) => {
        const values = currentReport.subDataKeys!.map((dataKey) => {
          const value = row[dataKey as keyof AssessmentAttemptData];
          return `"${String(value || "").replace(/"/g, '""')}"`;
        });
        return values.join(",");
      }),
    ].join("\n");

    const attemptBlob = new Blob([attemptCsvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const attemptUrl = URL.createObjectURL(attemptBlob);
    const attemptLink = document.createElement("a");
    attemptLink.href = attemptUrl;
    attemptLink.download = `assessment_attempts_${timestamp}.csv`;
    document.body.appendChild(attemptLink);
    attemptLink.click();
    document.body.removeChild(attemptLink);
    URL.revokeObjectURL(attemptUrl);
  };

  const getFormattedTimestamp = (): string => {
    return new Date().toISOString().split("T")[0].replace(/-/g, "");
  };

  const currentReport = reportTypes.find(
    (report) => report.id === selectedReport,
  );

  const isLoadingData =
    (selectedReport === "student_overview" && studentLoading) ||
    (selectedReport === "assessment_student" && assessmentLoading) ||
    (selectedReport === "stage_student" && stageLoading);

  const getRecordCount = () => {
    if (selectedReport === "student_overview") {
      return studentData?.length || 0;
    } else if (selectedReport === "assessment_student") {
      return assessmentData?.overview.length || 0;
    } else if (selectedReport === "stage_student") {
      return stageData?.length || 0;
    }
    return 0;
  };

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
        includeAttempts={
          selectedReport === "assessment_student" ? includeAttempts : undefined
        }
        assessmentData={assessmentData}
        stageData={stageData}
      />

      <Card>
        <CardHeader>
          <CardTitle>Data Reports</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">Report Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportTypes.map((report) => (
                <Card
                  key={report.id}
                  className={`cursor-pointer transition-all border-2 hover:shadow-sm ${selectedReport === report.id
                      ? "border-primary shadow-sm bg-primary/5"
                      : "border-border hover:border-primary/50"
                    }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${selectedReport === report.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {report.icon}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${selectedReport === report.id
                              ? "text-primary"
                              : "text-foreground"
                            }`}
                        >
                          {report.label}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {report.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-card border">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Export Format
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedFormat("excel")}
                      variant={
                        selectedFormat === "excel" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex items-center gap-2 flex-1"
                    >
                      <FaFileExcel className="w-4 h-4" />
                      Excel
                    </Button>
                    <Button
                      onClick={() => setSelectedFormat("csv")}
                      variant={selectedFormat === "csv" ? "default" : "outline"}
                      size="sm"
                      className="flex items-center gap-2 flex-1"
                    >
                      <FaFileCsv className="w-4 h-4" />
                      CSV
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Section Filter
                  </Label>
                  <Select
                    value={selectedSection}
                    onValueChange={setSelectedSection}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {rawSections?.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedReport === "assessment_student" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Assessment Filter
                    </Label>
                    <Select
                      value={selectedAssessment}
                      onValueChange={setSelectedAssessment}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assessment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Assessments</SelectItem>
                        {rawAssessments?.map((assessment) => (
                          <SelectItem key={assessment.id} value={assessment.id}>
                            {assessment.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedReport !== "assessment_student" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Report Status
                    </Label>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Records:</span>
                        <span className="font-semibold text-foreground">
                          {getRecordCount()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="font-semibold text-foreground">
                          {selectedFormat.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedReport === "assessment_student" && (
                <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <FaList className="w-4 h-4" />
                        Include Student Attempts
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Download detailed student attempt data along with
                        assessment overview
                      </p>
                    </div>
                    <Switch
                      checked={includeAttempts}
                      onCheckedChange={setIncludeAttempts}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handlePreview}
              disabled={isGenerating || isLoadingData}
              className="flex items-center gap-3 px-6 py-3"
              size="lg"
            >
              {isGenerating || isLoadingData ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {isLoadingData ? "Loading Data..." : "Generating Preview..."}
                </>
              ) : (
                <>
                  <FaDownload className="w-5 h-5" />
                  {selectedReport === "student_overview"
                    ? "Generate Student Report"
                    : selectedReport === "assessment_student"
                      ? "Generate Assessment Report"
                      : "Generate Stage Report"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
