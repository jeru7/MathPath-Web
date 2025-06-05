import { type ReactElement } from "react";
import HalfCircleProgress from "./HalfCircleProgress";

export default function ProgressCard({
  title,
}: {
  title: string;
}): ReactElement {
  return (
    <article className="w-full h-full rounded-md shadow-sm bg-white px-4 py-2 flex flex-col items-center">
      <p className="font-semibold">{title}</p>
      <div className="w-full h-full flex items-center justify-center">
        <HalfCircleProgress percentage={100} />
      </div>
    </article>
  );
}
