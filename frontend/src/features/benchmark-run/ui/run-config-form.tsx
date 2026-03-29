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
        <div className="panel-head">
          <h3>Run</h3>
        </div>

        <div className="form-section">
          <label className="field">
            <span className="field-label">Scenario</span>
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
          <div className="field-grid">
            {renderNumberField("threadCount", "Threads", "50", 1)}
            {renderNumberField("rampUpSeconds", "Ramp-up", "5", 0)}
            {renderNumberField("durationSeconds", "Duration", "60", 1)}
            {renderNumberField("loopCount", "Loops", "10000", 1)}
          </div>
        </div>

        {(showSampleId || showDelay || showExternalStatus || showDbHoldMs) && (
          <div className="form-section">
            <div className="field-grid">
              {showSampleId ? renderNumberField("sampleId", "Sample", "1", 1) : null}
              {showDelay ? renderNumberField("delayMs", "Delay", "150", 0) : null}
              {showExternalStatus
                ? renderNumberField("externalStatus", "Status", "200", 100, 599)
                : null}
              {showDbHoldMs ? renderNumberField("dbHoldMs", "DB Hold", "250", 0) : null}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="primary" disabled={isPending}>
            {isPending ? "Running..." : "Run"}
          </button>
        </div>
      </form>
    </Panel>
  );
}
