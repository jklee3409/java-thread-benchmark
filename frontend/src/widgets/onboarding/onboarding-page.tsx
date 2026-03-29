"use client";

import Link from "next/link";

const QUICK_ITEMS = [
  {
    label: "Platform",
    value: "8080",
  },
  {
    label: "Virtual",
    value: "8081",
  },
  {
    label: "Grafana",
    value: "13000",
  },
] as const;

export function OnboardingPage() {
  return (
    <div className="overview-shell">
      <section className="panel overview-hero">
        <div className="overview-copy">
          <h1 className="page-title">Thread Benchmark Console</h1>
          <div className="cta-row">
            <Link href="/dashboard" className="primary">
              Dashboard
            </Link>
            <Link href="/dashboard#setup" className="secondary">
              Run Test
            </Link>
            <Link href="/monitoring" className="secondary">
              Monitoring
            </Link>
          </div>
        </div>

        <div className="overview-strip">
          {QUICK_ITEMS.map((item) => (
            <div key={item.label} className="overview-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
