import { cn } from "@/shared/lib/cn";
import { Panel } from "@/shared/ui/panel";

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
      <div className="panel-head">
        <div>
          <p className="section-label">대상 선택</p>
          <h2>어느 백엔드로 실험할지 정하세요</h2>
          <p className="panel-copy">
            이 주소를 기준으로 실행과 결과 조회가 함께 동작합니다.
          </p>
        </div>
      </div>

      <div className="target-choice-grid">
        {presetTargets.map((target) => (
          <button
            key={target.url}
            type="button"
            className={cn("target-choice", apiBaseUrl === target.url && "is-active")}
            onClick={() => onApiBaseUrlChange(target.url)}
          >
            <span>{target.label}</span>
            <strong>{target.url}</strong>
          </button>
        ))}
      </div>

      <label className="field">
        <span>직접 입력할 주소</span>
        <input
          value={apiBaseUrl}
          onChange={(event) => onApiBaseUrlChange(event.target.value)}
          placeholder="http://localhost:8080"
          aria-describedby="api-base-url-help"
        />
      </label>
      <p id="api-base-url-help" className="field-help">
        프리셋을 누르면 주소가 자동으로 바뀌고, 필요하면 직접 수정할 수 있습니다.
      </p>
      <div className="target-actions">
        <button type="button" className="secondary" onClick={onRefreshConnection}>
          연결 확인
        </button>
        <button type="button" className="secondary" onClick={onReloadRuns}>
          결과 새로고침
        </button>
      </div>
    </Panel>
  );
}
