export const DEFAULT_PLATFORM_API_BASE_URL =
  process.env.NEXT_PUBLIC_PLATFORM_API_BASE_URL ?? "http://localhost:8080";

export const DEFAULT_VIRTUAL_API_BASE_URL =
  process.env.NEXT_PUBLIC_VIRTUAL_API_BASE_URL ?? "http://localhost:8081";

export const DEFAULT_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_PLATFORM_API_BASE_URL;

export const DEFAULT_GRAFANA_BASE_URL =
  process.env.NEXT_PUBLIC_GRAFANA_BASE_URL ?? "http://localhost:13000";

export const DEFAULT_PROMETHEUS_BASE_URL =
  process.env.NEXT_PUBLIC_PROMETHEUS_BASE_URL ?? "http://localhost:19090";

export const DEFAULT_WIREMOCK_BASE_URL =
  process.env.NEXT_PUBLIC_WIREMOCK_BASE_URL ?? "http://localhost:18089";

export const DEFAULT_GRAFANA_DASHBOARD_UID =
  process.env.NEXT_PUBLIC_GRAFANA_DASHBOARD_UID ?? "threadbench-overview";

export const DEFAULT_GRAFANA_DASHBOARD_SLUG =
  process.env.NEXT_PUBLIC_GRAFANA_DASHBOARD_SLUG ?? "thread-benchmark-overview";
