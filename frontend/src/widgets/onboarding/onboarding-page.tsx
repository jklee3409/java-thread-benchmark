"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BenchmarkRunSummaryResponse,
  formatDateTime,
  formatNumber,
  runStatusLabel,
  runStatusTone,
  scenarioLabel,
  threadModeLabel,
} from "@/entities/benchmark";
import { getBenchmarkRuns } from "@/features/benchmark-run/api/benchmark-run-api";
import { getGrafanaDashboardUrl } from "@/features/monitoring";
import { DEFAULT_API_BASE_URL } from "@/shared/constants/runtime";
import { EmptyState } from "@/shared/ui/empty-state";
import { SiteHeader } from "@/shared/ui/site-header";
import { StatusPill } from "@/shared/ui/status-pill";

const flowCards = [
  {
    label: "실험 설정",
    title: "스레드 방식과 부하 조건을 정합니다",
    description:
      "플랫폼 스레드와 버추얼 스레드 중 대상을 고르고, 동시 사용자 수와 실행 시간을 같은 조건으로 맞춥니다.",
    highlights: ["스레드 방식 선택", "부하 조건 입력"],
    href: "/dashboard#setup",
    action: "설정 열기",
  },
  {
    label: "실험 실행",
    title: "부하 테스트를 바로 실행합니다",
    description:
      "설정이 끝나면 대시보드에서 즉시 실행하고, 진행 상태와 완료 여부를 한 화면에서 확인합니다.",
    highlights: ["실행 상태 확인", "실패 여부 점검"],
    href: "/dashboard#execute",
    action: "실행 화면으로",
  },
  {
    label: "결과 분석",
    title: "핵심 지표부터 병목까지 이어서 봅니다",
    description:
      "응답 시간, TPS, 오류율을 먼저 보고, DB·Redis·외부 API 병목과 비교 결과를 아래에서 상세하게 확인합니다.",
    highlights: ["결과 요약", "상세 병목 분석"],
    href: "/dashboard#results",
    action: "분석 보기",
  },
];

