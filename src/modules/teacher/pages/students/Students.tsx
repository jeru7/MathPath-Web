import { useEffect, useState, type ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StudentTable from "./components/StudentTable";
import { useTeacherContext } from "../../context/teacher.context";
import AddStudent from "./components/add-student/AddStudent";

export default function Students(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { sections } = useTeacherContext();

  const showForm = location.pathname.endsWith("/add-students");

  const mode: string | null = searchParams.get("mode");

  const [showAddButton, setShowAddButton] = useState<boolean>(false);

  const handleAddStudent = () => {
    if (sections.length === 0) {
      toast.error("You can't add students if there are no section.");
      return;
    }
    navigate("add-students");
  };

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

  return (
    <main className="flex flex-col h-full min-h-screen w-full max-w-[2400px] gap-2 bg-inherit p-4">
      {/* Header */}
      <header className="flex items-center justify-between py-1">
        <h3 className="text-xl sm:text-2xl font-bold">Students</h3>
      </header>

      {/* Student item/list */}
      <section className="overflow-y-hidden w-full bg-white shadow-md rounded-sm flex-1 flex flex-col">
        <StudentTable
          onClickAddStudent={handleAddStudent}
          showAddButton={showAddButton}
        />
      </section>

      {/* Add student dialog */}
      {showForm && (
        <AddStudent
          navigate={navigate}
          initialMode={mode as "manual" | "generate" | null}
        />
      )}
    </main>
  );
}
