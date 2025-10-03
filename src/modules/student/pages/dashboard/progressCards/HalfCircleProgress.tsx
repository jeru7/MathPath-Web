import { type ReactElement } from "react";

export default function HalfCircleProgress({
  percentage,
}: {
  percentage: number;
}): ReactElement {
  const rotation = (percentage / 100) * 180;
  return (
    <div className="relative w-32 h-16 overflow-hidden">
      <div className="absolute inset-0 flex items-end justify-center">
        <p className="text-lg">{percentage}%</p>
      </div>
      <div className="w-32 h-32 rounded-full border-[10px] border-[var(--secondary-green)] absolute top-0 left-0"></div>
      <div
        className="w-32 h-32 rounded-full border-[10px] border-gray-200 absolute top-0 left-0"
        style={{
          clip: "rect(0px, 128px, 64px, 0px)",
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center center",
        }}
      ></div>
    </div>
  );
}
