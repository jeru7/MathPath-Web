interface ICircularProgressProps {
  classes?: string;
  progress: number;
  color?: string;
  strokeWidth?: number;
}

export default function CircularProgress({
  classes = "",
  progress,
  color = "#347928",
  strokeWidth = 10,
}: ICircularProgressProps) {
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${classes}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background */}
        <circle
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* Progress */}
        <circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-semibold text-lg" style={{ color: `${color}` }}>
          {progress}%
        </p>
      </div>
    </div>
  );
}
