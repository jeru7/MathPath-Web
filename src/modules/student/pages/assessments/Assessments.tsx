import { type ReactElement } from "react";
import { useStudentContext } from "../../contexts/student.context";
import AssessmentTable from "./components/AssessmentTable";
import { useNavigate } from "react-router-dom";
import { useStudentAssessments } from "../../services/student-assessment.service";

export default function Assessments(): ReactElement {
  const { studentId, student } = useStudentContext();
  const { data: assessments, isPending: assessmentPending } =
    useStudentAssessments(studentId);
  const navigate = useNavigate();

  if (assessmentPending)
    return (
      <div className="text-gray-900 dark:text-gray-100">
        Loading assessment...
      </div>
    );

  return (
    <main className="flex flex-col h-full min-h-screen w-full max-w-[2400px] gap-2 bg-inherit p-2 transition-colors duration-200">
      <header className="flex w-full items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
          Assessment
        </h3>
      </header>

      <section className="bg-white dark:bg-gray-800 rounded-sm overflow-y-hidden shadow-sm w-full flex-1 flex flex-col border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <AssessmentTable
          assessments={assessments}
          navigate={navigate}
          student={student}
        />
      </section>
    </main>
  );
}
