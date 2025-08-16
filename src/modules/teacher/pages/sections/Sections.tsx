import { useEffect, useState, type ReactElement } from "react";
import CreateSectionForm from "./components/CreateSectionForm";
import SectionGrid from "./components/section_grid/SectionGrid";
import { useTeacherContext } from "../../context/teacher.context";
import { AnimatePresence, motion } from "framer-motion";
import { GoPlus } from "react-icons/go";

export default function Sections(): ReactElement {
  const { sections } = useTeacherContext();
  const [showForm, setShowForm] = useState(false);
  const [showAddButton, setShowAddButton] = useState<boolean>(false);

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
            onClick={() => setShowForm(true)}
          >
            <GoPlus className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center justify-between py-1">
        <h3 className="text-xl sm:text-2xl font-bold">Sections</h3>
      </header>

      {/* Section grid list */}
      <section className="bg-white flex-1 rounded-sm shadow-sm">
        <SectionGrid sections={sections} setShowForm={setShowForm} />
      </section>

      {showForm && <CreateSectionForm setShowForm={setShowForm} />}
    </main>
  );
}
