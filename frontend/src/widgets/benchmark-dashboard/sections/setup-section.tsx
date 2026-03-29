import {
  Scenario,
  scenarioDescription,
  scenarioLabel,
  threadModeLabel,
} from "@/entities/benchmark";
import {
  RunConfigForm,
  RunFormState,
  TargetConnectionPanel,
} from "@/features/benchmark-run";
import { Panel } from "@/shared/ui/panel";

type SetupSectionProps = {
  currentMode: string | undefined;
  apiBaseUrl: string;
  presetTargets: Array<{
    label: string;
    url: string;
  }>;
  onApiBaseUrlChange: (value: string) => void;
  onRefreshConnection: () => void;
  onReloadRuns: () => void;
  form: RunFormState;
  scenarios: Scenario[];
  isSubmitting: boolean;
  onFieldChange: <K extends keyof RunFormState>(field: K, value: RunFormState[K]) => void;
  onSubmit: () => Promise<void>;
};

export function SetupSection({
  currentMode,
  apiBaseUrl,
  presetTargets,
  onApiBaseUrlChange,
  onRefreshConnection,
  onReloadRuns,
  form,
  scenarios,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: SetupSectionProps) {
  return (
    <section className="dashboard-section" id="setup">
      <div className="section-head">
        <div>
          <p className="section-label">설정</p>
          <h2>실험 조건을 구성합니다.</h2>
          <p className="section-subtitle">
            대상 선택과 부하 조건 입력을 분리해 동일한 기준으로 비교할 수 있게 구성합니다.
          </p>
        </div>
      </div>

      <div className="setup-layout">
        <TargetConnectionPanel
          apiBaseUrl={apiBaseUrl}
          presetTargets={presetTargets}
          onApiBaseUrlChange={onApiBaseUrlChange}
          onRefreshConnection={onRefreshConnection}
          onReloadRuns={onReloadRuns}
        />

        <div className="section-stack">
          <RunConfigForm
            form={form}
            scenarios={scenarios}
            isPending={isSubmitting}
            onFieldChange={onFieldChange}
            onSubmit={onSubmit}
          />

          <Panel className="setup-side-panel">
            <div className="panel-head">
              <div>
                <h3>현재 설정 요약</h3>
                <p className="panel-copy">
                  선택한 시나리오에 맞는 주요 옵션만 노출합니다.
                </p>
              </div>
            </div>

            <div className="setup-stat-grid">
              <div className="setup-stat">
                <span>현재 대상</span>
                <strong>{threadModeLabel(currentMode)}</strong>
              </div>
              <div className="setup-stat">
                <span>시나리오</span>
                <strong>{scenarioLabel(form.scenario)}</strong>
              </div>
              <div className="setup-stat">
                <span>스레드 수</span>
                <strong>{form.threadCount || "-"}</strong>
              </div>
              <div className="setup-stat">
                <span>지속 시간</span>
                <strong>
                  {form.durationSeconds ? `${form.durationSeconds}초` : "-"}
                </strong>
              </div>
            </div>

            <div className="setup-hint-card">
              <span>시나리오 설명</span>
              <strong>{scenarioLabel(form.scenario)}</strong>
              <p>{scenarioDescription(form.scenario)}</p>
            </div>

            <div className="setup-hint-card">
              <span>연결 주소</span>
              <strong>{apiBaseUrl}</strong>
              <p>선택한 주소를 기준으로 옵션 조회, 실행, 결과 분석이 진행됩니다.</p>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
