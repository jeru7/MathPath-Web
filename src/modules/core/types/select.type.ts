export type FilterOption = { value: string; label: string };

export const filterOptions: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "ongoing", label: "Ongoing" },
];

export const teacherActivityFilter: FilterOption[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "2w", label: "2 weeks" },
];
