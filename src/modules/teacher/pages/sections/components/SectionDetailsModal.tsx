import { type ReactElement, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaUsers,
  FaUser,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import { Student } from "../../../../student/types/student.type";
import {
  Section,
  SectionColor,
} from "../../../../core/types/section/section.type";
import { useTeacherContext } from "../../../context/teacher.context";
import StudentDetailsModal from "../../students/components/student-details/StudentDetailsModal";
import StudentItem from "./section-details/StudentItem";
import StatsCard from "../../../components/details/StatsCard";

type SectionDetailsModalProps = {
  section: Section;
  isOpen: boolean;
  onClose: () => void;
};

type SectionStats = {
  totalStudents: number;
  activeStudents: number;
  totalAssessments: number;
  averageLevel: number;
  totalStagesCompleted: number;
};

export default function SectionDetailsModal({
  section,
  isOpen,
  onClose,
}: SectionDetailsModalProps): ReactElement {
  const { students } = useTeacherContext();

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);

  const sectionStudents = useMemo(() => {
    return students.filter((student) => student.sectionId === section.id);
  }, [students, section.id]);

  // calculate section stats
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

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* header */}
              <header className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`w-2 sm:w-3 h-8 sm:h-12 rounded-sm ${getBannerColor(section.color)}`}
                  />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                      {section.name}
                    </h2>
                    {/* mobile only stats summary */}
                    <div className="sm:hidden flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {sectionStats.totalStudents} students
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400">
                        {sectionStats.activeStudents} active
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:cursor-pointer flex-shrink-0"
                >
                  <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </header>

              <div className="flex-1 overflow-hidden flex flex-col">
                {/* mobile stats toggle */}
                <div className="sm:hidden border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowMobileStats(!showMobileStats)}
                    className="w-full p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Section Statistics
                    </span>
                    {showMobileStats ? (
                      <FaChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <FaChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  {/* mobile stats dropdown */}
                  <AnimatePresence>
                    {showMobileStats && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
                                  <FaUsers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Total
                                  </p>
                                  <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                                    {sectionStats.totalStudents}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-sm">
                                  <FaUser className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Active
                                  </p>
                                  <p className="text-base font-bold text-green-600 dark:text-green-400">
                                    {sectionStats.activeStudents}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-sm">
                                  <FaChartLine className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Assessments
                                  </p>
                                  <p className="text-base font-bold text-purple-600 dark:text-purple-400">
                                    {sectionStats.totalAssessments}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-sm">
                                  <IoSchool className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Avg Level
                                  </p>
                                  <p className="text-base font-bold text-orange-600 dark:text-orange-400">
                                    {sectionStats.averageLevel}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* desktop stats bar */}
                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 p-3 lg:p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <StatsCard
                    icon={<FaUsers />}
                    title="Total Students"
                    value={sectionStats.totalStudents}
                    iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                    iconColor="text-blue-600 dark:text-blue-400"
                  />

                  <StatsCard
                    icon={<FaUser />}
                    title="Active Students"
                    value={sectionStats.activeStudents}
                    iconBgColor="bg-green-100 dark:bg-green-900/30"
                    iconColor="text-green-600 dark:text-green-400"
                  />

                  <StatsCard
                    icon={<FaChartLine />}
                    title="Total Assessments"
                    value={sectionStats.totalAssessments}
                    iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                    iconColor="text-purple-600 dark:text-purple-400"
                  />

                  <StatsCard
                    icon={<IoSchool />}
                    title="Average Level"
                    value={sectionStats.averageLevel}
                    iconBgColor="bg-orange-100 dark:bg-orange-900/30"
                    iconColor="text-orange-600 dark:text-orange-400"
                  />
                </div>

                {/* main content */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 overflow-hidden">
                  {/* left column: section details */}
                  <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
                    {/* information */}
                    <div className="bg-white dark:bg-gray-800 rounded-sm p-4 border border-gray-200 dark:border-gray-700 h-fit">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <IoSchool className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Section Details
                      </h3>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Section Name
                          </label>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                            {section.name}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                              Created
                            </label>
                            <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                              {formatDate(section.createdAt)}
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                              Last Updated
                            </label>
                            <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                              {formatDate(section.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* right column: students list */}
                  <div className="lg:col-span-3 flex flex-col h-full order-1 lg:order-2">
                    <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-sm bg-white dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
                              <FaUsers className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                                Student List
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {sectionStats.totalStudents} enrolled •{" "}
                                {sectionStats.activeStudents} active
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* scrollable students list */}
                      <div className="flex-1 min-h-0 overflow-hidden max-h-[550px]">
                        {!students ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-2"></div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                Loading student data...
                              </p>
                            </div>
                          </div>
                        ) : sectionStudents.length === 0 ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <FaUsers className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
                              </div>
                              <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                No Students Enrolled
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                                No students are currently assigned to this
                                section.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full overflow-y-auto p-3 sm:p-4">
                            <div className="grid gap-2 sm:gap-3">
                              {sectionStudents.map((student, index) => (
                                <StudentItem
                                  key={student.id}
                                  student={student}
                                  index={index}
                                  onStudentClick={handleStudentClick}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* student details modal */}
      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          isOpen={isStudentModalOpen}
          onClose={handleStudentModalClose}
        />
      )}
    </>
  );
}
