import { type ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PrimaryStat, { IPrimaryStatProps } from "./PrimaryStat";
import StudentTable from "./StudentTable";
import AddButton from "../AddButton";
import AddStudent from "./AddStudent";
import { useTeacherContext } from "../../../../hooks/useTeacher";
import { toast } from "react-toastify";

export default function Students(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { students, onlineStudents, sections } = useTeacherContext();

  const showForm = location.pathname.endsWith("/add-students");
  const mode: string | null = searchParams.get("mode");

  const primaryStats: IPrimaryStatProps[] = [
    {
      color: "bg-[var(--primary-green)]",
      title: "Total Students",
    },
    {
      color: "bg-[var(--primary-orange)]",
      title: "Online Students",
    },
    {
      color: "bg-[var(--secondary-orange)]",
      title: "Average Level",
    },
  ];

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
    <main className="flex w-full flex-col gap-4 bg-inherit p-4 h-full">
      {/* Header */}
      <header className="flex w-full items-center justify-between">
        <h3 className="text-2xl font-bold">Students</h3>
        <AddButton text={"Add Student"} action={handleAddStudent} />
      </header>

      {/* Students overall stats */}
      <section className="flex w-full gap-2">
        {primaryStats.map((stat, index) => (
          <PrimaryStat
            key={index}
            title={stat.title}
            color={stat.color}
            students={students}
            onlineStudents={onlineStudents}
          />
        ))}
      </section>

      {/* Student Table */}
      <section className="overflow-y-hidden w-full h-full bg-white shadow-sm rounded-sm">
        <StudentTable />
      </section>

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
