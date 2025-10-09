import { type ReactElement, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AssessmentTable from "./components/assessment_table/AssessmentTable";
import { useTeacherAssessments } from "../../services/teacher.service";
import { useQueryClient } from "@tanstack/react-query";

export default function Assessments(): ReactElement {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const queryClient = useQueryClient();

  const { data: assessments = [], isLoading } = useTeacherAssessments(
    teacherId ?? "",
  );

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["teacher", teacherId, "assessments"],
    });
  }, [queryClient, teacherId]);

  if (isLoading || !teacherId) return <div>Loading...</div>;

  return (
    <main className="flex flex-col h-full min-h-screen w-full max-w-[2400px] gap-2 bg-inherit p-2">
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
