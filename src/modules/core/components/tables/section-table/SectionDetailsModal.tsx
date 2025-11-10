import { type ReactElement, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaUser,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { Section, SectionColor } from "../../../types/section/section.type";
import { Student } from "../../../../student/types/student.type";
import StudentDetailsModal from "../student-table/student-details/StudentDetailsModal";
import { SectionTableContext } from "./SectionTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import StudentList from "./StudentList";

type SectionDetailsModalProps = {
  context: SectionTableContext;
  section: Section;
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  disableEdit?: boolean;
  disableDelete?: boolean;
  archiveLabel?: string;
};

type SectionStats = {
  totalStudents: number;
  activeStudents: number;
  totalAssessments: number;
  averageLevel: number;
  totalStagesCompleted: number;
};

export default function SectionDetailsModal({
  context,
  section,
  isOpen,
  onClose,
  sections,
  onEdit,
  onArchive,
  onDelete,
  disableEdit = false,
  disableDelete = false,
  archiveLabel = "Archive",
}: SectionDetailsModalProps): ReactElement {
  const { allStudents } = context;

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const sectionStudents = useMemo(() => {
    return allStudents.filter((student) => student.sectionId === section.id);
  }, [allStudents, section.id]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const sectionStats = useMemo((): SectionStats => {
    const totalStudents = sectionStudents.length;
    const activeStudents = sectionStudents.filter(
      (s) =>
        s.lastOnline &&
        new Date(s.lastOnline) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ).length;

    const totalLevels = sectionStudents.reduce(
      (total, student) => total + (student.level || 1),
      0,
    );
    const averageLevel =
      totalStudents > 0
        ? Math.round((totalLevels / totalStudents) * 10) / 10
        : 0;

    const totalStagesCompleted = sectionStudents.reduce(
      (total, student) =>
        total +
        (student.stages?.filter((stage) => stage.completed)?.length || 0),
      0,
    );

    const totalAssessments = sectionStudents.reduce(
      (total, student) => total + (student.assessments?.length || 0),
      0,
    );

    return {
      totalStudents,
      activeStudents,
      totalAssessments,
      averageLevel,
      totalStagesCompleted,
    };
  }, [sectionStudents]);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleStudentModalClose = () => {
    setIsStudentModalOpen(false);
    setSelectedStudent(null);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const getBannerColor = (color: SectionColor): string => {
    const colorMap: Record<SectionColor, string> = {
      "primary-green": "bg-green-500",
      "tertiary-green": "bg-emerald-400",
      "primary-orange": "bg-orange-500",
      "primary-yellow": "bg-yellow-500",
    };
    return colorMap[color] || "bg-gray-500";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const StatsCard = ({
    icon,
    title,
    value,
    className = "",
  }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    className?: string;
  }) => (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <div className="text-primary text-lg">{icon}</div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[100dvw] h-[100dvh] max-w-none flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-12 rounded-sm ${getBannerColor(section.color)}`}
              />
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {section.name}
                </DialogTitle>
                <div className="sm:hidden flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {sectionStats.totalStudents} students
                  </span>
                  <span className="text-sm text-green-600">
                    {sectionStats.activeStudents} active
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pb-2">
            {/* mobile stats toggle */}
            <div className="sm:hidden">
              <Card className="p-0 overflow-hidden">
                <button
                  onClick={() => setShowMobileStats(!showMobileStats)}
                  className="w-full p-4 flex items-center justify-between"
                >
                  <span className="text-sm font-medium">
                    Section Statistics
                  </span>
                  {showMobileStats ? (
                    <FaChevronUp className="w-4 h-4" />
                  ) : (
                    <FaChevronDown className="w-4 h-4" />
                  )}
                </button>

                <AnimatePresence>
                  {showMobileStats && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t grid grid-cols-2 gap-4">
                        <StatsCard
                          icon={<FaUsers />}
                          title="Total Students"
                          value={sectionStats.totalStudents}
                        />
                        <StatsCard
                          icon={<FaUser />}
                          title="Active Students"
                          value={sectionStats.activeStudents}
                        />
                        <StatsCard
                          icon={<FaChartLine />}
                          title="Assessments"
                          value={sectionStats.totalAssessments}
                        />
                        <StatsCard
                          icon={<IoSchool />}
                          title="Avg Level"
                          value={sectionStats.averageLevel}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>

            {/* desktop stats */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                icon={<FaUsers />}
                title="Total Students"
                value={sectionStats.totalStudents}
              />
              <StatsCard
                icon={<FaUser />}
                title="Active Students"
                value={sectionStats.activeStudents}
              />
              <StatsCard
                icon={<FaChartLine />}
                title="Assessments"
                value={sectionStats.totalAssessments}
              />
              <StatsCard
                icon={<IoSchool />}
                title="Avg Level"
                value={sectionStats.averageLevel}
              />
            </div>

            {/* section details */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <IoSchool className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Section Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Section Name
                  </label>
                  <p className="text-sm font-semibold p-2 rounded-lg bg-muted/50">
                    {section.name}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Created
                  </label>
                  <p className="text-sm text-muted-foreground p-2 rounded-lg bg-muted/50">
                    {formatDate(section.createdAt)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Last Updated
                  </label>
                  <p className="text-sm text-muted-foreground p-2 rounded-lg bg-muted/50">
                    {formatDate(section.updatedAt)}
                  </p>
                </div>
              </div>
            </Card>

            {/* student list */}
            <Card className="overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FaUsers className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Student List</h3>
                      <p className="text-sm text-muted-foreground">
                        {sectionStudents.length} of {sectionStats.totalStudents}{" "}
                        students
                        {searchTerm && ` matching "${searchTerm}"`}
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-64">
                    <div className="relative">
                      <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pl-9 pr-8 h-9"
                      />
                      {searchTerm && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearSearch}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <StudentList
                  students={sectionStudents}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  onClearSearch={handleClearSearch}
                  onStudentClick={handleStudentClick}
                  isLoading={!allStudents}
                />
              </div>
            </Card>
          </div>

          {/* footer actions */}
          <div className="border-t pt-4 mt-4 flex-shrink-0 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center justify-between">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Badge variant="outline" className="text-xs">
                Last updated: {formatDate(section.updatedAt)}
              </Badge>
            </div>
            <div className="flex gap-2 justify-center sm:justify-end">
              {!disableEdit && onEdit && (
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  Edit
                </Button>
              )}
              {onArchive && (
                <Button
                  variant="outline"
                  onClick={handleArchive}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  {archiveLabel}
                </Button>
              )}
              {onDelete && !disableDelete && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* student details modal */}
      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          isOpen={isStudentModalOpen}
          onClose={handleStudentModalClose}
          sections={sections}
        />
      )}
    </>
  );
}
