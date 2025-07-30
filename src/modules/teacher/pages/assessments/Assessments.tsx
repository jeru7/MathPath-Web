import { type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AssessmentTable from "./components/assessment_table/AssessmentTable";
import { useTeacherAssessments } from "../../services/teacher.service";

export default function Assessments(): ReactElement {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const { data: assessments = [], isLoading } = useTeacherAssessments(
    teacherId ?? "",
  );

  if (isLoading || !teacherId) return <p>Loading</p>;

  return (
    <main className="flex flex-col h-full w-full p-4 gap-2">
      {/* Header */}
      <header className="flex w-full items-center py-1 justify-between">
        <h3 className="text-2xl font-bold">Assessments</h3>
      </header>

      {/* Table section */}
      <section className="bg-white rounded-sm overflow-y-hidden shadow-sm w-full h-full min-h-[600px]">
        <AssessmentTable assessments={assessments} navigate={navigate} />
      </section>
    </main>
  );
}
