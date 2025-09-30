interface CustomizedAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string | number;
  };
}

export const CustomAxisTick = (props: CustomizedAxisTickProps) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        fontSize={10}
        className="truncate max-w-[80px]"
      >
        {payload?.value}
      </text>
    </g>
  );
};
