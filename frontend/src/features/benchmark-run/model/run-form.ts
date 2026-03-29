import {
  BenchmarkOptionsResponse,
  CreateBenchmarkRunPayload,
  Scenario,
  requiresSampleId,
  usesDbHoldMs,
  usesExternalStatus,
  usesDelay,
} from "@/entities/benchmark";

export type RunFormState = {
  scenario: Scenario;
  sampleId: string;
  delayMs: string;
  externalStatus: string;
  dbHoldMs: string;
  threadCount: string;
  rampUpSeconds: string;
  durationSeconds: string;
  loopCount: string;
};

export const EMPTY_RUN_FORM: RunFormState = {
  scenario: "mixed",
  sampleId: "1",
  delayMs: "",
  externalStatus: "200",
  dbHoldMs: "",
  threadCount: "",
  rampUpSeconds: "",
  durationSeconds: "",
  loopCount: "",
};

export function applyOptionDefaults(
  form: RunFormState,
  options: BenchmarkOptionsResponse,
): RunFormState {
  return {
    ...form,
    delayMs: form.delayMs || String(options.defaultExternalDelayMs),
    dbHoldMs: form.dbHoldMs || String(options.defaultDbHoldMs),
    threadCount: form.threadCount || String(options.defaultThreadCount),
    rampUpSeconds: form.rampUpSeconds || String(options.defaultRampUpSeconds),
    durationSeconds: form.durationSeconds || String(options.defaultDurationSeconds),
    loopCount: form.loopCount || String(options.defaultLoopCount),
  };
}

export function toCreateBenchmarkRunPayload(
  form: RunFormState,
  options: BenchmarkOptionsResponse | null,
): CreateBenchmarkRunPayload {
  return {
    scenario: form.scenario,
    sampleId: requiresSampleId(form.scenario) ? Number(form.sampleId || "1") : undefined,
    delayMs: usesDelay(form.scenario)
      ? Number(form.delayMs || options?.defaultExternalDelayMs || 100)
      : undefined,
    externalStatus: usesExternalStatus(form.scenario)
      ? Number(form.externalStatus || "200")
      : undefined,
    dbHoldMs: usesDbHoldMs(form.scenario)
      ? Number(form.dbHoldMs || options?.defaultDbHoldMs || 150)
      : undefined,
    threadCount: Number(form.threadCount || options?.defaultThreadCount || 50),
    rampUpSeconds: Number(form.rampUpSeconds || options?.defaultRampUpSeconds || 5),
    durationSeconds: Number(form.durationSeconds || options?.defaultDurationSeconds || 60),
    loopCount: Number(form.loopCount || options?.defaultLoopCount || 10000),
  };
}
