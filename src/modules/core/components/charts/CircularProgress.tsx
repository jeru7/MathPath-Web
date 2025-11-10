type CircularProgressProps = {
  classes?: string;
  progress: number;
  color?: string;
  strokeWidth?: number;
  size?: number;
};

export default function CircularProgress({
  classes = "",
  progress,
  color = "#347928",
  strokeWidth = 8,
  size = 24,
}: CircularProgressProps) {
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${classes}`}>
      <svg
        viewBox="0 0 100 100"
        className="max-w-24 max-h-24 w-full h-full"
        style={{ minWidth: size, minHeight: size }}
      >
        <circle
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
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
          className="transition-all duration-500 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <p
          className="font-semibold text-sm"
          style={{ color }}
          title={`${Math.round(progress)}% answer correctness`}
        >
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
