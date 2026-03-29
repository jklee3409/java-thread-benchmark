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
      return "Redis 중심";
    case "db-heavy":
      return "DB 중심";
    case "io-heavy":
      return "외부 API 중심";
    case "mixed":
      return "혼합";
    case "contention-heavy":
      return "병목 유도";
  }
}

export function scenarioDescription(scenario: Scenario): string {
  switch (scenario) {
    case "redis-heavy":
      return "캐시 조회 비중이 높아 Redis 응답 시간과 처리량 안정성을 보기 좋습니다.";
    case "db-heavy":
      return "MySQL 조회를 집중적으로 발생시켜 HikariCP 풀 압박과 JDBC 대기를 드러냅니다.";
    case "io-heavy":
      return "느린 외부 API 호출을 중심으로 VT/PT의 블로킹 I/O 대응 차이를 비교합니다.";
    case "mixed":
      return "Redis, DB, 외부 API를 함께 섞어 서비스형 요청 흐름에서의 종합 성능을 봅니다.";
    case "contention-heavy":
      return "DB hold 시간을 늘려 제한된 풀에서 커넥션 대기 병목을 의도적으로 만듭니다.";
  }
}

export function threadModeLabel(mode: string | null | undefined): string {
  if (mode == null || mode === "") {
    return "연결되지 않음";
  }

  const normalized = mode.toLowerCase();
  if (normalized.includes("virtual") || normalized === "vt") {
    return "버추얼 스레드";
  }
  if (normalized.includes("platform") || normalized === "pt") {
    return "플랫폼 스레드";
  }
  return mode;
}

export function runStatusLabel(status: RunStatus): string {
  switch (status) {
    case "queued":
      return "대기 중";
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
): "neutral" | "accent" | "success" | "danger" {
  switch (status) {
    case "queued":
      return "accent";
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
): "neutral" | "accent" | "success" | "danger" {
  const normalized = severity.toLowerCase();

  if (normalized.includes("critical") || normalized.includes("severe")) {
    return "danger";
  }
  if (normalized.includes("warn")) {
    return "accent";
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
