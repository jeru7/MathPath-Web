import { useEffect, useMemo, useState, type ReactElement } from "react"

import { Circle, Settings } from "lucide-react"
import { format } from "date-fns"

import { StudentStatusEnum, StudentType } from "../../../../types/student"
import { useTeacherContext } from "../../../../hooks/useTeacherData"
import { SectionType } from "../../../../types/section"

export default function StudentTableItem({ student }: { student: StudentType }): ReactElement {
  const { sections, onlineStudents } = useTeacherContext();
  const onlineStudentIds = useMemo(() => new Set(onlineStudents.map(student => student._id)), [onlineStudents])
  const [status, setStatus] = useState<StudentStatusEnum>(StudentStatusEnum.OFFLINE)

  // get the section name using the section id on the student
  const getSectionName = (sectionId: string) => {
    const studentSection: SectionType | undefined = sections.find((section) => section._id === sectionId)
    return studentSection ? studentSection.name : "Unknown section"
  }

  useEffect(() => {
    setStatus(onlineStudentIds.has(student._id) ? StudentStatusEnum.ONLINE : StudentStatusEnum.OFFLINE)
  }, [onlineStudentIds, student._id])

  return (
    <tr className="hover:bg-[var(--primary-gray)]/10 cursor-pointer text-center">
      <td className="px-4 py-2 text-left">{student.studentNumber}</td>
      <td className="max-w-[200px] truncate px-4 py-2 text-left">
        <div className="flex items-center gap-2">
          <Circle className="h-10 w-10" />
          <p>
            {`${student.lastName}, ${student.firstName}`}
          </p>
        </div>
      </td>
      <td className="px-4 py-2">{getSectionName(student.section)}</td>
      <td className={`px-4 py-2 font-bold ${status === StudentStatusEnum.ONLINE ? "text-[var(--tertiary-green)]" : "text-[var(--primary-red)]"}`}>
        {status}
      </td>
      <td className="px-4 py-2">{format(new Date(student.createdAt.toString()), "MMMM d, yyyy")}</td>
      <td className="px-4 py-2">{format(new Date(student.lastPlayed?.toString()), "MMMM d, yyyy")}</td>
      <td className="px-4 py-2">
        <div className="hover:scale-101 flex w-full cursor-pointer items-center justify-center hover:text-[var(--primary-green)]">
          <Settings />
        </div>
      </td>
    </tr>
  )
}
