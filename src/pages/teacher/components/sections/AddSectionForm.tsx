import { useEffect, useState, type ReactElement } from "react"
import { useParams } from "react-router-dom";

import Select from 'react-select'

import { AddSection, SectionColor } from "../../../../types/section"
import { addSection } from "../../../../services/sectionService";
import { Teacher } from "../../../../types/teacher";
import { getTeachers } from "../../../../services/teacherService";

export default function AddSectionForm({ setShowForm }: { setShowForm: (show: boolean) => void }): ReactElement {
  const { teacherId } = useParams();
  const [sectionData, setSectionData] = useState<AddSection>({
    name: "",
    teachers: [] as string[],
    students: [] as string[],
    assessments: [] as string[],
    color: "primary-green",
  })
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachers = await getTeachers();
        const filteredTeachers = teachers.filter((teacher) => teacher._id !== teacherId)

        setTeachers(filteredTeachers);
      } catch (error) {
        console.error("Failed to fetch teachers: ", error)
      }
    }
    fetchTeachers();
  }, [teacherId])

  const teacherOptions = teachers.map((teacher) => ({
    value: teacher._id,
    label: `${teacher.firstName} ${teacher.lastName}`,
  }));

  const handleSelectTeacherChange = (selected: Teacher[]) => {
    const selectedTeacherIds = selected ? selected.map((teacher: Teacher) => teacher._id) : [];
    setSectionData((prev) => ({
      ...prev,
      teachers: selectedTeacherIds,
    }));
  };

  const handleNameInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (value.length >= 40) return;
    setSectionData((prev) => ({
      ...prev,
      name: value,
    }))
    if (showError) setShowError(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sectionData.name.trim()) {
      setSectionData((prev) => ({
        ...prev,
        name: "",
      }))
      setShowError(true)
      return;
    }

    if (!teacherId) {
      console.error("Missing teacher ID.")
      return
    }

    const updatedTeachers: string[] = sectionData.teachers.includes(teacherId as string)
      ? sectionData.teachers
      : [...sectionData.teachers, teacherId];

    console.log(sectionData);

    try {
      await addSection(
        sectionData.name,
        updatedTeachers,
        sectionData.color,
        sectionData.students,
        sectionData.assessments,
      )

      handleCancel();
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancel = () => {
    setShowForm(false);
  };

  return <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/20">
    <form onSubmit={handleSubmit}>
      <div className="w-2xl flex max-w-2xl flex-col gap-8 rounded-md bg-[var(--primary-white)] p-8">
        <div className="border-b-[var(--primary-gray)]/50 border-b-2 pb-2">
          <h2 className="text-2xl font-bold">Add Section</h2>
        </div>
        <div className="flex w-full flex-col gap-8">
          {/* Name input */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <label htmlFor="name" className={`text-xl font-semibold ${showError && "text-red-400"}`}>Name</label>
            </div>
            <input type="text"
              id="name"
              value={sectionData.name}
              onChange={handleNameInputChange}
              className={`border-b bg-inherit p-1 focus:border-b-[var(--primary-green)] focus:outline-none ${showError && "border-b-red-400 focus:border-b-red-400"}`}
              placeholder="Enter name here"
              style={showError ? { color: 'red' } : {}}
            />
          </div>
          {/* Teacher selection */}
          <div>
            <label htmlFor="teachers" className="text-xl font-semibold">
              Teacher
            </label>
            <div className="relative mt-1">
              <div className="mt-1">
                <Select
                  id="teachers"
                  options={teacherOptions}
                  onChange={() => handleSelectTeacherChange}
                  placeholder={teachers.length === 0 ? "No teachers available" : "Select teacher"}
                  isDisabled={teachers.length === 0}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: teachers.length === 0 ? "#d1d5db" : "#ccc",
                      cursor: teachers.length === 0 ? "not-allowed" : "pointer",
                    }),
                    option: (base, { isDisabled }) => ({
                      ...base,
                      color: isDisabled ? "#d1d5db" : base.color,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                    }),
                  }}
                />
              </div>
            </div>
          </div>
          {/* Color Selection */}
          <div className="flex flex-col gap-2">
            <label htmlFor="color" className="text-xl font-semibold">Color</label>
            <div className="flex gap-4">
              {["primary-green", "tertiary-green", "primary-orange", "primary-yellow"].map((color) => (
                <label key={color} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    checked={sectionData.color === color}
                    onChange={() => setSectionData((prev) => ({
                      ...prev,
                      color: color as SectionColor,
                    }))}
                    className="hidden"
                  />
                  <span
                    className={`bg-[var(--${color})] border-1 h-10 w-10 rounded-sm hover:scale-105 ${sectionData.color === color ? "border-3" : ""}`}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end gap-8">
          <button
            className="border-1 rounded-sm px-4 py-1 text-xl hover:scale-105 hover:cursor-pointer"
            onClick={handleCancel}>Cancel</button>
          <button type="submit"
            className="border-1 rounded-sm border-[var(--primary-green)] bg-[var(--primary-green)] px-4 py-1 text-xl text-white hover:scale-105 hover:cursor-pointer"
          >Complete</button>
        </div>
      </div>
    </form>
  </div>
}
