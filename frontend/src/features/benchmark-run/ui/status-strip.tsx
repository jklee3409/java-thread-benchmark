type StatusStripProps = {
  mode: string | undefined;
  runCount: number;
  selectedRunId: number | null;
  comparisonRunId: number | null;
  message: string;
  error: string;
};

export function StatusStrip({
  mode,
  runCount,
  selectedRunId,
  comparisonRunId,
  message,
  error,
}: StatusStripProps) {
  return (
    <section className="status-strip">
      <div className="status-card">
        <span>Mode</span>
        <strong>{mode ?? "N/A"}</strong>
      </div>
      <div className="status-card">
        <span>Known Runs</span>
        <strong>{runCount}</strong>
      </div>
      <div className="status-card">
        <span>Selection</span>
        <strong>{selectedRunId ?? "None"}</strong>
      </div>
      <div className="status-card">
        <span>Comparison</span>
        <strong>{comparisonRunId ?? "None"}</strong>
      </div>
      <div className="status-card">
        <span>Message</span>
        <strong>{error || message}</strong>
      </div>
    </section>
  );
}
