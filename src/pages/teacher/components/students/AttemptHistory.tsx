import { type ReactElement } from "react"
import '../../../../styles/customTable.css'
import { useStudentAttempts } from "../../../../hooks/useStudent"
import { useParams } from "react-router-dom";
import AttemptHistoryItem from "./AttemptHistoryItem";

export default function AttemptHistory(): ReactElement {
  const { studentId } = useParams()
  const { data: studentAttempts } = useStudentAttempts(studentId || "");

  return (
    <div className="h-full w-full overflow-auto table-container">
      <table className="font-primary table-auto">
        <thead className="text-[var(--primary-gray)]">
          <tr className="text-center">
            <th className="">Game Level</th>
            <th className="">Topic</th>
            <th className="">Date Taken</th>
            <th className="">Answer Correctness</th>
            <th className="">Result</th>
          </tr>
        </thead>
        <tbody>
          {studentAttempts && (
            studentAttempts.map((attempt) => (
              <AttemptHistoryItem attempt={attempt} key={attempt._id} />
            ))
          )}
        </tbody>
      </table >
    </div>
  )
}
