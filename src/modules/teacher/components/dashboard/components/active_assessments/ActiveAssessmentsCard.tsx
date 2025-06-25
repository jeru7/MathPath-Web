import { type ReactElement } from "react";

export default function ActiveAssessmentsCard({
  classes,
}: {
  classes: string;
}): ReactElement {
  return (
    <article className={`${classes} bg-white shadow-sm rounded-md p-2`}>
      <header>
        <p className="font-semibold text-lg">Active Assessments</p>
      </header>
    </article>
  );
}
