import { type ReactElement } from "react";
import { useStudentAssessments } from "../../services/student.service";
import { useStudentContext } from "../../contexts/student.context";
import AssessmentTable from "./components/AssessmentTable";
import { useNavigate } from "react-router-dom";

export default function Assessments(): ReactElement {
  const { studentId } = useStudentContext();
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

      <div className="w-full flex gap-2">
        <article className="bg-white dark:bg-gray-800 rounded-sm shadow-sm w-full h-24 p-2 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <header className="text-center">
            <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
              Total Assessments
            </p>
          </header>
        </article>
        <article className="bg-white dark:bg-gray-800 rounded-sm shadow-sm w-full h-24 p-2 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <header className="text-center">
            <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
              Pending Assessments
            </p>
          </header>
        </article>
        <article className="bg-white dark:bg-gray-800 rounded-sm shadow-sm w-full h-24 p-2 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <header className="text-center">
            <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
              Total Average
            </p>
          </header>
        </article>
        <article className="bg-white dark:bg-gray-800 rounded-sm shadow-sm w-full h-24 p-2 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <header className="text-center">
            <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
              Due Soon
            </p>
          </header>
        </article>
        <article className="bg-white dark:bg-gray-800 rounded-sm shadow-sm w-full h-24 p-2 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <header className="text-center">
            <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
              Last Taken
            </p>
          </header>
        </article>
      </div>

      <section className="bg-white dark:bg-gray-800 rounded-sm overflow-y-hidden shadow-sm w-full flex-1 flex flex-col border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <AssessmentTable assessments={assessments} navigate={navigate} />
      </section>
    </main>
  );
}
