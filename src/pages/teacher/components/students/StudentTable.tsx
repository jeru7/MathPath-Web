import { useEffect, useState, type ReactElement } from "react";
import { Settings, ChevronUp, ChevronDown, Circle } from "lucide-react";
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
      dateCreated: "March 2, 2025",
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
      dateCreated: "March 2, 2025",
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
      dateCreated: "March 2, 2025",
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
      dateCreated: "March 2, 2025",
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

      if (column === "lastPlayed" || column === "dateCreated") {
        const dateA = new Date(a[column] as string);
        const dateB = new Date(b[column] as string);
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
    <div className="h-full overflow-x-auto">
      <table className="font-primary min-w-full table-auto">
        <thead className="border-b-2 border-b-[var(--primary-gray)]">
          <tr className="text-center text-[var(--primary-gray)]">
            <th
              className="px-4 py-2 text-left"
            >
              Student Number
            </th>
            <th
              className="cursor-pointer px-4 py-2"
              onClick={() => handleSort("lastName")}
            >
              <div className={`flex items-center justify-start gap-2 ${sortConfig.key === "lastName" ? "text-[var(--primary-black)]" : ""}`}>
                Name
                {sortConfig.key === "lastName" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
              </div>
            </th>
            <th
              className="cursor-pointer px-4 py-2"
              onClick={() => handleSort("section")}
            >
              <div className={`flex items-center justify-center gap-2 ${sortConfig.key === "section" ? "text-[var(--primary-black)]" : ""}`}>
                Section
                {sortConfig.key === "section" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
              </div>
            </th>
            <th
              className="cursor-pointer px-4 py-2"
              onClick={() => handleSort("status")}
            >
              <div className={`flex items-center justify-center gap-2 ${sortConfig.key === "status" ? "text-[var(--primary-black)]" : ""}`}>
                Status
                {sortConfig.key === "status" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
              </div>
            </th>
            <th className="cursor-pointer px-4 py-2"
              onClick={() => handleSort("dateCreated")}
            >
              <div className={`flex items-center justify-center gap-2 ${sortConfig.key === "dateCreated" ? "text-[var(--primary-black)]" : ""}`}>
                Date Created
                {sortConfig.key === "dateCreated" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
              </div>
            </th>
            <th
              className="cursor-pointer px-4 py-2"
              onClick={() => handleSort("lastPlayed")}
            >
              <div className={`flex items-center justify-center gap-2 ${sortConfig.key === "lastPlayed" ? "text-[var(--primary-black)]" : ""}`}>
                Last Played
                {sortConfig.key === "lastPlayed" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
              </div>
            </th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
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
              <td className={`px-4 py-2 ${student.status === "Online" ? "text-[var(--tertiary-green)]" : "text-[var(--primary-red)]"}`}>
                {student.status}
              </td>
              <td className="px-4 py-2">{student.dateCreated.toString()}</td>
              <td className="px-4 py-2">{student.lastPlayed?.toString()}</td>
              <td className="px-4 py-2">
                <div className="hover:scale-101 flex w-full cursor-pointer items-center justify-center hover:text-[var(--primary-green)]">
                  <Settings />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
