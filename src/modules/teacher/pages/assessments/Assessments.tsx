import { useEffect, useState, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AssessmentTable from "./components/assessment_table/AssessmentTable";
import { useTeacherAssessments } from "../../services/teacher.service";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { GoPlus } from "react-icons/go";

export default function Assessments(): ReactElement {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { teacherId } = useParams();
  const { data: assessments = [], isLoading } = useTeacherAssessments(
    teacherId ?? "",
  );

  const [showAddButton, setShowAddButton] = useState<boolean>(false);

  useEffect(() => {
    queryClient.refetchQueries({
      queryKey: ["teacher", teacherId, "assessments"],
    });
  }, [queryClient, teacherId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const atBottom = scrollPosition >= pageHeight - 10;

      setShowAddButton(!atBottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading || !teacherId) return <p>Loading</p>;

  return (
    <main className="flex flex-col h-full min-h-screen w-full max-w-[2400px] gap-2 bg-inherit p-2">
      <AnimatePresence>
        {showAddButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 100, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-full h-16 w-16 bg-[var(--primary-green)]/90 fixed z-5 right-5 bottom-5 flex items-center justify-center md:hidden"
            type="button"
            onClick={() => navigate("new")}
          >
            <GoPlus className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
          Assessments
        </h3>
      </header>

      {/* table section */}
      <section className="bg-white border border-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 rounded-sm overflow-y-hidden shadow-sm w-full flex-1 flex flex-col">
        <AssessmentTable assessments={assessments} navigate={navigate} />
      </section>
    </main>
  );
}
