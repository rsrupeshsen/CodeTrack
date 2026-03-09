import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";

type HeatmapValue = { date: string; count: number };

export default function Heatmap({
  data,
  title,
  color,
  year,
  onYearChange,
  availableYears,
}: {
  data: HeatmapValue[];
  title: string;
  color: "green" | "blue";
  year: number;
  onYearChange: (y: number) => void;
  availableYears: number[];
}) {
  const id = `heatmap-tip-${color}`;

  const startDate = new Date(`${year}-01-01`);
  const endDate =
    year === new Date().getFullYear()
      ? new Date()
      : new Date(`${year}-12-31`);

  const colorMap =
    color === "green"
      ? ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
      : ["#161b22", "#0c2d6b", "#1251c5", "#2f81f7", "#58a6ff"];

  const totalContributions = data
    .filter((d) => d.date.startsWith(String(year)))
    .reduce((sum, d) => sum + d.count, 0);

  return (
    <div>
      <style>{`
        .heatmap-${color} .react-calendar-heatmap rect { rx: 2; }
        .heatmap-${color} .color-empty   { fill: ${colorMap[0]}; }
        .heatmap-${color} .color-scale-1 { fill: ${colorMap[1]}; }
        .heatmap-${color} .color-scale-2 { fill: ${colorMap[2]}; }
        .heatmap-${color} .color-scale-3 { fill: ${colorMap[3]}; }
        .heatmap-${color} .color-scale-4 { fill: ${colorMap[4]}; }
        .heatmap-${color} .react-calendar-heatmap text {
          fill: #6b7280;
          font-size: 9px;
        }
      `}</style>

      {/* Header — total + year buttons */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">
          <span style={{ color: colorMap[4], fontWeight: 600 }}>
            {totalContributions}
          </span>{" "}
          contributions in {year}
        </p>
        <div className="flex gap-1">
          {availableYears.map((y) => (
            <button
              key={y}
              onClick={() => onYearChange(y)}
              className="px-2 py-0.5 rounded text-xs transition-all cursor-pointer"
              style={{
                background: y === year ? colorMap[3] : "transparent",
                color:      y === year ? "#fff"       : "#6b7280",
                border:     `1px solid ${y === year ? colorMap[3] : "#374151"}`,
                fontWeight: y === year ? 600 : 400,
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div className={`heatmap-${color} overflow-x-auto`}>
      <CalendarHeatmap
  {...({
    startDate: startDate,
    endDate: endDate,
    values: data.filter((d) => d.date.startsWith(String(year))),
    classForValue: (value: any) => {
      if (!value || value.count === 0) return "color-empty";
      if (value.count >= 10) return "color-scale-4";
      if (value.count >= 5)  return "color-scale-3";
      if (value.count >= 2)  return "color-scale-2";
      return "color-scale-1";
    },
    tooltipDataAttrs: (value: any) => ({
      "data-tooltip-id": id,
      "data-tooltip-content": value?.date
        ? `${value.date}: ${value.count} contributions`
        : "No contributions",
    }),
    showWeekdayLabels: true,
    showMonthLabels: true,
  } as any)}
/>
        <Tooltip id={id} />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <span className="text-xs text-muted-foreground">Less</span>
        {colorMap.map((c, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: c }}
          />
        ))}
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
}