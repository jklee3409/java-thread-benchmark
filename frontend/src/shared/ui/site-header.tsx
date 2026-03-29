import Link from "next/link";

export function SiteHeader() {
  return (
    <div className="site-header-shell">
      <Link href="/" className="site-header-logo" aria-label="Thread Benchmark Console 홈">
        <span className="site-header-mark">TB</span>
        <span className="site-header-wordmark">Thread Benchmark Console</span>
      </Link>
    </div>
  );
}
