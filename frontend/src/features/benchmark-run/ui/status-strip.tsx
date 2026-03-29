import { threadModeLabel } from "@/entities/benchmark";

type StatusStripProps = {
  mode: string | undefined;
  runCount: number;
  selectedRunId: number | null;
  comparisonRunId: number | null;
};

export function StatusStrip({
  mode,
  runCount,
  selectedRunId,
  comparisonRunId,
}: StatusStripProps) {
  const items = [
    { label: "Mode", value: threadModeLabel(mode) },
    { label: "Runs", value: `${runCount}` },
    { label: "Run", value: selectedRunId == null ? "-" : `#${selectedRunId}` },
    { label: "Compare", value: comparisonRunId == null ? "-" : `#${comparisonRunId}` },
  ];

  return (
    <section className="status-strip" aria-label="실험 상태 요약">
      {items.map((item) => (
        <div key={item.label} className="status-chip">
          <span className="status-chip-label">{item.label}</span>
          <strong className="status-chip-value">{item.value}</strong>
        </div>
      ))}
    </section>
  );
}
