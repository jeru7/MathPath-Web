import { useEffect, useState, type ReactElement } from "react";
import { Settings, ChevronUp, ChevronDown } from "lucide-react";
import { StudentTableItem } from "../../../../types/student";

export default function StudentTable(): ReactElement {
  const [students, setStudents] = useState<StudentTableItem[]>([
    {
      studentNumber: "02000284765",
      firstName: "John Emmanuel",
      lastName: "Ungab",
      middleName: "Rivera",
      email: "jack@mathpath.com",
      section: "CS601",
      status: "Online",
      lastPlayed: "March 31, 2025",
    },
    {
      studentNumber: "02000284765",
      firstName: "Oliver Sam",
      lastName: "Marquez",
      middleName: "Rivera",
      email: "jack@mathpath.com",
      section: "CS602",
      status: "Offline",
      lastPlayed: "March 31, 2022",
    },
    {
      studentNumber: "02000284765",
      firstName: "Loriel Ann",
      lastName: "Ventura",
      middleName: "Rivera",
      email: "jack@mathpath.com",
      section: "CS604",
      status: "Online",
      lastPlayed: "January 1, 2025",
    },
    {
      studentNumber: "02000284765",
      firstName: "Kathleen Kate",
      lastName: "Dayoha",
      middleName: "Rivera",
      email: "jack@mathpath.com",
      section: "CS604",
      status: "Offline",
      lastPlayed: "February 3, 2025",
    },
  ]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof StudentTableItem;
    direction: "ascending" | "descending";
  }>({ key: "status", direction: "descending" });

  const handleSort = (column: keyof StudentTableItem) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedStudents = [...students].sort((a, b) => {
      let comparison = 0;

      if (column === "lastPlayed") {
        const dateA = new Date(a[column]);
        const dateB = new Date(b[column]);
        comparison = dateA.getTime() - dateB.getTime();
      } else if (typeof a[column] === "string" && typeof b[column] === "string") {
        comparison = a[column].localeCompare(b[column]);
      } else if (typeof a[column] === "number" && typeof b[column] === "number") {
        comparison = a[column] - b[column];
      }

      return direction === "ascending" ? -comparison : comparison;
    });

    setStudents(sortedStudents);
    setSortConfig({ key: column, direction });
  };

  useEffect(() => {
    handleSort("status")
  }, [])


  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr className="text-center text-[var(--primary-gray)]">
          <th
            className="cursor-pointer px-4 py-2"
          >
            Student Number
          </th>
          <th
            className="cursor-pointer px-4 py-2"
            onClick={() => handleSort("lastName")}
          >
            <div className="flex items-center justify-center">
              Name
              {sortConfig.key === "lastName" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
            </div>
          </th>
          <th
            className="cursor-pointer px-4 py-2"
            onClick={() => handleSort("section")}
          >
            <div className="flex items-center justify-center">
              Section
              {sortConfig.key === "section" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
            </div>
          </th>
          <th
            className="cursor-pointer px-4 py-2"
            onClick={() => handleSort("status")}
          >
            <div className="flex items-center justify-center">
              Status
              {sortConfig.key === "status" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
            </div>
          </th>
          <th className="px-4 py-2">Created Date</th>
          <th
            className="cursor-pointer px-4 py-2"
            onClick={() => handleSort("lastPlayed")}
          >
            <div className="flex items-center justify-center">
              Last Played
              {sortConfig.key === "lastPlayed" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
            </div>
          </th>
          <th className="px-4 py-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr className="text-center" key={student.studentNumber}>
            <td className="px-4 py-2">{student.studentNumber}</td>
            <td className="px-4 py-2">{`${student.lastName}, ${student.firstName}`}</td>
            <td className="px-4 py-2">{student.section}</td>
            <td className="px-4 py-2">{student.status}</td>
            <td className="px-4 py-2">{student.lastPlayed.toString()}</td>
            <td className="px-4 py-2">{student.lastPlayed.toString()}</td>
            <td className="px-4 py-2">
              <div className="flex w-full items-center justify-center">
                <Settings />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
