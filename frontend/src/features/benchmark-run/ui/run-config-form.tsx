import { FormEvent } from "react";
import {
  Scenario,
  requiresSampleId,
  scenarioLabel,
  usesDbHoldMs,
  usesDelay,
  usesExternalStatus,
} from "@/entities/benchmark";
import { RunFormState } from "@/features/benchmark-run/model/run-form";
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
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit();
  }

  return (
    <Panel className="form-panel">
      <form onSubmit={handleSubmit}>
        <div className="panel-head">
          <h2>Run Config</h2>
          <span>{isPending ? "Updating" : "Ready"}</span>
        </div>

        <label className="field">
          <span>Scenario</span>
          <select
            value={form.scenario}
            onChange={(event) => onFieldChange("scenario", event.target.value as Scenario)}
          >
            {scenarios.map((scenario) => (
              <option key={scenario} value={scenario}>
                {scenarioLabel(scenario)}
              </option>
            ))}
          </select>
        </label>

        <div className="field-grid">
          <label className="field">
            <span>Sample ID</span>
            <input
              value={form.sampleId}
              disabled={!requiresSampleId(form.scenario)}
              onChange={(event) => onFieldChange("sampleId", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Delay ms</span>
            <input
              value={form.delayMs}
              disabled={!usesDelay(form.scenario)}
              onChange={(event) => onFieldChange("delayMs", event.target.value)}
            />
          </label>
        </div>

        <div className="field-grid">
          <label className="field">
            <span>External Status</span>
            <input
              value={form.externalStatus}
              disabled={!usesExternalStatus(form.scenario)}
              onChange={(event) => onFieldChange("externalStatus", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Threads</span>
            <input
              value={form.threadCount}
              onChange={(event) => onFieldChange("threadCount", event.target.value)}
            />
          </label>
        </div>

        <div className="field-grid">
          <label className="field">
            <span>Ramp-up Sec</span>
            <input
              value={form.rampUpSeconds}
              onChange={(event) => onFieldChange("rampUpSeconds", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Duration Sec</span>
            <input
              value={form.durationSeconds}
              onChange={(event) => onFieldChange("durationSeconds", event.target.value)}
            />
          </label>
        </div>

        <label className="field">
          <span>Loop Count</span>
          <input
            value={form.loopCount}
            onChange={(event) => onFieldChange("loopCount", event.target.value)}
          />
        </label>

        <label className="field">
          <span>DB Hold ms</span>
          <input
            value={form.dbHoldMs}
            disabled={!usesDbHoldMs(form.scenario)}
            onChange={(event) => onFieldChange("dbHoldMs", event.target.value)}
          />
        </label>

        <button type="submit" className="primary wide-button">
          Start benchmark run
        </button>
      </form>
    </Panel>
  );
}
