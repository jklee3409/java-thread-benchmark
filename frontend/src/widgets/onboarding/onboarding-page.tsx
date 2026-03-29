import Link from "next/link";
import { getGrafanaDashboardUrl, getMonitoringLinks } from "@/features/monitoring";
import { SiteHeader } from "@/shared/ui/site-header";

const valueCards = [
  {
    title: "Operational Benchmark Flow",
    description:
      "Run JMeter scenarios, compare platform and virtual threads, and review stored benchmark history from one workflow.",
  },
  {
    title: "Layer Bottleneck Visibility",
    description:
      "Track DB, Redis, and external API latency separately so the bottleneck is visible instead of hidden inside one average response time.",
  },
  {
    title: "Monitoring Integration",
    description:
      "Prometheus and Grafana remain first-class tools, while the dashboard stays focused on benchmark orchestration and result review.",
  },
];

const onboardingSteps = [
  {
    step: "1",
    title: "Start the stack",
    description:
      "Boot MySQL, Redis, WireMock, Prometheus, Grafana, and both backend modes with Docker Compose.",
  },
  {
    step: "2",
    title: "Choose a target",
    description:
      "Point the dashboard to the platform or virtual backend so each run records an explicit thread mode.",
  },
  {
    step: "3",
    title: "Run a scenario",
    description:
      "Set concurrency, ramp-up, duration, delay, and contention options before triggering a JMeter-backed run.",
  },
  {
    step: "4",
    title: "Review the evidence",
    description:
      "Inspect run history, per-layer metrics, bottleneck notes, snapshots, and Grafana graphs together.",
  },
];

const scenarios = [
  {
    title: "Redis Heavy",
    description: "Warm-cache path focused on cache throughput and Redis latency stability.",
  },
  {
    title: "DB Heavy",
    description: "Direct MySQL read path used to surface Hikari pool pressure and JDBC blocking.",
  },
  {
    title: "IO Heavy",
    description: "External blocking call path used to compare VT/PT behavior under slow remote I/O.",
  },
  {
    title: "Mixed + Contention",
    description:
      "Composite service flow that mixes Redis, DB, and external calls, plus an explicit DB hold mode to trigger pool contention.",
  },
];

export function OnboardingPage() {
  const monitoringLinks = getMonitoringLinks().slice(0, 5);

  return (
    <main className="page-shell landing-shell">
      <SiteHeader current="home" />

      <section className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">JAVA 21 THREAD BENCHMARK LAB</p>
          <h1>Benchmark VT/PT behavior with realistic blocking layers and stored evidence.</h1>
          <p className="subtitle">
            This workspace is built for practical PoC work: repeatable runs, per-layer metrics,
            benchmark history, and direct links into Grafana and Prometheus.
          </p>
          <div className="hero-actions">
            <Link href="/dashboard" className="primary hero-action">
              Open dashboard
            </Link>
            <a
              href={getGrafanaDashboardUrl()}
              target="_blank"
              rel="noreferrer"
              className="secondary hero-action"
            >
              Open Grafana
            </a>
          </div>
        </div>

        <div className="hero-highlight">
          <div className="highlight-card highlight-card--accent">
            <span>Scope</span>
            <strong>Thread mode, concurrency, pool pressure, external delay, and layer metrics</strong>
          </div>
          <div className="highlight-grid">
            <div className="highlight-card">
              <span>Driver</span>
              <strong>JMeter CLI</strong>
            </div>
            <div className="highlight-card">
              <span>Monitoring</span>
              <strong>Prometheus + Grafana</strong>
            </div>
            <div className="highlight-card">
              <span>Backend Modes</span>
              <strong>Platform / Virtual</strong>
            </div>
            <div className="highlight-card">
              <span>Layer Tracking</span>
              <strong>DB / Redis / External</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="value-grid">
        {valueCards.map((card) => (
          <article key={card.title} className="feature-card">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </section>

      <section className="split-section">
        <div className="section-copy">
          <p className="section-label">Workflow</p>
          <h2>From stack startup to bottleneck review</h2>
          <p>
            The landing page keeps the flow explicit so the project is usable as a local PoC
            instead of a collection of disconnected tools.
          </p>
        </div>

        <div className="step-grid">
          {onboardingSteps.map((step) => (
            <article key={step.step} className="step-card">
              <span>{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section split-section--reverse">
        <div className="section-copy">
          <p className="section-label">Scenarios</p>
          <h2>Choose the workload that reveals the bottleneck you care about</h2>
          <p>
            Each scenario isolates a different blocking pattern so VT/PT comparisons stay grounded
            in observable workload behavior instead of one synthetic endpoint.
          </p>
        </div>

        <div className="scenario-grid">
          {scenarios.map((scenario) => (
            <article key={scenario.title} className="scenario-card">
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="environment-section">
        <div className="section-copy">
          <p className="section-label">Shortcuts</p>
          <h2>Jump directly into the running services</h2>
        </div>

        <div className="observability-links">
          {monitoringLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="observability-link-card"
            >
              <div>
                <strong>{link.title}</strong>
                <p>{link.description}</p>
              </div>
              <span>{link.highlight}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
