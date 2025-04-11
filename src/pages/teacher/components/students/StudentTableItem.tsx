import { type ReactElement } from "react"

import { Circle, Settings } from "lucide-react"
import { format } from "date-fns"

import { Student } from "../../../../types/student"

export default function StudentTableItem({ student }: { student: Student }): ReactElement {
  return (
    <tr className="hover:bg-[var(--primary-gray)]/10 cursor-pointer text-center" key={student.studentNumber}>
      <td className="px-4 py-2 text-left">{student.studentNumber}</td>
      <td className="max-w-[200px] truncate px-4 py-2 text-left">
        <div className="flex items-center gap-2">
          <Circle className="h-10 w-10" />
          <p>
            {`${student.lastName}, ${student.firstName}`}
          </p>
        </div>
      </td>
      <td className="px-4 py-2">{student.section}</td>
      <td className={`px-4 py-2 font-bold ${student.status === "Online" ? "text-[var(--tertiary-green)]" : "text-[var(--primary-red)]"}`}>
        {student.status}
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
