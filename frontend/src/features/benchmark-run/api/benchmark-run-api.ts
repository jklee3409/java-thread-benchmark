import {
  BenchmarkOptionsResponse,
  BenchmarkRunDetailResponse,
  BenchmarkRunExportResponse,
  BenchmarkRunSummaryResponse,
  CreateBenchmarkRunPayload,
} from "@/entities/benchmark";
import { fetchJson } from "@/shared/lib/api-client";

export function getBenchmarkOptions(apiBaseUrl: string) {
  return fetchJson<BenchmarkOptionsResponse>(apiBaseUrl, "/api/benchmarks/options");
}

export function getBenchmarkRuns(apiBaseUrl: string) {
  return fetchJson<BenchmarkRunSummaryResponse[]>(apiBaseUrl, "/api/benchmarks/runs");
}

export function getBenchmarkRun(apiBaseUrl: string, runId: number) {
  return fetchJson<BenchmarkRunDetailResponse>(apiBaseUrl, `/api/benchmarks/runs/${runId}`);
}

export function getBenchmarkRunExport(apiBaseUrl: string, runId: number) {
  return fetchJson<BenchmarkRunExportResponse>(
    apiBaseUrl,
    `/api/benchmarks/runs/${runId}/export`,
  );
}

export function createBenchmarkRun(
  apiBaseUrl: string,
  payload: CreateBenchmarkRunPayload,
) {
  return fetchJson<BenchmarkRunSummaryResponse>(apiBaseUrl, "/api/benchmarks/runs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
