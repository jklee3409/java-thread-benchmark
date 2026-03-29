"use client";

import { useEffect, useRef, useState } from "react";
import { BenchmarkRunDetailResponse, isActiveRun } from "@/entities/benchmark";
import { getBenchmarkRun } from "@/features/benchmark-run/api/benchmark-run-api";

type UseRunDetailPollingProps = {
  apiBaseUrl: string;
  runId: number | null;
  onError: (message: string) => void;
  onActiveRun: (runId: number) => void;
};

export function useRunDetailPolling({
  apiBaseUrl,
  runId,
  onError,
  onActiveRun,
}: UseRunDetailPollingProps) {
  const [runDetail, setRunDetail] = useState<BenchmarkRunDetailResponse | null>(null);
  const onErrorRef = useRef(onError);
  const onActiveRunRef = useRef(onActiveRun);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    onActiveRunRef.current = onActiveRun;
  }, [onActiveRun]);

  useEffect(() => {
    if (runId == null) {
      setRunDetail(null);
      return;
    }

    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const loadRun = async () => {
      try {
        const detail = await getBenchmarkRun(apiBaseUrl, runId);
        if (!active) {
          return;
        }

        setRunDetail(detail);

        if (isActiveRun(detail.status)) {
          timer = setTimeout(() => {
            onActiveRunRef.current(detail.id);
            void loadRun();
          }, 3000);
        }
      } catch (error) {
        if (active) {
          onErrorRef.current(
            error instanceof Error && error.message
              ? `실험 상세를 불러오지 못했습니다. ${error.message}`
              : "실험 상세를 불러오지 못했습니다.",
          );
        }
      }
    };

    void loadRun();

    return () => {
      active = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [apiBaseUrl, runId]);

  return runDetail;
}
