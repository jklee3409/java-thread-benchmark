import { FormEvent } from "react";
import {
  Scenario,
  requiresSampleId,
  scenarioDescription,
  scenarioLabel,
  usesDbHoldMs,
  usesDelay,
  usesExternalStatus,
} from "@/entities/benchmark";
import { RunFormState } from "@/features/benchmark-run/model/run-form";
import { Panel } from "@/shared/ui/panel";
import { StatusPill } from "@/shared/ui/status-pill";

type RunConfigFormProps = {
  form: RunFormState;
  scenarios: Scenario[];
  isPending: boolean;
  onFieldChange: <K extends keyof RunFormState>(field: K, value: RunFormState[K]) => void;
  onSubmit: () => Promise<void>;
};

export function RunConfigForm({
  form,
  scenarios,
  isPending,
  onFieldChange,
  onSubmit,
}: RunConfigFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit();
  }

  const showSampleId = requiresSampleId(form.scenario);
  const showDelay = usesDelay(form.scenario);
  const showExternalStatus = usesExternalStatus(form.scenario);
  const showDbHoldMs = usesDbHoldMs(form.scenario);

  return (
    <Panel className="form-panel" id="execute">
      <form onSubmit={handleSubmit}>
        <div className="panel-head panel-head--spread">
          <div>
            <p className="section-label">부하 테스트 실행</p>
            <h2>실행 조건을 정하고 바로 테스트하세요</h2>
            <p className="panel-copy">
              같은 조건으로 VT/PT를 번갈아 실행해야 결과 차이를 해석하기 쉽습니다.
            </p>
          </div>
          <StatusPill tone={isPending ? "accent" : "neutral"}>
            {isPending ? "실행 요청 중" : "준비 완료"}
          </StatusPill>
        </div>

        <div className="form-section">
          <label className="field">
            <span>실험 시나리오</span>
            <select
              value={form.scenario}
              onChange={(event) => onFieldChange("scenario", event.target.value as Scenario)}
              aria-describedby="scenario-help"
            >
              {scenarios.map((scenario) => (
                <option key={scenario} value={scenario}>
                  {scenarioLabel(scenario)}
                </option>
              ))}
            </select>
          </label>
          <p id="scenario-help" className="field-help">
            {scenarioDescription(form.scenario)}
          </p>
          <div className="scenario-summary">
            <strong>{scenarioLabel(form.scenario)}</strong>
            <p>{scenarioDescription(form.scenario)}</p>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-copy">
            <strong>기본 부하</strong>
            <p className="panel-copy">동시 사용자 수와 실행 시간을 먼저 맞추세요.</p>
          </div>
          <div className="field-grid">
            <label className="field">
              <span>동시 사용자 수</span>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={form.threadCount}
                placeholder="예: 200"
                onChange={(event) => onFieldChange("threadCount", event.target.value)}
              />
            </label>
            <label className="field">
              <span>램프업 시간(초)</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={form.rampUpSeconds}
                placeholder="예: 5"
                onChange={(event) => onFieldChange("rampUpSeconds", event.target.value)}
              />
            </label>
          </div>

          <div className="field-grid">
            <label className="field">
              <span>실행 시간(초)</span>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={form.durationSeconds}
                placeholder="예: 60"
                onChange={(event) => onFieldChange("durationSeconds", event.target.value)}
              />
            </label>
            <label className="field">
              <span>반복 횟수</span>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={form.loopCount}
                placeholder="예: 10000"
                onChange={(event) => onFieldChange("loopCount", event.target.value)}
              />
            </label>
          </div>
        </div>

        {(showSampleId || showDelay || showExternalStatus || showDbHoldMs) && (
          <div className="form-section form-section--accent">
            <div className="form-section-copy">
              <strong>추가 옵션</strong>
              <p className="panel-copy">선택한 시나리오에서 필요한 값만 노출합니다.</p>
            </div>
            <div className="field-grid">
              {showSampleId ? (
                <label className="field">
                  <span>샘플 ID</span>
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={form.sampleId}
                    placeholder="예: 1"
                    onChange={(event) => onFieldChange("sampleId", event.target.value)}
                  />
                </label>
              ) : null}

              {showDelay ? (
                <label className="field">
                  <span>외부 API 지연(ms)</span>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={form.delayMs}
                    placeholder="예: 150"
                    onChange={(event) => onFieldChange("delayMs", event.target.value)}
                  />
                </label>
              ) : null}

              {showExternalStatus ? (
                <label className="field">
                  <span>외부 API 응답 코드</span>
                  <input
                    type="number"
                    min="100"
                    max="599"
                    inputMode="numeric"
                    value={form.externalStatus}
                    placeholder="예: 200"
                    onChange={(event) => onFieldChange("externalStatus", event.target.value)}
                  />
                </label>
              ) : null}

              {showDbHoldMs ? (
                <label className="field">
                  <span>DB hold 시간(ms)</span>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={form.dbHoldMs}
                    placeholder="예: 250"
                    onChange={(event) => onFieldChange("dbHoldMs", event.target.value)}
                  />
                </label>
              ) : null}
            </div>
          </div>
        )}

        <details className="details-card">
          <summary>추천 입력 기준</summary>
          <div className="details-copy">
            <p>
              동시 사용자 수와 실행 시간은 먼저 고정하고, 스레드 방식만 바꿔 두 번 실행하는 편이
              비교에 가장 유리합니다.
            </p>
            <p>
              병목 유도 시나리오는 DB hold 시간을 높여 풀 대기를 만들고, 외부 API 중심 시나리오는
              지연과 응답 코드를 조절해 느린 I/O 상황을 재현합니다.
            </p>
          </div>
        </details>

        <div className="form-footer">
          <p className="panel-copy">
            실행이 끝나면 최근 결과 목록과 분석 영역이 자동으로 갱신됩니다.
          </p>
          <button type="submit" className="primary wide-button" disabled={isPending}>
            {isPending ? "실행 요청 중..." : "부하 테스트 실행"}
          </button>
        </div>
      </form>
    </Panel>
  );
}
