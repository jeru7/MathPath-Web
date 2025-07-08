import { type ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTeacherContext } from "../../hooks/useTeacher";
import StudentTable from "./components/StudentTable";
import AddStudent from "./components/AddStudent";

export default function StudentsPage(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { sections } = useTeacherContext();

  const showForm = location.pathname.endsWith("/add-students");
  const mode: string | null = searchParams.get("mode");

  const handleAddStudent = () => {
    if (sections.length === 0) {
      toast.error("You can't add students if there are no section.");
      return;
    }
    navigate("add-students");
  };

  const handleCloseForm = () => {
    navigate("students");
  };

  return (
    <main className="flex w-full flex-col gap-2 bg-inherit p-4 h-full">
      {/* Header */}
      <header className="flex w-full py-1 items-center justify-between">
        <h3 className="text-2xl font-bold">Students</h3>
      </header>

      {/* Student item/list */}
      <section className="overflow-y-hidden w-full bg-white shadow-sm rounded-sm h-full">
        <StudentTable />
      </section>

      {/* Add student dialog */}
      {showForm && (
        <AddStudent
          setShowForm={handleCloseForm}
          navigate={navigate}
          initialMode={mode as "manual" | "generate" | null}
        />
      )}
    </main>
  );
}
