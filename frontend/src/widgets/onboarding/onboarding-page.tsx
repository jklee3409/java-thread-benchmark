"use client";

import Link from "next/link";

const WORKFLOW_STEPS = [
  {
    step: "1",
    title: "실험 설정",
    description: "대상, 시나리오, 부하 조건을 정합니다.",
    href: "/dashboard#setup",
    action: "설정 열기",
  },
  {
    step: "2",
    title: "실행",
    description: "부하 테스트를 실행하고 상태를 확인합니다.",
    href: "/dashboard#execution",
    action: "실행 확인",
  },
  {
    step: "3",
    title: "결과 분석",
    description: "TPS, 지연 시간, 병목 메모를 검토합니다.",
    href: "/dashboard#results",
    action: "결과 보기",
  },
  {
    step: "4",
    title: "모니터링",
    description: "Grafana와 Prometheus로 시스템 지표를 추적합니다.",
    href: "/monitoring",
    action: "추적 열기",
  },
] as const;

const OVERVIEW_ITEMS = [
  {
    label: "비교 대상",
    value: "플랫폼 스레드 / 가상 스레드",
  },
  {
    label: "핵심 지표",
    value: "TPS, p95, p99, 오류율",
  },
  {
    label: "관측 범위",
    value: "MySQL, Redis, 외부 API, JVM",
  },
] as const;

export function OnboardingPage() {
  return (
    <div className="page-stack">
      <section className="panel page-intro">
        <div className="page-heading">
          <p className="section-label">시작</p>
          <h1 className="page-title">Java Thread 성능 비교 콘솔</h1>
          <p className="page-subtitle">
            이 도구는 Java Virtual Thread와 Platform Thread의 성능을 동일 조건에서
            비교·분석하기 위한 실험 플랫폼입니다.
          </p>
        </div>

        <div className="overview-strip">
          {OVERVIEW_ITEMS.map((item) => (
            <div key={item.label} className="overview-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="cta-row">
          <Link href="/dashboard" className="primary">
            대시보드 열기
          </Link>
          <Link href="/dashboard#setup" className="secondary">
            첫 실험 설정
          </Link>
          <Link href="/monitoring" className="secondary">
            실시간 추적
          </Link>
        </div>
      </section>

      <section className="page-section">
        <div className="section-head">
          <div>
            <p className="section-label">사용 흐름</p>
            <h2>실험은 네 단계로 진행합니다.</h2>
          </div>
        </div>

        <div className="step-grid">
          {WORKFLOW_STEPS.map((step) => (
            <article key={step.title} className="panel step-card">
              <span className="step-index">{step.step}</span>
              <strong className="step-title">{step.title}</strong>
              <p className="step-description">{step.description}</p>
              <Link href={step.href} className="step-action">
                {step.action}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
