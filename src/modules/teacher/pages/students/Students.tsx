import { useEffect, useState, type ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StudentTable from "./components/StudentTable";
import { useTeacherContext } from "../../context/teacher.context";
import { AnimatePresence, motion } from "framer-motion";
import AddStudent from "./components/add-student/AddStudent";
import { GoPlus } from "react-icons/go";
import RegistrationCode from "./registration-codes/RegistrationCode";

export default function Students(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { sections } = useTeacherContext();

  const showForm = location.pathname.endsWith("/add-students");
  const showCodes = location.pathname.endsWith("/registration-codes");

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
      <AnimatePresence>
        {showAddButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 100, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-full h-16 w-16 bg-[var(--primary-green)]/90 fixed z-5 right-5 bottom-5 flex items-center justify-center md:hidden"
            type="button"
            onClick={handleAddStudent}
          >
            <GoPlus className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center justify-between py-1">
        <h3 className="text-xl sm:text-2xl font-bold">Students</h3>
      </header>

      {/* Student item/list */}
      <section className="overflow-y-hidden w-full bg-white shadow-md rounded-sm flex-1 flex flex-col">
        <StudentTable onClickAddStudent={handleAddStudent} />
      </section>

      {/* add student dialog */}
      {showForm && (
        <AddStudent
          navigate={navigate}
          initialMode={mode as "manual" | "generate" | null}
        />
      )}

      {showCodes && <RegistrationCode navigate={navigate} />}
    </main>
  );
}
