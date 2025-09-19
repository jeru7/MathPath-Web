import { type ReactElement } from "react";
import { useAdminContext } from "../../context/admin.context";
import TeacherListItem from "./TeacherListItem";
import AddTeacherForm from "./AddTeacherForm";
import { useNavigate } from "react-router-dom";

export default function Dashboard(): ReactElement {
  const { teachers } = useAdminContext();
  const navigate = useNavigate();
  const showForm = location.pathname.endsWith("/add-teacher");

  const handleAddTeacher = () => {
    navigate("add-teacher");
  };
  return (
    <main className="flex flex-col h-full min-h-screen w-full max-w-[2400px] gap-2 bg-inherit p-4">
      {/* header */}
      <header className="flex items-center justify-between py-1">
        <h3 className="text-xl sm:text-2xl font-bold">Dashboard</h3>
      </header>
      <div className="flex flex-1 gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <div className="rounded-sm bg-white drop-shadow-md flex flex-1 flex-col gap-2 py-2 px-3">
            <header>
              <p className="text-sm sm:text-base md:text-lg font-semibold">
                Teachers
              </p>
            </header>
            <ul className="flex-1 flex flex-col gap-1">
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <TeacherListItem key={teacher.id} teacher={teacher} />
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="italic text-gray-300">No data available</p>
                </div>
              )}
            </ul>
          </div>
          <button
            className="bg-[var(--primary-green)] text-white rounded-sm w-fit h-fit py-3 px-4 self-end opacity-80 hover:cursor-pointer hover:opacity-100 transition-opacity duration-200"
            onClick={handleAddTeacher}
          >
            Add Teacher
          </button>
        </div>
        {/* right column */}
        <div className="flex-1 rounded-sm bg-white drop-shadow-md"></div>
      </div>
      {showForm && (
        <div className="fixed w-screen h-screen bg-black/30 left-0 top-0 z-20 flex items-center justify-center">
          <AddTeacherForm onClose={() => navigate("..")} />
        </div>
      )}
    </main>
  );
}
