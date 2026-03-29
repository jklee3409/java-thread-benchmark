import {
  DEFAULT_API_BASE_URL,
  DEFAULT_GRAFANA_BASE_URL,
  DEFAULT_GRAFANA_DASHBOARD_SLUG,
  DEFAULT_GRAFANA_DASHBOARD_UID,
  DEFAULT_PLATFORM_API_BASE_URL,
  DEFAULT_PROMETHEUS_BASE_URL,
  DEFAULT_VIRTUAL_API_BASE_URL,
  DEFAULT_WIREMOCK_BASE_URL,
} from "@/shared/constants/runtime";

export type MonitoringLink = {
  title: string;
  description: string;
  href: string;
  highlight: string;
};

export function getGrafanaDashboardUrl(): string {
  return `${trimTrailingSlash(DEFAULT_GRAFANA_BASE_URL)}/d/${DEFAULT_GRAFANA_DASHBOARD_UID}/${DEFAULT_GRAFANA_DASHBOARD_SLUG}?orgId=1`;
}

export function getGrafanaEmbedUrl(): string {
  return `${getGrafanaDashboardUrl()}&kiosk=tv&theme=light`;
}

export function getMonitoringLinks(): MonitoringLink[] {
  return [
    {
      title: "Grafana Dashboard",
      description:
        "Compare HTTP, DB, Redis, external I/O, HikariCP, and JVM thread metrics in one dashboard.",
      href: getGrafanaDashboardUrl(),
      highlight: "Grafana",
    },
    {
      title: "Prometheus",
      description: "Inspect raw metrics and scrape health directly from the monitoring backend.",
      href: DEFAULT_PROMETHEUS_BASE_URL,
      highlight: "Metrics",
    },
    {
      title: "Platform API",
      description: "Direct entry point for the platform-thread backend target.",
      href: DEFAULT_PLATFORM_API_BASE_URL,
      highlight: "8080",
    },
    {
      title: "Virtual API",
      description: "Direct entry point for the virtual-thread backend target.",
      href: DEFAULT_VIRTUAL_API_BASE_URL,
      highlight: "8081",
    },
    {
      title: "WireMock",
      description: "External API simulator used to reproduce blocking I/O and error scenarios.",
      href: DEFAULT_WIREMOCK_BASE_URL,
      highlight: "Mock API",
    },
    {
      title: "Default GUI Target",
      description: "Current default backend target for the dashboard runtime configuration.",
      href: DEFAULT_API_BASE_URL,
      highlight: "Default",
    },
  ];
}

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