export function OnboardingPage() {
  const [runs, setRuns] = useState<BenchmarkRunSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadRuns = async () => {
      try {
        const loadedRuns = await getBenchmarkRuns(DEFAULT_API_BASE_URL);
        if (!active) {
          return;
        }
        setRuns(loadedRuns.slice(0, 4));
      } catch (loadError) {
        if (!active) {
          return;
        }
        setError(
          loadError instanceof Error && loadError.message
            ? `최근 결과를 불러오지 못했습니다. ${loadError.message}`
            : "최근 결과를 불러오지 못했습니다.",
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadRuns();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="page-shell landing-shell">
      <SiteHeader current="home" />

      <section className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">스레드 성능 실험 워크스페이스</p>
          <h1>스레드 성능을 직접 비교해보세요</h1>
          <p className="subtitle">
            Virtual Thread와 Platform Thread를 같은 부하 조건에서 실행하고, 결과 요약과 병목
            분석을 한 흐름으로 확인합니다.
          </p>
          <div className="hero-actions">
            <Link href="/dashboard#setup" className="primary hero-action">
              실험 시작하기
            </Link>
            <Link href="/dashboard#history" className="secondary hero-action">
              최근 결과 보기
            </Link>
            <a
              href={getGrafanaDashboardUrl()}
              target="_blank"
              rel="noreferrer"
              className="secondary hero-action"
            >
              대시보드 보기
            </a>
          </div>
        </div>

        <aside className="quick-start-panel">
          <div className="panel-head panel-head--spread">
            <div>
              <p className="section-label">빠른 시작</p>
              <h2>어디서 시작하고 어디서 결과를 보는지 바로 알 수 있습니다</h2>
            </div>
            <StatusPill tone="accent">3단계 흐름</StatusPill>
          </div>

          <div className="summary-grid">
            <div className="summary-item">
              <span>시작 위치</span>
              <strong>실험 설정</strong>
              <p>대시보드에서 대상과 부하 조건을 정합니다.</p>
            </div>
            <div className="summary-item">
              <span>실행 위치</span>
              <strong>부하 테스트 실행</strong>
              <p>실행 버튼으로 바로 시작하고 상태를 확인합니다.</p>
            </div>
            <div className="summary-item">
              <span>결과 위치</span>
              <strong>최근 결과와 상세 분석</strong>
              <p>요약 지표를 먼저 보고 병목으로 내려갑니다.</p>
            </div>
            <div className="summary-item">
              <span>추적 도구</span>
              <strong>Grafana 대시보드</strong>
              <p>실시간 메트릭과 장기 추세를 별도로 확인합니다.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="workspace-block">
        <div className="block-head">
          <p className="section-label">사용 흐름</p>
          <h2>설명이 아니라 행동 순서가 먼저 보이도록 재구성했습니다</h2>
        </div>

        <div className="workflow-grid">
          {flowCards.map((card) => (
            <article key={card.title} className="workflow-card">
              <div className="workflow-head">
                <span>{card.label}</span>
                <strong>{card.title}</strong>
              </div>
              <p>{card.description}</p>
              <div className="flow-chip-list">
                {card.highlights.map((highlight) => (
                  <span key={highlight} className="flow-chip">
                    {highlight}
                  </span>
                ))}
              </div>
              <Link href={card.href} className="flow-link">
                {card.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="workspace-block" id="recent-runs">
        <div className="block-head block-head--spread">
          <div>
            <p className="section-label">최근 실험 결과</p>
            <h2>최근 결과 요약을 먼저 보고 바로 상세 분석으로 이동할 수 있습니다</h2>
          </div>
          <Link href="/dashboard#history" className="ghost-link">
            전체 결과 보기
          </Link>
        </div>

        {isLoading ? (
          <div className="panel recent-runs-loading">
            <strong>최근 결과를 불러오는 중입니다</strong>
            <p>방금 실행한 실험이 있다면 이 영역에서 바로 확인할 수 있습니다.</p>
          </div>
        ) : error ? (
          <EmptyState
            title="최근 결과를 아직 보여줄 수 없습니다."
            message={error}
            action={
              <Link href="/dashboard#setup" className="secondary hero-action">
                실험 시작하기
              </Link>
            }
          />
        ) : runs.length === 0 ? (
          <EmptyState
            title="아직 저장된 실험 결과가 없습니다."
            message="대시보드에서 첫 실험을 실행하면 이 영역에 최근 결과가 채워집니다."
            action={
              <Link href="/dashboard#setup" className="secondary hero-action">
                실험 시작하기
              </Link>
            }
          />
        ) : (
          <div className="recent-run-list">
            {runs.map((run) => (
              <Link
                key={run.id}
                href={`/dashboard?runId=${run.id}#results`}
                className="recent-run-card"
              >
                <div className="recent-run-top">
                  <div>
                    <strong>실험 #{run.id}</strong>
                    <p>{formatDateTime(run.completedAt ?? run.startedAt ?? run.createdAt)}</p>
                  </div>
                  <StatusPill tone={runStatusTone(run.status)}>
                    {runStatusLabel(run.status)}
                  </StatusPill>
                </div>

                <div className="recent-run-stats">
                  <div>
                    <span>스레드 방식</span>
                    <strong>{threadModeLabel(run.mode)}</strong>
                  </div>
                  <div>
                    <span>시나리오</span>
                    <strong>{scenarioLabel(run.scenario)}</strong>
                  </div>
                  <div>
                    <span>TPS</span>
                    <strong>{formatNumber(run.throughput)} req/s</strong>
                  </div>
                  <div>
                    <span>P95 / 오류율</span>
                    <strong>
                      {formatNumber(run.p95LatencyMs)} ms / {formatNumber(run.errorRate)}%
                    </strong>
                  </div>
                </div>

                <span className="flow-link">결과 상세 보기</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
