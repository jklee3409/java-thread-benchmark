import Link from "next/link";
import { cn } from "@/shared/lib/cn";

type SiteHeaderProps = {
  current: "home" | "dashboard";
};

export function SiteHeader({ current }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-brand">
        <span className="site-brand-mark">TB</span>
        <div>
          <strong>Thread Bench Lab</strong>
          <p>스레드 성능 실험 워크스페이스</p>
        </div>
      </div>

      <nav className="site-nav">
        <Link href="/" className={cn("nav-link", current === "home" && "active")}>
          홈
        </Link>
        <Link
          href="/dashboard"
          className={cn("nav-link", current === "dashboard" && "active")}
        >
          실험실
        </Link>
      </nav>
    </header>
  );
}
