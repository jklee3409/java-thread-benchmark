"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn";

const NAV_ITEMS = [
  {
    href: "/",
    label: "홈",
    description: "실험 흐름",
  },
  {
    href: "/dashboard",
    label: "대시보드",
    description: "실행과 분석",
  },
  {
    href: "/monitoring",
    label: "모니터링",
    description: "실시간 추적",
  },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("sidebar-link", isActive && "sidebar-link-active")}
          >
            <strong>{item.label}</strong>
            <span className="sidebar-link-copy">{item.description}</span>
          </Link>
        );
      })}
    </nav>
  );
}
