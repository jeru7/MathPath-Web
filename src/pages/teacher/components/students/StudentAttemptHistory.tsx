import { type ReactElement } from "react"

export default function StudentAttemptHistory(): ReactElement {
  return (
    <table className="min-w-full table-auto">
      <thead className="border-b-2 text-[var(--primary-gray)]">
        <tr>
          <th>Game Level</th>
          <th>Topic</th>
          <th>Date Taken</th>
          <th>Answer Correctness</th>
          <th>Result</th>
        </tr>
      </thead>
    </table >
  )
}
