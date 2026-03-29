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

export type RunFormField = keyof RunFormState;

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

export function validateRunFormField(
  form: RunFormState,
  field: RunFormField,
): string {
  if (field === "scenario") {
    return "";
  }

  if (!shouldValidateField(form.scenario, field)) {
    return "";
  }

  const rule = FIELD_RULES[field];
  if (rule == null) {
    return "";
  }

  const rawValue = form[field].trim();
  if (rawValue === "") {
    return `${rule.label}을 입력하세요.`;
  }

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return `${rule.label}은 정수로 입력하세요.`;
  }

  if (rule.min != null && parsed < rule.min) {
    return `${rule.label}은 ${rule.min} 이상이어야 합니다.`;
  }

  if (rule.max != null && parsed > rule.max) {
    return `${rule.label}은 ${rule.max} 이하여야 합니다.`;
  }

  return "";
}

export function validateRunForm(
  form: RunFormState,
): Partial<Record<RunFormField, string>> {
  const nextErrors: Partial<Record<RunFormField, string>> = {};

  (Object.keys(FIELD_RULES) as RunFormField[]).forEach((field) => {
    const message = validateRunFormField(form, field);
    if (message) {
      nextErrors[field] = message;
    }
  });

  return nextErrors;
}

const FIELD_RULES: Partial<
  Record<
    RunFormField,
    {
      label: string;
      min?: number;
      max?: number;
    }
  >
> = {
  sampleId: {
    label: "샘플 ID",
    min: 1,
  },
  delayMs: {
    label: "외부 API 지연",
    min: 0,
  },
  externalStatus: {
    label: "외부 API 응답 코드",
    min: 100,
    max: 599,
  },
  dbHoldMs: {
    label: "DB hold 시간",
    min: 0,
  },
  threadCount: {
    label: "동시 사용자 수",
    min: 1,
  },
  rampUpSeconds: {
    label: "램프업 시간",
    min: 0,
  },
  durationSeconds: {
    label: "지속 시간",
    min: 1,
  },
  loopCount: {
    label: "반복 수",
    min: 1,
  },
};

function shouldValidateField(scenario: Scenario, field: RunFormField): boolean {
  switch (field) {
    case "sampleId":
      return requiresSampleId(scenario);
    case "delayMs":
      return usesDelay(scenario);
    case "externalStatus":
      return usesExternalStatus(scenario);
    case "dbHoldMs":
      return usesDbHoldMs(scenario);
    case "scenario":
      return false;
    default:
      return true;
  }
}
