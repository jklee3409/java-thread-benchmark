import {
  BenchmarkRunDetailResponse,
  BenchmarkRunSummaryResponse,
} from "@/entities/benchmark";
import { RunComparisonPanel } from "@/features/benchmark-run";

type ComparisonSectionProps = {
  runs: BenchmarkRunSummaryResponse[];
  baselineRun: BenchmarkRunDetailResponse | null;
  comparisonRun: BenchmarkRunDetailResponse | null;
  baselineRunId: number | null;
  comparisonRunId: number | null;
  isBaselineLoading: boolean;
  isComparisonLoading: boolean;
  onBaselineRunIdChange: (runId: number | null) => void;
  onComparisonRunIdChange: (runId: number | null) => void;
};

export function ComparisonSection({
  runs,
  baselineRun,
  comparisonRun,
  baselineRunId,
  comparisonRunId,
  isBaselineLoading,
  isComparisonLoading,
  onBaselineRunIdChange,
  onComparisonRunIdChange,
}: ComparisonSectionProps) {
  return (
    <section className="dashboard-section" id="comparison">
      <RunComparisonPanel
        runs={runs}
        baselineRun={baselineRun}
        comparisonRun={comparisonRun}
        baselineRunId={baselineRunId}
        comparisonRunId={comparisonRunId}
        isBaselineLoading={isBaselineLoading}
        isComparisonLoading={isComparisonLoading}
        onBaselineRunIdChange={onBaselineRunIdChange}
        onComparisonRunIdChange={onComparisonRunIdChange}
      />
    </section>
  );
}
