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
      return "Redis 집중";
    case "db-heavy":
      return "DB 집중";
    case "io-heavy":
      return "외부 API 집중";
    case "mixed":
      return "혼합";
    case "contention-heavy":
      return "병목 유도";
  }
}

export function scenarioDescription(scenario: Scenario): string {
  switch (scenario) {
    case "redis-heavy":
      return "캐시 조회 비중을 높여 Redis 응답과 스레드 전환 영향을 확인합니다.";
    case "db-heavy":
      return "MySQL 조회와 HikariCP 대기 상태를 중심으로 DB 병목을 점검합니다.";
    case "io-heavy":
      return "외부 API 지연과 오류를 주입해 I/O 대기 차이를 비교합니다.";
    case "mixed":
      return "Redis, DB, 외부 API가 함께 포함된 일반 서비스형 요청 흐름입니다.";
    case "contention-heavy":
      return "DB hold 시간을 늘려 connection pool 대기 병목을 의도적으로 만듭니다.";
  }
}

export function threadModeLabel(mode: string | null | undefined): string {
  if (mode == null || mode === "") {
    return "연결 안 됨";
  }

  const normalized = mode.toLowerCase();
  if (normalized.includes("virtual") || normalized === "vt") {
    return "가상 스레드";
  }
  if (normalized.includes("platform") || normalized === "pt") {
    return "플랫폼 스레드";
  }

  return mode;
}

export function runStatusLabel(status: RunStatus): string {
  switch (status) {
    case "queued":
      return "대기";
    case "running":
      return "실행 중";
    case "succeeded":
      return "완료";
    case "failed":
      return "실패";
  }
}

export function runStatusTone(
  status: RunStatus,
): "neutral" | "accent" | "warning" | "success" | "danger" {
  switch (status) {
    case "queued":
      return "warning";
    case "running":
      return "accent";
    case "succeeded":
      return "success";
    case "failed":
      return "danger";
  }
}

export function layerLabel(layer: string): string {
  const normalized = layer.toLowerCase();

  if (normalized.includes("redis")) {
    return "Redis";
  }
  if (normalized.includes("external") || normalized.includes("api")) {
    return "외부 API";
  }
  if (normalized.includes("db") || normalized.includes("mysql") || normalized.includes("jdbc")) {
    return "DB";
  }
  if (normalized.includes("http") || normalized.includes("request") || normalized.includes("overall")) {
    return "전체 요청";
  }

  return layer;
}

export function severityLabel(severity: string): string {
  const normalized = severity.toLowerCase();

  if (normalized.includes("critical") || normalized.includes("severe")) {
    return "심각";
  }
  if (normalized.includes("warn")) {
    return "주의";
  }
  if (normalized.includes("info")) {
    return "안내";
  }

  return severity;
}

export function severityTone(
  severity: string,
): "neutral" | "accent" | "warning" | "success" | "danger" {
  const normalized = severity.toLowerCase();

  if (normalized.includes("critical") || normalized.includes("severe")) {
    return "danger";
  }
  if (normalized.includes("warn")) {
    return "warning";
  }
  if (normalized.includes("success")) {
    return "success";
  }

  return "neutral";
}

export function formatDateTime(value: string | null | undefined): string {
  if (value == null || value === "") {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function isActiveRun(status: RunStatus): boolean {
  return status === "queued" || status === "running";
}
