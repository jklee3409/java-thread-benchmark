import { FormEvent, useEffect, useState } from "react";
import {
  Scenario,
  scenarioDescription,
  scenarioLabel,
  usesDbHoldMs,
  usesDelay,
  usesExternalStatus,
  requiresSampleId,
} from "@/entities/benchmark";
import {
  RunFormField,
  RunFormState,
  validateRunForm,
  validateRunFormField,
} from "@/features/benchmark-run/model/run-form";
import { cn } from "@/shared/lib/cn";
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
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<RunFormField, boolean>>
  >({});
  const [errors, setErrors] = useState<Partial<Record<RunFormField, string>>>({});
  const showSampleId = requiresSampleId(form.scenario);
  const showDelay = usesDelay(form.scenario);
  const showExternalStatus = usesExternalStatus(form.scenario);
  const showDbHoldMs = usesDbHoldMs(form.scenario);

  useEffect(() => {
    const nextErrors: Partial<Record<RunFormField, string>> = {};

    (Object.keys(touchedFields) as RunFormField[]).forEach((field) => {
      if (!touchedFields[field]) {
        return;
      }

      const message = validateRunFormField(form, field);
      if (message) {
        nextErrors[field] = message;
      }
    });

    setErrors(nextErrors);
  }, [form, touchedFields]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateRunForm(form);
    setTouchedFields({
      scenario: true,
      sampleId: true,
      delayMs: true,
      externalStatus: true,
      dbHoldMs: true,
      threadCount: true,
      rampUpSeconds: true,
      durationSeconds: true,
      loopCount: true,
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit();
  }

  function markTouched(field: RunFormField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function renderNumberField(
    field: RunFormField,
    label: string,
    placeholder: string,
    min?: number,
    max?: number,
  ) {
    const message = errors[field];

    return (
      <label className="field">
        <span className="field-label">{label}</span>
        <input
          type="number"
          min={min}
          max={max}
          inputMode="numeric"
          value={form[field]}
          placeholder={placeholder}
          className={cn("field-control", message && "field-control-error")}
          aria-invalid={message ? "true" : "false"}
          onChange={(event) => onFieldChange(field, event.target.value)}
          onBlur={() => markTouched(field)}
        />
        {message ? <span className="field-error">{message}</span> : null}
      </label>
    );
  }

  return (
    <Panel className="form-panel" id="run-form">
      <form onSubmit={handleSubmit}>
        <div className="panel-head panel-head--spread">
          <div>
            <p className="section-label">부하 테스트 실행</p>
            <h3>실행 조건</h3>
            <p className="panel-copy">필수 조건만 빠르게 입력하고 바로 실행합니다.</p>
          </div>
          <StatusPill tone={isPending ? "warning" : "neutral"}>
            {isPending ? "실행 요청 중" : "대기"}
          </StatusPill>
        </div>

        <div className="form-section">
          <label className="field">
            <span className="field-label">시나리오</span>
            <select
              value={form.scenario}
              className="field-control"
              onChange={(event) => onFieldChange("scenario", event.target.value as Scenario)}
              onBlur={() => markTouched("scenario")}
            >
              {scenarios.map((scenario) => (
                <option key={scenario} value={scenario}>
                  {scenarioLabel(scenario)}
                </option>
              ))}
            </select>
            <span className="field-help">{scenarioDescription(form.scenario)}</span>
          </label>
        </div>

        <div className="form-section">
          <div className="form-section-heading">
            <strong>기본 부하</strong>
            <span>비교 기준이 되는 공통 조건입니다.</span>
          </div>

          <div className="field-grid">
            {renderNumberField("threadCount", "동시 사용자 수", "50", 1)}
            {renderNumberField("rampUpSeconds", "램프업(초)", "5", 0)}
            {renderNumberField("durationSeconds", "지속 시간(초)", "60", 1)}
            {renderNumberField("loopCount", "반복 수", "10000", 1)}
          </div>
        </div>

        {(showSampleId || showDelay || showExternalStatus || showDbHoldMs) && (
          <div className="form-section">
            <div className="form-section-heading">
              <strong>추가 옵션</strong>
              <span>선택한 시나리오에서만 사용하는 세부 값입니다.</span>
            </div>

            <div className="field-grid">
              {showSampleId
                ? renderNumberField("sampleId", "샘플 ID", "1", 1)
                : null}
              {showDelay
                ? renderNumberField("delayMs", "외부 API 지연(ms)", "150", 0)
                : null}
              {showExternalStatus
                ? renderNumberField(
                    "externalStatus",
                    "외부 API 응답 코드",
                    "200",
                    100,
                    599,
                  )
                : null}
              {showDbHoldMs
                ? renderNumberField("dbHoldMs", "DB hold 시간(ms)", "250", 0)
                : null}
            </div>
          </div>
        )}

        <details className="compact-help">
          <summary>입력 기준</summary>
          <div className="compact-help-body">
            <p>동일한 스레드 수와 지속 시간을 유지한 뒤 대상만 바꿔 실행하면 비교가 쉽습니다.</p>
            <p>병목 유도 시나리오는 DB hold 시간을 조절해 connection pool 대기를 확인합니다.</p>
          </div>
        </details>

        <div className="form-actions">
          <button type="submit" className="primary" disabled={isPending}>
            {isPending ? "실행 요청 중..." : "부하 테스트 실행"}
          </button>
        </div>
      </form>
    </Panel>
  );
}
