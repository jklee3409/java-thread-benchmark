import Link from "next/link";
import { cn } from "@/shared/lib/cn";

type SiteHeaderProps = {
  current: "home" | "dashboard";
};

export function SiteHeader({ current }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-brand">
        <span className="site-brand-mark">JT</span>
        <div>
          <strong>Java Thread Bench</strong>
          <p>Java 21 VT/PT benchmark workspace</p>
        </div>
      </div>

      <nav className="site-nav">
        <Link href="/" className={cn("nav-link", current === "home" && "active")}>
          Overview
        </Link>
        <Link
          href="/dashboard"
          className={cn("nav-link", current === "dashboard" && "active")}
        >
          Dashboard
        </Link>
      </nav>
    </header>
  );
}
