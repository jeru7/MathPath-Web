import { type ReactElement } from "react";
import "../../../../core/styles/customTable.css";

export default function AssessmentTable(): ReactElement {
  return (
    <div className="h-full table-container">
      <div className="min-h-full">
        <table className="font-primary table-auto">
          <thead className="text-[var(--primary-gray)]">
            <tr className="text-center">
              <th className="">Title</th>
              <th className="">Topic</th>
              <th className="">Section</th>
              <th className="">Total Participant</th>
              <th className="">Score</th>
              <th className="">Due Date</th>
              <th className="">Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
}
