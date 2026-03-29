"use client";

import { useEffect, useState, useTransition } from "react";
import {
  BenchmarkOptionsResponse,
  BenchmarkRunSummaryResponse,
  runStatusLabel,
  threadModeLabel,
} from "@/entities/benchmark";
import {
  createBenchmarkRun,
  getBenchmarkOptions,
  getBenchmarkRuns,
} from "@/features/benchmark-run/api/benchmark-run-api";
import {
  applyOptionDefaults,
  EMPTY_RUN_FORM,
  RunFormState,
  toCreateBenchmarkRunPayload,
} from "@/features/benchmark-run/model/run-form";
import { useRunDetailPolling } from "@/features/benchmark-run/hooks/use-run-detail-polling";
import {
  DEFAULT_API_BASE_URL,
  DEFAULT_PLATFORM_API_BASE_URL,
  DEFAULT_VIRTUAL_API_BASE_URL,
} from "@/shared/constants/runtime";

export function useBenchmarkDashboard() {
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API_BASE_URL);
  const [options, setOptions] = useState<BenchmarkOptionsResponse | null>(null);
  const [runs, setRuns] = useState<BenchmarkRunSummaryResponse[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<number | null>(null);
  const [comparisonRunId, setComparisonRunId] = useState<number | null>(null);
  const [form, setForm] = useState<RunFormState>(EMPTY_RUN_FORM);
  const [message, setMessage] = useState(
    "실험 대상을 선택하고 조건을 입력한 뒤 실험을 실행하세요.",
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function loadDashboard(baseUrl: string) {
    setError("");

    try {
      const [loadedOptions, loadedRuns] = await Promise.all([
        getBenchmarkOptions(baseUrl),
        getBenchmarkRuns(baseUrl),
      ]);

      startTransition(() => {
        setOptions(loadedOptions);
        setRuns(loadedRuns);
        setForm((current) => applyOptionDefaults(current, loadedOptions));
      });

      const nextSelectedRunId = loadedRuns[0]?.id ?? null;
      setSelectedRunId((current) => {
        if (current != null && loadedRuns.some((run) => run.id === current)) {
          return current;
        }
        return nextSelectedRunId;
      });
      setComparisonRunId((current) => {
        if (current != null && loadedRuns.some((run) => run.id === current)) {
          return current;
        }
        return loadedRuns.find((run) => run.id !== nextSelectedRunId)?.id ?? null;
      });

      setMessage(`현재 연결 대상: ${threadModeLabel(loadedOptions.currentMode)}`);
    } catch (loadError) {
      setError(toUserErrorMessage(loadError, "대시보드 정보를 불러오지 못했습니다."));
    }
  }

  useEffect(() => {
    void loadDashboard(apiBaseUrl);
  }, [apiBaseUrl]);

  async function refreshRuns(preferredRunId?: number) {
    setError("");
    try {
      const refreshedRuns = await getBenchmarkRuns(apiBaseUrl);
      startTransition(() => setRuns(refreshedRuns));
      const nextRunId =
        preferredRunId ??
        (selectedRunId != null && refreshedRuns.some((run) => run.id === selectedRunId)
          ? selectedRunId
          : refreshedRuns[0]?.id ?? null);
      setSelectedRunId(nextRunId);
      setComparisonRunId((current) => {
        if (current != null && current !== nextRunId && refreshedRuns.some((run) => run.id === current)) {
          return current;
        }
        return refreshedRuns.find((run) => run.id !== nextRunId)?.id ?? null;
      });
    } catch (refreshError) {
      setError(toUserErrorMessage(refreshError, "실험 목록을 새로고침하지 못했습니다."));
    }
  }

  async function submitRun() {
    setError("");

    try {
      const created = await createBenchmarkRun(
        apiBaseUrl,
        toCreateBenchmarkRunPayload(form, options),
      );

      setMessage(`실험 #${created.id} 생성 완료. 현재 상태: ${runStatusLabel(created.status)}`);
      await refreshRuns(created.id);
    } catch (createError) {
      setError(toUserErrorMessage(createError, "실험을 생성하지 못했습니다."));
    }
  }

  const selectedRun = useRunDetailPolling({
    apiBaseUrl,
    runId: selectedRunId,
    onError: setError,
    onActiveRun: (runId) => {
      void refreshRuns(runId);
    },
  });

  const comparisonRun = useRunDetailPolling({
    apiBaseUrl,
    runId: comparisonRunId,
    onError: setError,
    onActiveRun: (runId) => {
      void refreshRuns(runId);
    },
  });

  return {
    apiBaseUrl,
    options,
    runs,
    selectedRunId,
    comparisonRunId,
    selectedRun,
    comparisonRun,
    form,
    message,
    error,
    isPending,
    setApiBaseUrl,
    setComparisonRunId,
    setSelectedRunId,
    setForm,
    presetTargets: [
      {
        label: "플랫폼 스레드",
        url: DEFAULT_PLATFORM_API_BASE_URL,
      },
      {
        label: "버추얼 스레드",
        url: DEFAULT_VIRTUAL_API_BASE_URL,
      },
    ],
    refreshConnection: () => loadDashboard(apiBaseUrl),
    refreshRuns,
    submitRun,
  };
}

function toUserErrorMessage(error: unknown, prefix: string): string {
  if (error instanceof Error && error.message) {
    return `${prefix} ${error.message}`;
  }
  return prefix;
}
