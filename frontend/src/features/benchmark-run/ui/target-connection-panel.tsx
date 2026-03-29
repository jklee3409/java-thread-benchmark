import { cn } from "@/shared/lib/cn";
import { Panel } from "@/shared/ui/panel";
import { StatusPill } from "@/shared/ui/status-pill";

type TargetConnectionPanelProps = {
  apiBaseUrl: string;
  presetTargets: Array<{
    label: string;
    url: string;
  }>;
  onApiBaseUrlChange: (value: string) => void;
  onRefreshConnection: () => void;
  onReloadRuns: () => void;
};

export function TargetConnectionPanel({
  apiBaseUrl,
  presetTargets,
  onApiBaseUrlChange,
  onRefreshConnection,
  onReloadRuns,
}: TargetConnectionPanelProps) {
  return (
    <Panel className="target-panel">
      <div className="panel-head panel-head--spread">
        <div>
          <p className="section-label">대상 선택</p>
          <h3>백엔드 대상</h3>
          <p className="panel-copy">실행과 조회는 이 주소를 기준으로 진행됩니다.</p>
        </div>
        <StatusPill tone="accent">활성 대상</StatusPill>
      </div>

      <div className="target-grid">
        {presetTargets.map((target) => (
          <button
            key={target.url}
            type="button"
            className={cn("target-option", apiBaseUrl === target.url && "target-option-active")}
            onClick={() => onApiBaseUrlChange(target.url)}
          >
            <span>{target.label}</span>
            <strong>{target.url}</strong>
          </button>
        ))}
      </div>

      <label className="field">
        <span className="field-label">직접 입력</span>
        <input
          value={apiBaseUrl}
          onChange={(event) => onApiBaseUrlChange(event.target.value)}
          placeholder="http://localhost:8080"
          className="field-control"
        />
        <span className="field-help">필요하면 커스텀 주소로 결과 조회 대상을 바꿀 수 있습니다.</span>
      </label>

      <div className="panel-actions">
        <button type="button" className="secondary" onClick={onRefreshConnection}>
          연결 확인
        </button>
        <button type="button" className="secondary" onClick={onReloadRuns}>
          이력 새로고침
        </button>
      </div>
    </Panel>
  );
}
