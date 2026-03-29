"use client";

import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "@/shared/ui/sidebar-nav";
import { SiteHeader } from "@/shared/ui/site-header";

const PAGE_META = {
  "/": {
    title: "홈",
    subtitle: "실험 흐름과 시작 지점을 빠르게 확인합니다.",
  },
  "/dashboard": {
    title: "대시보드",
    subtitle: "실험 설정, 실행, 분석, 비교, 이력을 한 화면에서 관리합니다.",
  },
  "/monitoring": {
    title: "모니터링",
    subtitle: "Grafana와 Prometheus 기반 지표를 실시간으로 추적합니다.",
  },
} as const;

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const currentPage = resolvePageMeta(pathname);

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="주요 탐색">
        <div className="sidebar-section-label">탐색</div>
        <SidebarNav />

        <div className="sidebar-note">
          <strong>실험 범위</strong>
          <p>Java 21 플랫폼 스레드 / 가상 스레드 비교</p>
        </div>
        <div className="sidebar-note">
          <strong>관측 도구</strong>
          <p>Grafana, Prometheus, MySQL, Redis, WireMock</p>
        </div>
      </aside>

      <div className="app-main">
        <SiteHeader title={currentPage.title} subtitle={currentPage.subtitle} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}

function resolvePageMeta(pathname: string) {
  if (pathname.startsWith("/dashboard")) {
    return PAGE_META["/dashboard"];
  }

  if (pathname.startsWith("/monitoring")) {
    return PAGE_META["/monitoring"];
  }

  return PAGE_META["/"];
}
