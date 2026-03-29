"use client";

import { PropsWithChildren } from "react";
import { SidebarNav } from "@/shared/ui/sidebar-nav";
import { SiteHeader } from "@/shared/ui/site-header";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <SiteHeader />

      <div className="app-body">
        <aside className="app-sidebar" aria-label="Dashboard">
          <strong className="app-sidebar-title">Dashboard</strong>
          <SidebarNav />
        </aside>

        <main className="app-main">
          <div className="app-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
