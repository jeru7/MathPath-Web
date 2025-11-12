import { type ReactElement, useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import {
  StudentData,
  AssessmentData,
  AssessmentAttemptData,
  StageData,
  PreviewDataItem,
} from "../../../../core/types/data-report.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ReportType = {
  headers: string[];
  dataKeys: string[];
  subHeaders?: string[];
  subDataKeys?: string[];
};

type PreviewData = {
  data: PreviewDataItem[];
  fileSize: string;
  recordCount: number;
  includeAttempts?: boolean;
};

type PreviewDownloadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isGenerating: boolean;
  previewData: PreviewData | null;
  currentReport: ReportType | undefined;
  selectedFormat: string;
  includeAttempts?: boolean;
  assessmentData?: {
    overview: AssessmentData[];
    attempts: AssessmentAttemptData[];
  };
  stageData?: StageData[];
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

export default function PreviewDownloadModal({
  isOpen,
  onClose,
  onConfirm,
  isGenerating,
  previewData,
  currentReport,
  selectedFormat,
  includeAttempts = false,
  assessmentData,
}: PreviewDownloadModalProps): ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentAttemptsPage, setCurrentAttemptsPage] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    setCurrentPage(1);
    setCurrentAttemptsPage(1);
    setActiveTab("overview");
  }, [previewData]);

  const formatPreviewValue = (header: string, value: unknown): ReactElement => {
    if (typeof value === "number") {
      const numValue = value;
      if (
        header.toLowerCase().includes("rate") ||
        header.toLowerCase().includes("questions") ||
        header.toLowerCase().includes("correctness")
      ) {
        return (
          <span className="font-mono text-sm">
            {header.toLowerCase().includes("time")
              ? `${numValue}s`
              : `${numValue}%`}
          </span>
        );
      }
      return (
        <span className="font-mono text-sm">
          {header.toLowerCase().includes("time") ? `${numValue}s` : numValue}
        </span>
      );
    }
    if (header === "Area of Difficulty") {
      return (
        <span className="text-sm font-medium">{String(value || "None")}</span>
      );
    }

    return <span className="text-sm">{String(value || "N/A")}</span>;
  };

  const getValueFromData = (row: PreviewDataItem, dataKey: string): unknown => {
    return (row as Record<string, unknown>)[dataKey];
  };

  const assessmentDataFromPreview =
    previewData?.data.filter(isAssessmentData) || [];
  const studentDataFromPreview = previewData?.data.filter(isStudentData) || [];
  const stageDataFromPreview = previewData?.data.filter(isStageData) || [];

  const hasAssessmentData = assessmentDataFromPreview.length > 0;
  const hasStudentData = studentDataFromPreview.length > 0;
  const hasStageData = stageDataFromPreview.length > 0;

  const isStudentReport = hasStudentData;
  const isStageReport = hasStageData;
  const isAssessmentReport = hasAssessmentData;

  const totalStudentPages = Math.ceil(
    studentDataFromPreview.length / itemsPerPage,
  );
  const indexOfLastStudentItem = currentPage * itemsPerPage;
  const indexOfFirstStudentItem = indexOfLastStudentItem - itemsPerPage;
  const currentStudentItems = studentDataFromPreview.slice(
    indexOfFirstStudentItem,
    indexOfLastStudentItem,
  );

  const totalOverviewPages = Math.ceil(
    assessmentDataFromPreview.length / itemsPerPage,
  );
  const indexOfLastOverviewItem = currentPage * itemsPerPage;
  const indexOfFirstOverviewItem = indexOfLastOverviewItem - itemsPerPage;
  const currentOverviewItems = assessmentDataFromPreview.slice(
    indexOfFirstOverviewItem,
    indexOfLastOverviewItem,
  );

  const totalStagePages = Math.ceil(stageDataFromPreview.length / itemsPerPage);
  const indexOfLastStageItem = currentPage * itemsPerPage;
  const indexOfFirstStageItem = indexOfLastStageItem - itemsPerPage;
  const currentStageItems = stageDataFromPreview.slice(
    indexOfFirstStageItem,
    indexOfLastStageItem,
  );

  const totalAttemptsPages = Math.ceil(
    (assessmentData?.attempts.length || 0) / itemsPerPage,
  );
  const indexOfLastAttemptItem = currentAttemptsPage * itemsPerPage;
  const indexOfFirstAttemptItem = indexOfLastAttemptItem - itemsPerPage;
  const currentAttemptItems = (assessmentData?.attempts || []).slice(
    indexOfFirstAttemptItem,
    indexOfLastAttemptItem,
  );

  const handleNextPage = (): void => {
    if (currentPage < totalStudentPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = (): void => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  const handleNextAttemptsPage = (): void => {
    if (currentAttemptsPage < totalAttemptsPages)
      setCurrentAttemptsPage(currentAttemptsPage + 1);
  };

  const handlePrevAttemptsPage = (): void => {
    if (currentAttemptsPage > 1)
      setCurrentAttemptsPage(currentAttemptsPage - 1);
  };

  const handleAttemptsPageClick = (pageNumber: number): void => {
    setCurrentAttemptsPage(pageNumber);
  };

  const getPageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    const totalPages = isStudentReport
      ? totalStudentPages
      : isStageReport
        ? totalStagePages
        : isAssessmentReport
          ? totalOverviewPages
          : 1;

    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2),
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const getAttemptsPageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    const maxVisiblePages = 5;

    if (totalAttemptsPages <= maxVisiblePages) {
      for (let i = 1; i <= totalAttemptsPages; i++) pageNumbers.push(i);
    } else {
      const startPage = Math.max(
        1,
        currentAttemptsPage - Math.floor(maxVisiblePages / 2),
      );
      const endPage = Math.min(
        totalAttemptsPages,
        startPage + maxVisiblePages - 1,
      );
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const shouldShowTabs =
    (includeAttempts || previewData?.includeAttempts) &&
    currentReport?.subHeaders &&
    currentReport?.subDataKeys &&
    hasAssessmentData;

  if (!currentReport) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[100dvw] h-[100dvh] max-w-none flex flex-col p-0 sm:max-w-7xl sm:h-[90dvh] sm:rounded-lg">
          <DialogHeader className="flex-shrink-0 p-4 sm:p-6 bg-muted/50 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="space-y-2 sm:space-y-0">
                <DialogTitle className="text-xl sm:text-2xl font-bold">
                  Report Preview
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-semibold">
                      {previewData?.recordCount || 0} total records
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-semibold">
                      {previewData?.fileSize || "0 B"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-semibold">
                      {selectedFormat.toUpperCase()}
                    </span>
                  </div>
                  {includeAttempts && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-semibold">
                        With Student Attempts
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Badge
                variant="secondary"
                className="px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm"
              >
                {includeAttempts && hasAssessmentData
                  ? "Assessment Report + Attempts"
                  : hasAssessmentData
                    ? "Assessment Report"
                    : hasStageData
                      ? "Stage Performance Report"
                      : "Student Overview Report"}
              </Badge>
            </div>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">No report data available</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[100dvw] h-[100dvh] max-w-none flex flex-col p-0 sm:max-w-7xl sm:h-[90dvh] sm:rounded-lg">
        <DialogHeader className="flex-shrink-0 p-4 sm:p-6 bg-muted/50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="space-y-2 sm:space-y-0">
              <DialogTitle className="text-xl sm:text-2xl font-bold">
                Report Preview
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-semibold">
                    {previewData?.recordCount || 0} total records
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-semibold">
                    {previewData?.fileSize || "0 B"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-semibold">
                    {selectedFormat.toUpperCase()}
                  </span>
                </div>
                {(includeAttempts || previewData?.includeAttempts) && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-semibold">With Student Attempts</span>
                  </div>
                )}
              </div>
            </div>
            <Badge
              variant="secondary"
              className="px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm"
            >
              {(includeAttempts || previewData?.includeAttempts) &&
                hasAssessmentData
                ? "Assessment Report + Attempts"
                : hasAssessmentData
                  ? "Assessment Report"
                  : hasStageData
                    ? "Stage Performance Report"
                    : "Student Overview Report"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 p-3 sm:p-6 overflow-hidden">
          <Card className="h-full">
            <CardContent className="p-0 h-full flex flex-col">
              {isStudentReport ? (
                <>
                  <div className="p-3 sm:p-4 border-b bg-muted/30">
                    <h4 className="text-base sm:text-lg font-semibold">
                      Student Overview Data
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Showing {itemsPerPage} records per page
                    </p>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-x-auto">
                      <div className="min-w-max">
                        <Table>
                          <TableHeader className="bg-muted/50">
                            <TableRow>
                              {currentReport.headers.map((header, index) => (
                                <TableHead
                                  key={index}
                                  className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-center border-r last:border-r-0 sm:px-4 sm:py-4 sm:text-sm"
                                >
                                  {header}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentStudentItems.map((row, rowIndex) => (
                              <TableRow
                                key={rowIndex}
                                className="hover:bg-muted/50 transition-colors"
                              >
                                {currentReport.dataKeys.map(
                                  (dataKey, cellIndex) => (
                                    <TableCell
                                      key={cellIndex}
                                      className="whitespace-nowrap px-3 py-3 text-center border-r last:border-r-0 align-middle sm:px-4 sm:py-4"
                                    >
                                      <div className="flex items-center justify-center min-h-[2rem]">
                                        {formatPreviewValue(
                                          currentReport.headers[cellIndex] ||
                                          "",
                                          getValueFromData(row, dataKey),
                                        )}
                                      </div>
                                    </TableCell>
                                  ),
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  {(previewData?.data.length || 0) > 0 && (
                    <div className="border-t p-3 sm:p-4 bg-muted/30">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                          Showing{" "}
                          <span className="font-semibold text-foreground">
                            {indexOfFirstStudentItem + 1}-
                            {Math.min(
                              indexOfLastStudentItem,
                              studentDataFromPreview.length || 0,
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-semibold text-foreground">
                            {studentDataFromPreview.length || 0}
                          </span>{" "}
                          students
                        </div>

                        {totalStudentPages > 1 && (
                          <div className="w-full sm:w-auto">
                            <Pagination>
                              <PaginationContent className="w-full sm:w-auto justify-between sm:justify-normal">
                                <PaginationItem>
                                  <PaginationPrevious
                                    size="sm"
                                    onClick={handlePrevPage}
                                    className={
                                      currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                    }
                                  >
                                    <IoChevronBack className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                    <span className="hidden sm:inline text-xs">
                                      Prev
                                    </span>
                                  </PaginationPrevious>
                                </PaginationItem>

                                <div className="flex items-center gap-1">
                                  {getPageNumbers().map((pageNumber) => (
                                    <PaginationItem key={pageNumber}>
                                      <PaginationLink
                                        size="sm"
                                        onClick={() =>
                                          handlePageClick(pageNumber)
                                        }
                                        isActive={currentPage === pageNumber}
                                        className="cursor-pointer font-semibold text-xs"
                                      >
                                        {pageNumber}
                                      </PaginationLink>
                                    </PaginationItem>
                                  ))}
                                </div>

                                <PaginationItem>
                                  <PaginationNext
                                    size="sm"
                                    onClick={handleNextPage}
                                    className={
                                      currentPage === totalStudentPages
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                    }
                                  >
                                    <span className="hidden sm:inline text-xs">
                                      Next
                                    </span>
                                    <IoChevronForward className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-1" />
                                  </PaginationNext>
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>

                            <div className="sm:hidden text-center text-xs text-muted-foreground mt-2">
                              Page {currentPage} of {totalStudentPages}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : isStageReport ? (
                <>
                  <div className="p-3 sm:p-4 border-b bg-muted/30">
                    <h4 className="text-base sm:text-lg font-semibold">
                      Stage Performance Data
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Showing {itemsPerPage} records per page
                    </p>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-x-auto">
                      <div className="min-w-max">
                        <Table>
                          <TableHeader className="bg-muted/50">
                            <TableRow>
                              {currentReport.headers.map((header, index) => (
                                <TableHead
                                  key={index}
                                  className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-center border-r last:border-r-0 sm:px-4 sm:py-4 sm:text-sm"
                                >
                                  {header}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentStageItems.map((row, rowIndex) => (
                              <TableRow
                                key={rowIndex}
                                className="hover:bg-muted/50 transition-colors"
                              >
                                {currentReport.dataKeys.map(
                                  (dataKey, cellIndex) => (
                                    <TableCell
                                      key={cellIndex}
                                      className="whitespace-nowrap px-3 py-3 text-center border-r last:border-r-0 align-middle sm:px-4 sm:py-4"
                                    >
                                      <div className="flex items-center justify-center min-h-[2rem]">
                                        {formatPreviewValue(
                                          currentReport.headers[cellIndex] ||
                                          "",
                                          getValueFromData(row, dataKey),
                                        )}
                                      </div>
                                    </TableCell>
                                  ),
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  {stageDataFromPreview.length > 0 && (
                    <div className="border-t p-3 sm:p-4 bg-muted/30">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                          Showing{" "}
                          <span className="font-semibold text-foreground">
                            {indexOfFirstStageItem + 1}-
                            {Math.min(
                              indexOfLastStageItem,
                              stageDataFromPreview.length || 0,
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-semibold text-foreground">
                            {stageDataFromPreview.length || 0}
                          </span>{" "}
                          stages
                        </div>

                        {totalStagePages > 1 && (
                          <div className="w-full sm:w-auto">
                            <Pagination>
                              <PaginationContent className="w-full sm:w-auto justify-between sm:justify-normal">
                                <PaginationItem>
                                  <PaginationPrevious
                                    size="sm"
                                    onClick={handlePrevPage}
                                    className={
                                      currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                    }
                                  >
                                    <IoChevronBack className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                    <span className="hidden sm:inline text-xs">
                                      Prev
                                    </span>
                                  </PaginationPrevious>
                                </PaginationItem>

                                <div className="flex items-center gap-1">
                                  {getPageNumbers().map((pageNumber) => (
                                    <PaginationItem key={pageNumber}>
                                      <PaginationLink
                                        size="sm"
                                        onClick={() =>
                                          handlePageClick(pageNumber)
                                        }
                                        isActive={currentPage === pageNumber}
                                        className="cursor-pointer font-semibold text-xs"
                                      >
                                        {pageNumber}
                                      </PaginationLink>
                                    </PaginationItem>
                                  ))}
                                </div>

                                <PaginationItem>
                                  <PaginationNext
                                    size="sm"
                                    onClick={handleNextPage}
                                    className={
                                      currentPage === totalStagePages
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                    }
                                  >
                                    <span className="hidden sm:inline text-xs">
                                      Next
                                    </span>
                                    <IoChevronForward className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-1" />
                                  </PaginationNext>
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>

                            <div className="sm:hidden text-center text-xs text-muted-foreground mt-2">
                              Page {currentPage} of {totalStagePages}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : shouldShowTabs ? (
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="h-full flex flex-col"
                >
                  <TabsList className="w-full p-2 bg-muted/30">
                    <TabsTrigger value="overview" className="flex-1">
                      Assessment Overview ({assessmentDataFromPreview.length})
                    </TabsTrigger>
                    <TabsTrigger value="attempts" className="flex-1">
                      Student Attempts ({assessmentData?.attempts.length || 0})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="overview"
                    className="flex-1 overflow-hidden mt-0"
                  >
                    <div className="space-y-4 h-full flex flex-col">
                      <div className="p-3 sm:p-4 border-b bg-muted/30">
                        <h4 className="text-base sm:text-lg font-semibold">
                          Assessment Overview
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Showing{" "}
                          {Math.min(
                            itemsPerPage,
                            assessmentDataFromPreview.length,
                          )}{" "}
                          records per page
                        </p>
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-x-auto">
                          <div className="min-w-max">
                            <Table>
                              <TableHeader className="bg-muted/50">
                                <TableRow>
                                  {currentReport.headers.map(
                                    (header, index) => (
                                      <TableHead
                                        key={index}
                                        className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-center border-r last:border-r-0 sm:px-4 sm:py-4 sm:text-sm"
                                      >
                                        {header}
                                      </TableHead>
                                    ),
                                  )}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {currentOverviewItems.map((row, rowIndex) => (
                                  <TableRow
                                    key={rowIndex}
                                    className="hover:bg-muted/50 transition-colors"
                                  >
                                    {currentReport.dataKeys.map(
                                      (dataKey, cellIndex) => (
                                        <TableCell
                                          key={cellIndex}
                                          className="whitespace-nowrap px-3 py-3 text-center border-r last:border-r-0 align-middle sm:px-4 sm:py-4"
                                        >
                                          <div className="flex items-center justify-center min-h-[2rem]">
                                            {formatPreviewValue(
                                              currentReport.headers[
                                              cellIndex
                                              ] || "",
                                              getValueFromData(row, dataKey),
                                            )}
                                          </div>
                                        </TableCell>
                                      ),
                                    )}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>

                      {assessmentDataFromPreview.length > 0 && (
                        <div className="border-t p-3 sm:p-4 bg-muted/30">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                              Showing{" "}
                              <span className="font-semibold text-foreground">
                                {indexOfFirstOverviewItem + 1}-
                                {Math.min(
                                  indexOfLastOverviewItem,
                                  assessmentDataFromPreview.length,
                                )}
                              </span>{" "}
                              of{" "}
                              <span className="font-semibold text-foreground">
                                {assessmentDataFromPreview.length}
                              </span>{" "}
                              records
                            </div>

                            {totalOverviewPages > 1 && (
                              <div className="w-full sm:w-auto">
                                <Pagination>
                                  <PaginationContent className="w-full sm:w-auto justify-between sm:justify-normal">
                                    <PaginationItem>
                                      <PaginationPrevious
                                        size="sm"
                                        onClick={handlePrevPage}
                                        className={
                                          currentPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                        }
                                      >
                                        <IoChevronBack className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                        <span className="hidden sm:inline text-xs">
                                          Prev
                                        </span>
                                      </PaginationPrevious>
                                    </PaginationItem>

                                    <div className="flex items-center gap-1">
                                      {getPageNumbers().map((pageNumber) => (
                                        <PaginationItem key={pageNumber}>
                                          <PaginationLink
                                            size="sm"
                                            onClick={() =>
                                              handlePageClick(pageNumber)
                                            }
                                            isActive={
                                              currentPage === pageNumber
                                            }
                                            className="cursor-pointer font-semibold text-xs"
                                          >
                                            {pageNumber}
                                          </PaginationLink>
                                        </PaginationItem>
                                      ))}
                                    </div>

                                    <PaginationItem>
                                      <PaginationNext
                                        size="sm"
                                        onClick={handleNextPage}
                                        className={
                                          currentPage === totalOverviewPages
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                        }
                                      >
                                        <span className="hidden sm:inline text-xs">
                                          Next
                                        </span>
                                        <IoChevronForward className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-1" />
                                      </PaginationNext>
                                    </PaginationItem>
                                  </PaginationContent>
                                </Pagination>

                                <div className="sm:hidden text-center text-xs text-muted-foreground mt-2">
                                  Page {currentPage} of {totalOverviewPages}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="attempts"
                    className="flex-1 overflow-hidden mt-0"
                  >
                    <div className="space-y-4 h-full flex flex-col">
                      <div className="p-3 sm:p-4 border-b bg-muted/30">
                        <h4 className="text-base sm:text-lg font-semibold">
                          Student Attempts
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Showing{" "}
                          {Math.min(
                            itemsPerPage,
                            assessmentData?.attempts.length || 0,
                          )}{" "}
                          records per page
                        </p>
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-x-auto">
                          <div className="min-w-max">
                            <Table>
                              <TableHeader className="bg-muted/50">
                                <TableRow>
                                  {currentReport.subHeaders!.map(
                                    (header, index) => (
                                      <TableHead
                                        key={index}
                                        className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-center border-r last:border-r-0 sm:px-4 sm:py-4 sm:text-sm"
                                      >
                                        {header}
                                      </TableHead>
                                    ),
                                  )}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {currentAttemptItems.map((row, rowIndex) => (
                                  <TableRow
                                    key={rowIndex}
                                    className="hover:bg-muted/50 transition-colors"
                                  >
                                    {currentReport.subDataKeys!.map(
                                      (dataKey, cellIndex) => (
                                        <TableCell
                                          key={cellIndex}
                                          className="whitespace-nowrap px-3 py-3 text-center border-r last:border-r-0 align-middle sm:px-4 sm:py-4"
                                        >
                                          <div className="flex items-center justify-center min-h-[2rem]">
                                            {formatPreviewValue(
                                              currentReport.subHeaders![
                                              cellIndex
                                              ] || "",
                                              getValueFromData(row, dataKey),
                                            )}
                                          </div>
                                        </TableCell>
                                      ),
                                    )}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>

                      {(assessmentData?.attempts.length || 0) > 0 && (
                        <div className="border-t p-3 sm:p-4 bg-muted/30">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                              Showing{" "}
                              <span className="font-semibold text-foreground">
                                {indexOfFirstAttemptItem + 1}-
                                {Math.min(
                                  indexOfLastAttemptItem,
                                  assessmentData?.attempts.length || 0,
                                )}
                              </span>{" "}
                              of{" "}
                              <span className="font-semibold text-foreground">
                                {assessmentData?.attempts.length || 0}
                              </span>{" "}
                              records
                            </div>

                            {totalAttemptsPages > 1 && (
                              <div className="w-full sm:w-auto">
                                <Pagination>
                                  <PaginationContent className="w-full sm:w-auto justify-between sm:justify-normal">
                                    <PaginationItem>
                                      <PaginationPrevious
                                        size="sm"
                                        onClick={handlePrevAttemptsPage}
                                        className={
                                          currentAttemptsPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                        }
                                      >
                                        <IoChevronBack className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                        <span className="hidden sm:inline text-xs">
                                          Prev
                                        </span>
                                      </PaginationPrevious>
                                    </PaginationItem>

                                    <div className="flex items-center gap-1">
                                      {getAttemptsPageNumbers().map(
                                        (pageNumber) => (
                                          <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                              size="sm"
                                              onClick={() =>
                                                handleAttemptsPageClick(
                                                  pageNumber,
                                                )
                                              }
                                              isActive={
                                                currentAttemptsPage ===
                                                pageNumber
                                              }
                                              className="cursor-pointer font-semibold text-xs"
                                            >
                                              {pageNumber}
                                            </PaginationLink>
                                          </PaginationItem>
                                        ),
                                      )}
                                    </div>

                                    <PaginationItem>
                                      <PaginationNext
                                        size="sm"
                                        onClick={handleNextAttemptsPage}
                                        className={
                                          currentAttemptsPage ===
                                            totalAttemptsPages
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                        }
                                      >
                                        <span className="hidden sm:inline text-xs">
                                          Next
                                        </span>
                                        <IoChevronForward className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-1" />
                                      </PaginationNext>
                                    </PaginationItem>
                                  </PaginationContent>
                                </Pagination>

                                <div className="sm:hidden text-center text-xs text-muted-foreground mt-2">
                                  Page {currentAttemptsPage} of{" "}
                                  {totalAttemptsPages}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <>
                  <div className="p-3 sm:p-4 border-b bg-muted/30">
                    <h4 className="text-base sm:text-lg font-semibold">
                      Assessment Overview
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Showing {itemsPerPage} records per page
                    </p>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-x-auto">
                      <div className="min-w-max">
                        <Table>
                          <TableHeader className="bg-muted/50">
                            <TableRow>
                              {currentReport.headers.map((header, index) => (
                                <TableHead
                                  key={index}
                                  className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-center border-r last:border-r-0 sm:px-4 sm:py-4 sm:text-sm"
                                >
                                  {header}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentOverviewItems.map((row, rowIndex) => (
                              <TableRow
                                key={rowIndex}
                                className="hover:bg-muted/50 transition-colors"
                              >
                                {currentReport.dataKeys.map(
                                  (dataKey, cellIndex) => (
                                    <TableCell
                                      key={cellIndex}
                                      className="whitespace-nowrap px-3 py-3 text-center border-r last:border-r-0 align-middle sm:px-4 sm:py-4"
                                    >
                                      <div className="flex items-center justify-center min-h-[2rem]">
                                        {formatPreviewValue(
                                          currentReport.headers[cellIndex] ||
                                          "",
                                          getValueFromData(row, dataKey),
                                        )}
                                      </div>
                                    </TableCell>
                                  ),
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  {assessmentDataFromPreview.length > 0 && (
                    <div className="border-t p-3 sm:p-4 bg-muted/30">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                          Showing{" "}
                          <span className="font-semibold text-foreground">
                            {indexOfFirstOverviewItem + 1}-
                            {Math.min(
                              indexOfLastOverviewItem,
                              assessmentDataFromPreview.length || 0,
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-semibold text-foreground">
                            {assessmentDataFromPreview.length || 0}
                          </span>{" "}
                          records
                        </div>

                        {totalOverviewPages > 1 && (
                          <div className="w-full sm:w-auto">
                            <Pagination>
                              <PaginationContent className="w-full sm:w-auto justify-between sm:justify-normal">
                                <PaginationItem>
                                  <PaginationPrevious
                                    size="sm"
                                    onClick={handlePrevPage}
                                    className={
                                      currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                    }
                                  >
                                    <IoChevronBack className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                    <span className="hidden sm:inline text-xs">
                                      Prev
                                    </span>
                                  </PaginationPrevious>
                                </PaginationItem>

                                <div className="flex items-center gap-1">
                                  {getPageNumbers().map((pageNumber) => (
                                    <PaginationItem key={pageNumber}>
                                      <PaginationLink
                                        size="sm"
                                        onClick={() =>
                                          handlePageClick(pageNumber)
                                        }
                                        isActive={currentPage === pageNumber}
                                        className="cursor-pointer font-semibold text-xs"
                                      >
                                        {pageNumber}
                                      </PaginationLink>
                                    </PaginationItem>
                                  ))}
                                </div>

                                <PaginationItem>
                                  <PaginationNext
                                    size="sm"
                                    onClick={handleNextPage}
                                    className={
                                      currentPage === totalOverviewPages
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                    }
                                  >
                                    <span className="hidden sm:inline text-xs">
                                      Next
                                    </span>
                                    <IoChevronForward className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-1" />
                                  </PaginationNext>
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>

                            <div className="sm:hidden text-center text-xs text-muted-foreground mt-2">
                              Page {currentPage} of {totalOverviewPages}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="border-t p-4 sm:p-6 flex-shrink-0 bg-muted/30">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <Button
              onClick={onClose}
              disabled={isGenerating}
              variant="outline"
              className="order-2 sm:order-1 px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isGenerating}
              className="order-1 sm:order-2 flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-8 sm:py-2 font-semibold text-sm sm:text-base"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <FaDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
