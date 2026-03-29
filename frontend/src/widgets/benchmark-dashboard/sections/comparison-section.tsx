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
      <div className="section-head">
        <div>
          <p className="section-label">비교</p>
          <h2>두 실행 결과를 나란히 비교합니다.</h2>
          <p className="section-subtitle">
            기준 Run과 비교 Run을 선택해 처리량, 지연, 오류율 차이를 빠르게 확인합니다.
          </p>
        </div>
      </div>

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
