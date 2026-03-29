import { DEFAULT_API_BASE_URL } from "@/shared/constants/runtime";
import { RunStatus, Scenario } from "./types";

export function formatNumber(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

export function formatDelta(value: number): string {
  if (!Number.isFinite(value)) {
    return "0.00";
  }
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
}

export function requiresSampleId(scenario: Scenario): boolean {
  return scenario !== "io-heavy";
}

export function usesDelay(scenario: Scenario): boolean {
  return (
    scenario === "io-heavy" ||
    scenario === "mixed" ||
    scenario === "contention-heavy"
  );
}

export function usesExternalStatus(scenario: Scenario): boolean {
  return scenario === "io-heavy";
}

export function usesDbHoldMs(scenario: Scenario): boolean {
  return scenario === "contention-heavy";
}

export function scenarioLabel(scenario: Scenario): string {
  switch (scenario) {
    case "redis-heavy":
      return "Redis Heavy";
    case "db-heavy":
      return "DB Heavy";
    case "io-heavy":
      return "IO Heavy";
    case "mixed":
      return "Mixed";
    case "contention-heavy":
      return "Contention Heavy";
  }
}

export function isActiveRun(status: RunStatus): boolean {
  return status === "queued" || status === "running";
}
