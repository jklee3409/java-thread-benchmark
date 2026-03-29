"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Overview",
  },
  {
    href: "/dashboard",
    label: "Benchmark",
  },
  {
    href: "/monitoring",
    label: "Monitor",
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
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
