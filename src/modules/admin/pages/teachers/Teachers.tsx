import { useEffect, useState, type ReactElement } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import TeacherTable from "./TeacherTable";
import TeacherDetailsModal from "./TeacherDetailsModal";
import AddTeacherModal from "./AddTeacherModal";

export default function Teachers(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { teacherId } = useParams();

  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const pathEnd = location.pathname.split("/").pop();
  const isAddTeacherRoute = pathEnd === "add-teacher";

  useEffect(() => {
    if (teacherId) {
      setSelectedTeacher(teacherId);
    } else {
      setSelectedTeacher(null);
    }
  }, [teacherId]);

  const isTeacherDetailsRoute =
    selectedTeacher !== null && pathEnd === selectedTeacher;

  const handleTeacherClick = (teacherId: string) => {
    setSelectedTeacher(teacherId);
    navigate(teacherId);
  };

  const handleAddTeacher = () => {
    navigate("add-teacher");
  };

  const handleCloseModal = () => {
    navigate("..");
  };

  return (
    <main className="flex flex-col min-h-screen h-full w-full mt-4 md:mt-0 gap-2 bg-inherit p-2">
      {/* header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
          Teachers
        </h3>
      </header>

      <section className="overflow-y-hidden w-full flex-1 flex flex-col">
        <TeacherTable
          onTeacherClick={handleTeacherClick}
          onAddTeacher={handleAddTeacher}
        />
      </section>

      {/* add teacher modal */}
      <AddTeacherModal isOpen={isAddTeacherRoute} onClose={handleCloseModal} />

      {/* teacher details modal */}
      <TeacherDetailsModal
        isOpen={isTeacherDetailsRoute}
        onClose={handleCloseModal}
        teacherId={selectedTeacher}
      />
    </main>
  );
}
